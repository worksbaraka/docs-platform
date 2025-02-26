// frontend/src/MarkdownEditor.js
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');

  // Fetch document content on mount
  useEffect(() => {
    fetch('http://localhost:5000/document')
      .then((response) => response.json())
      .then((data) => setMarkdown(data.document))
      .catch((error) => console.error('Error fetching document:', error));
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    socket.on('doc-update', (data) => {
      setMarkdown(data);
    });
    return () => {
      socket.off('doc-update');
    };
  }, []);

  // Update document on change
  const handleChange = (e) => {
    const newText = e.target.value;
    setMarkdown(newText);
    socket.emit('doc-update', newText);
    fetch('http://localhost:5000/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: newText })
    }).catch((error) => console.error('Error updating document:', error));
  };

  return (
    <div>
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
};

export default MarkdownEditor;