const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const app = express();
const PORT = 5000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', 
}));

// Middleware to parse JSON bodies
app.use(express.json());

// /generate route to create JSON structure for Vite React project
app.post('/generate', async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    // Prompt for generating a structured file system JSON for a Vite React project
    const promptForAI = `
      Generate a JSON structure that outlines a Vite React project file architecture based on the following prompt:
      - Include directories like src, components, pages, assets, and utils.
      - Make Sure to consider the actual code that could go in each files and generate the files accordingly
      - Include GlobalContext.js in the utils folder 
      - For each file or folder, specify if it is a file or folder.
      - Provide a brief description for each component and its purpose.
      - List any dependencies that should be included for this project.
      - Outline additional setup steps if necessary.
      - Include Commands to be run for setting up the project.

      User prompt: "${userPrompt}"
    `;

    // Make the OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an assistant that generates structured JSON file architectures for Vite React projects based on user requirements." },
        { role: "user", content: promptForAI }
      ],
      functions: [
        {
          name: "generate_file_structure",
          description: "Generates a JSON file structure for a Vite React app",
          parameters: {
            type: "object",
            properties: {
              fileStructure: {
                type: "array",
                description: "The project's file and folder structure",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "The name of the file or folder" },
                    type: { type: "string", enum: ["file", "folder"], description: "Indicates whether this is a file or folder" },
                    children: {
                      type: "array",
                      description: "Nested files or folders inside this folder",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string", description: "The name of the nested file or folder" },
                          type: { type: "string", enum: ["file", "folder"], description: "Indicates whether this is a file or folder" }
                        },
                        required: ["name", "type"]
                      }
                    }
                  },
                  required: ["name", "type"]
                }
              },
              dependencies: {
                type: "array",
                description: "List of project dependencies",
                items: { type: "string" }
              },
              setupCommands: {
                type: "array",
                description: "cli commands or setup steps for the project",
                items: { type: "string" }
              }
            },
            required: ["fileStructure", "dependencies", "setupSteps"]
          }
        }
      ],
      function_call: { name: "generate_file_structure" }
    });

    // Access the generated JSON structure directly
    const generatedJSON = completion.choices[0].message.function_call.arguments;

    res.json({ generatedCode: JSON.parse(generatedJSON) });
  } catch (error) {
    console.error('Error fetching code structure:', error);
    res.status(500).json({ message: 'Error generating code structure.' });
  }
});

// Simple test route for basic server functionality
app.get('/test', (req, res) => {
  res.send('Test endpoint is working!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
