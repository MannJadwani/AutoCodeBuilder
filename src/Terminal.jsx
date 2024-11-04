// src/Terminal.jsx
import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from 'xterm-addon-fit';
import '@xterm/xterm/css/xterm.css';

const TerminalComponent = () => {
    const terminalRef = useRef(null);

    useEffect(() => {
        const xterm = new Terminal();
        const fitAddon = new FitAddon();
        xterm.loadAddon(fitAddon);
        xterm.open(terminalRef.current);
        fitAddon.fit();

        xterm.write('Welcome to the Vite Terminal!\r\n');
        xterm.write('$ ');

        xterm.onData((data) => {
            xterm.write(data);
            if (data === '\r') {
                xterm.write('\n$ ');
            }
        });

        return () => xterm.dispose();
    }, []);

    return <div ref={terminalRef} style={{ width: '100%', height: '100vh' }} />;
};

export default TerminalComponent;
