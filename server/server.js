require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Models
const Interaction = require('./models/Interaction');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected successfully'))
.catch((err) => console.log('MongoDB Connection Error:', err));

// Basic API Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// OpenRouter AI Route
app.post('/api/ask-ai', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openrouter/auto',
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to fetch AI response');
        }

        const data = await response.json();
        res.json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenRouter API:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Save AI Interaction Route
app.post('/api/save', async (req, res) => {
    const { prompt, response } = req.body;

    if (!prompt || !response) {
        return res.status(400).json({ error: 'Both prompt and response are required' });
    }

    try {
        const newInteraction = new Interaction({
            prompt,
            response
        });

        await newInteraction.save();
        res.status(201).json({ message: 'Interaction saved successfully!', interaction: newInteraction });
    } catch (error) {
        console.error('Error saving interaction:', error.message);
        res.status(500).json({ error: 'Failed to save to database', details: error.message });
    }
});

// Get AI Interaction History Route
app.get('/api/history', async (req, res) => {
    try {
        const history = await Interaction.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error.message);
        res.status(500).json({ error: 'Failed to fetch history', details: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
