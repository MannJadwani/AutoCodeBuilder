import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GeneratedCodePage = () => {
  const location = useLocation();
  const { prompt } = location.state || { prompt: 'No prompt provided.' };
  const [code, setCode] = useState('');

  useEffect(() => {
    const generateCode = async () => {
      try {
        const response = await fetch('https://vigilant-waddle-67wv7xqj7rq2496j-5000.app.github.dev/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API response:', data); // Log the API response
          setCode(data.generatedCode || 'No code returned.');
        } else {
          console.error('Failed to fetch code:', response.statusText);
          setCode('Error generating code.');
        }
      } catch (error) {
        console.error('Error fetching code:', error);
        setCode('Error generating code.');
      }
    };

    generateCode();
  }, [prompt]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Generated Code</h1>
        <pre className="bg-gray-200 p-4 rounded-md border border-gray-300 overflow-x-auto">
          {code || 'Generating code...'}
        </pre>
      </div>
    </div>
  );
};

export default GeneratedCodePage;
