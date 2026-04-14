require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===================== MIDDLEWARE =====================

// Security headers (relaxed for local CDN usage)
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// CORS - allow same origin
app.use(cors());

// Parse JSON body
app.use(express.json({ limit: '1mb' }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname), {
    // Don't serve .env or server files
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.env') || filePath.endsWith('server.js')) {
            res.status(403).end('Forbidden');
        }
    }
}));

// Block direct access to sensitive files
app.get('/.env', (req, res) => res.status(403).json({ error: 'Forbidden' }));
app.get('/server.js', (req, res) => res.status(403).json({ error: 'Forbidden' }));
app.get('/.env.example', (req, res) => res.status(403).json({ error: 'Forbidden' }));

// ===================== RATE LIMITING =====================

// Chat endpoint: max 15 requests per minute per IP
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    message: { error: 'Terlalu banyak request. Coba lagi dalam 1 menit.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Contact endpoint: max 3 requests per 10 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: { error: 'Terlalu banyak pesan. Coba lagi nanti.' },
    standardHeaders: true,
    legacyHeaders: false
});

// ===================== API: GEMINI CHAT PROXY =====================

app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
        const { message, systemPrompt } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        if (message.length > 2000) {
            return res.status(400).json({ error: 'Pesan terlalu panjang (max 2000 karakter).' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not set in .env');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: message }] }],
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
        };

        if (systemPrompt) {
            payload.systemInstruction = { parts: [{ text: systemPrompt }] };
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Mengirim referer agar lolos dari proteksi API Key Google (API_KEY_HTTP_REFERRER_BLOCKED)
                'Referer': req.headers.referer || 'https://g1ts-3.github.io/',
                'Origin': req.headers.origin || 'https://g1ts-3.github.io'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            return res.status(502).json({ error: 'AI service unavailable.' });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponse) {
            res.json({ response: aiResponse });
        } else {
            res.json({ response: 'Maaf, aku tidak bisa memproses permintaan ini.' });
        }

    } catch (error) {
        console.error('Chat proxy error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ===================== API: CONTACT FORM EMAIL =====================

// Create reusable transporter
let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return transporter;
}

app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, dan pesan wajib diisi.' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Format email tidak valid.' });
        }

        if (message.length > 5000) {
            return res.status(400).json({ error: 'Pesan terlalu panjang (max 5000 karakter).' });
        }

        // Check if email is configured
        if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_gmail_app_password_here') {
            console.warn('EMAIL_PASS not configured. Logging message instead.');
            console.log('=== CONTACT FORM MESSAGE ===');
            console.log(`From: ${name} <${email}>`);
            console.log(`Subject: ${subject || 'No Subject'}`);
            console.log(`Message: ${message}`);
            console.log('============================');
            return res.json({ 
                success: true, 
                message: 'Pesan diterima! (Mode dev: pesan ditampilkan di console server)' 
            });
        }

        const mailOptions = {
            from: `"Portfolio Contact - ${name}" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            replyTo: email,
            subject: `[Portfolio] ${subject || 'Pesan dari ' + name}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1e293b; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #d97706, #ea580c, #e11d48); padding: 24px; text-align: center;">
                        <h2 style="margin: 0; color: white; font-size: 20px;">📩 Pesan Baru dari Portfolio</h2>
                    </div>
                    <div style="padding: 24px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; width: 80px;">Nama</td>
                                <td style="padding: 8px 0; font-weight: 600;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8;">Email</td>
                                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8;">Subject</td>
                                <td style="padding: 8px 0;">${subject || '-'}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 16px; padding: 16px; background: #0f172a; border-radius: 8px; border-left: 4px solid #f59e0b;">
                            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
                        </div>
                    </div>
                    <div style="padding: 16px 24px; background: #0f172a; text-align: center; font-size: 12px; color: #64748b;">
                        Dikirim via Git's Portfolio Contact Form
                    </div>
                </div>
            `
        };

        await getTransporter().sendMail(mailOptions);
        res.json({ success: true, message: 'Pesan berhasil dikirim! Terima kasih 🎉' });

    } catch (error) {
        console.error('Email error:', error.message);
        
        if (error.message.includes('Invalid login') || error.message.includes('EAUTH')) {
            return res.status(500).json({ 
                error: 'Konfigurasi email belum selesai. Silakan cek .env file.' 
            });
        }
        
        res.status(500).json({ error: 'Gagal mengirim pesan. Coba lagi nanti.' });
    }
});

// ===================== START SERVER =====================

app.listen(PORT, () => {
    console.log(`\n🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${__dirname}`);
    console.log(`🔒 API Key: ${process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Not set'}`);
    console.log(`📧 Email: ${process.env.EMAIL_USER || '❌ Not set'}`);
    console.log(`📧 Email Pass: ${process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your_gmail_app_password_here' ? '✅ Configured' : '⚠️  Not configured (contact form will log to console)'}`);
    console.log('');
});
