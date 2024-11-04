const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const http = require('http');
const { Server } = require('socket.io');
const openai = require('openai');

const app = express();
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
  origin: 'https://vigilant-waddle-67wv7xqj7rq2496j-5173.app.github.dev',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

// Initialize Socket.IO with CORS options
const io = new Server(server, { cors: corsOptions });

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize current working directory
let currentDir = process.cwd();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('run-command', (command) => {
    if (command.startsWith('cd ')) {
      const newDir = command.slice(3).trim();
      try {
        process.chdir(newDir); // Change the current working directory
        currentDir = process.cwd(); // Update currentDir
        socket.emit('command-output', `Changed directory to ${currentDir}`);
      } catch (error) {
        socket.emit('command-output', `Error: ${error.message}`);
      }
    } else {
      const process = exec(command, { cwd: currentDir }); // Run the command in the current directory

      process.stdout.on('data', (data) => {
        socket.emit('command-output', data);
      });

      process.stderr.on('data', (data) => {
        socket.emit('command-output', `Error: ${data}`);
      });

      process.on('close', (code) => {
        socket.emit('command-output', `Process exited with code ${code}`);
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.post('/generate', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Make sure this is the correct model ID
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: req.body.prompt || "Write a haiku about recursion in programming." }, // Use the prompt from the request
      ],
    });
    res.json(completion); // Send the completion response as JSON
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Failed to generate code.' });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on https://vigilant-waddle-67wv7xqj7rq2496j-5000.app.github.dev`);
});
