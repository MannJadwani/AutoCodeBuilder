const express = require('express');
const cors = require('cors');
const OpenAI = require('openai')
require('dotenv').config()
const app = express();
const PORT = 5000;

const openai= new OpenAI({apiKey:process.env.OPENAI_API_KEY})

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', 
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic /generate route
app.post('/generate', async (req, res) => {
  // Example response data
  const responseText = req.body.prompt ? `Received prompt: ${req.body.prompt}` : 'No prompt provided';
  console.log(responseText)
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "system", content: "you are a coding assistance, you accept ideas from users and generate code for it" },
        {
            role: "user",
            content: `${req.body.prompt}`,
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
