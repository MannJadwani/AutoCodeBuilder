import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CodeGeneratorPage = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (prompt.trim()) {
      // Redirect to the results page with the prompt
      navigate('/generated-code', { state: { prompt } });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Code Generator</h1>
        <p className="text-gray-600 mb-4 text-center">Enter a prompt to generate code for your website.</p>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Generate Code
        </button>
      </div>
    </div>
  );
};

export default CodeGeneratorPage;
