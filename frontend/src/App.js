import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import io from 'socket.io-client';

// Connect to the backend's Socket.IO server
const socket = io('http://localhost:5000');

function App() {
  const [markdown, setMarkdown] = useState('');

  // Fetch the saved document when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/document')
      .then((response) => response.json())
      .then((data) => {
        setMarkdown(data.document);
      })
      .catch((error) => console.error('Error fetching document:', error));
  }, []);

  // Setup Socket.IO to listen for document updates from the server
  useEffect(() => {
    socket.on('doc-update', (data) => {
      setMarkdown(data);
    });

    // Cleanup on unmount
    return () => {
      socket.off('doc-update');
    };
  }, []);

  // Handle changes in the editor
  const handleChange = (e) => {
    const newText = e.target.value;
    setMarkdown(newText);
    // Emit the update to the server for real-time collaboration
    socket.emit('doc-update', newText);
    // Update the persistent storage via a POST request
    fetch('http://localhost:5000/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: newText })
    }).catch((error) => console.error('Error updating document:', error));
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