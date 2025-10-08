import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const App = () => (
  <BrowserRouter basename="/zen-vibe-quotes">
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>ZenVibe</h1>
      <p>Loading quotes... (Test build)</p>
    </div>
  </BrowserRouter>
);

const root = createRoot(document.getElementById('root'));
root.render(<App />);
