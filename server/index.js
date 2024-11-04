const express = require('express');
const cors = require('cors');
const OpenAI = require('openai')
require('dotenv').config()
const app = express();
const PORT = 5000;

const openai= new OpenAI({apiKey:process.env.OPENAI_API_KEY})

// Enable CORS
app.use(cors({
  origin: 'https://vigilant-waddle-67wv7xqj7rq2496j-5173.app.github.dev', // Replace with your frontend origin
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic /generate route
app.post('/generate', async (req, res) => {
  // Example response data
  const responseText = req.body.prompt ? `Received prompt: ${req.body.prompt}` : 'No prompt provided';
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
});

console.log(completion.choices[0].message);
  res.json({ message: completion.choices[0].message });
});

// Simple test route for basic server functionality
app.get('/test', (req, res) => {
  res.send('Test endpoint is working!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
