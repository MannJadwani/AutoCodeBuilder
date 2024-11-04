// src/ProjectViewer.jsx
import React, { useState } from 'react';

const ProjectViewer = () => {
    const [projectPath, setProjectPath] = useState('');
    const [iframeSrc, setIframeSrc] = useState('');

    const handleInputChange = (e) => {
        setProjectPath(e.target.value);
    };

    const loadProject = () => {
        setIframeSrc(projectPath);
        console.log(projectPath)
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>React Project Viewer</h2>
            <input
                type="text"
                placeholder="Enter the URL/path of the React project"
                value={projectPath}
                onChange={handleInputChange}
                style={{ width: '300px', marginBottom: '10px' }}
            />
            <button onClick={loadProject}>Load Project</button>
            {iframeSrc && (
                <iframe
                    src={iframeSrc}
                    title="Project Preview"
                    style={{
                        width: '100%',
                        height: '80vh',
                        border: '1px solid #ccc',
                        marginTop: '20px'
                    }}
                ></iframe>
            )}
        </div>
    );
};

export default ProjectViewer;
