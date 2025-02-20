import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import io from 'socket.io-client';

// Connect to the backend's Socket.IO server
const socket = io('http://localhost:5000');

function App() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // Listen for document updates from the server
    socket.on('doc-update', (data) => {
      setMarkdown(data);
    });

    // Clean up on unmount
    return () => {
      socket.off('doc-update');
    };
  }, []);

  const handleChange = (e) => {
    const newText = e.target.value;
    setMarkdown(newText);
    // Emit changes to the server so other clients can receive updates
    socket.emit('doc-update', newText);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Community-Driven Documentation Editor</h1>
      <textarea
        style={{ width: '100%', height: '150px', marginBottom: '20px' }}
        value={markdown}
        onChange={handleChange}
        placeholder="Type your markdown here..."
      />
      <h2>Live Preview</h2>
      <div style={{ border: '1px solid #ddd', padding: '10px' }}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;