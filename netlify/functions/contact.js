const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { name, email, subject, message } = JSON.parse(event.body);

        if (!name || !email || !message) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Name, email, dan pesan wajib diisi.' }) };
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Portfolio Contact - ${name}" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            replyTo: email,
            subject: `[Portfolio] ${subject || 'Pesan dari ' + name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1e293b; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #d97706, #ea580c, #e11d48); padding: 24px; text-align: center;">
                        <h2 style="margin: 0; color: white; font-size: 20px;">📩 Pesan Baru</h2>
                    </div>
                    <div style="padding: 24px;">
                        <p><strong>Nama:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject || '-'}</p>
                        <hr style="border-color: #334155;">
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, message: 'Pesan berhasil dikirim!' })
        };

    } catch (error) {
        console.error('Email error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengirim pesan.' }) };
    }
};
