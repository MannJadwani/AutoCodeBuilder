import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ProjectViewer from './ProjectViewer'

// Connect to Socket.io server
const socket = io('https://vigilant-waddle-67wv7xqj7rq2496j-5000.app.github.dev');

function CodeMaker() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]); // Store commands and outputs
  const terminalRef = useRef(null);

  useEffect(() => {
    // Listen for output from the server
    const handleCommandOutput = (data) => {
      setHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];

        // Only update the last entry if it exists
        if (updatedHistory.length > 0) {
          const lastEntry = updatedHistory[updatedHistory.length - 1];

          // Append the output to the last command's output
          if (!lastEntry.output.endsWith(data)) { // Check for duplicates
            lastEntry.output += data; // Append new data
            updatedHistory[updatedHistory.length - 1] = lastEntry; // Update last entry
          }
        }

        return updatedHistory; // Return the updated history
      });

      // Scroll to the bottom when new data is added
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    };

    // Attach the event listener
    socket.on('command-output', handleCommandOutput);

    // Clean up the event listener on unmount
    return () => {
      socket.off('command-output', handleCommandOutput);
    };
  }, []);

  const handleRunCommand = () => {
    if (command.trim()) {
      // Add command to history with an empty output initially
      setHistory((prevHistory) => [
        ...prevHistory,
        { command, output: '' },
      ]);
      socket.emit('run-command', command); // Send the command to the server
      setCommand(''); // Clear the input field
    }
  };

  return (
   <div className='flex w-[100vw] justify-around items-center '>
     <div className="flex flex-1 flex-col items-center min-h-screen bg-gray-900 p-5 text-white font-mono">
      <h1 className="text-2xl font-bold mb-6 text-green-400">Real-Time Terminal Command Runner</h1>

      {/* Terminal Container */}
      <div className="w-full max-w-xl p-4 bg-black rounded-lg shadow-lg">
        {/* Terminal Output */}
        <div
          ref={terminalRef}
          className="h-80 overflow-y-auto bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700"
        >
          {history.length > 0 ? (
            history.map((entry, index) => (
              <div key={index} className="mb-2">
                <div className="text-green-400">
                  $ {entry.command}
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-200">
                  {entry.output || 'Running...'}
                </pre>
              </div>
            ))
          ) : (
            <pre className="text-gray-500">Enter a command to see output here...</pre>
          )}
        </div>

        {/* Command Input */}
        <div className="flex space-x-2">
          <span className="text-green-400">$</span>
          <input
            type="text"
            placeholder="Enter command"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-grow bg-gray-800 p-2 rounded-md text-white focus:outline-none border border-gray-700"
            onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
          />
          <button
            onClick={handleRunCommand}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
          >
            Run
          </button>
        </div>
      </div>
      
    </div>
  <div className='flex-1'><ProjectViewer/></div>
   </div>
  );
}

export default CodeMaker;
