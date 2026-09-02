module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const API_KEY = process.env.GEMINI_API_KEY; 
    const targetModel = req.body.model || 'gemini-1.5-flash'; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${API_KEY}`;

    const geminiPayload = { ...req.body };
    delete geminiPayload.model;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Extract API Error:", error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

module.exports.config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
};