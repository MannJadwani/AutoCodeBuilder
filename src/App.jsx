import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeGeneratorPage from './CodeGeneratorPage';
import GeneratedCodePage from './GeneratedCodePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CodeGeneratorPage />} />
        <Route path="/generated-code" element={<GeneratedCodePage />} />
      </Routes>
    </Router>
  );
};

export default App;
