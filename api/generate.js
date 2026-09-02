module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const API_KEY = process.env.GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Generate API Error:", error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Konfigurasi ini yang akan mengatasi HTTP Error 413
module.exports.config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
};