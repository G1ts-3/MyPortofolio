// Using native fetch available in Node.js 18+

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { message, systemPrompt } = JSON.parse(event.body);

        if (!message || message.trim().length === 0) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Pesan tidak boleh kosong.' }) };
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error.' }) };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response: aiResponse || 'Maaf, aku tidak bisa memproses permintaan ini.' })
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error.' }) };
    }
};
