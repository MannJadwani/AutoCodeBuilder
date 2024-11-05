import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GeneratedCodePage = () => {
  const location = useLocation();
  const { prompt } = location.state || { prompt: 'No prompt provided.' };
  const [codeStructure, setCodeStructure] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const generateCodeStructure = async () => {
      try {
        const response = await fetch('http://localhost:5000/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API response:', data); // Log the API response
          setCodeStructure(JSON.stringify(data.generatedCode), null, 2); // Format JSON with indentation
          setIsError(false);
        } else {
          console.error('Failed to fetch code structure:', response.statusText);
          setCodeStructure('Error generating code structure.');
          setIsError(true);
        }
      } catch (error) {
        console.error('Error fetching code structure:', error);
        setCodeStructure('Error generating code structure.');
        setIsError(true);
      }
    };

    generateCodeStructure();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Generated Project Structure</h1>
        <pre className={`bg-gray-200 p-4 rounded-md border border-gray-300 overflow-x-auto ${isError ? 'text-red-500' : ''}`}>
          {codeStructure || 'Generating structure...'}
        </pre>
      </div>
    </div>
  );
};

export default GeneratedCodePage;
