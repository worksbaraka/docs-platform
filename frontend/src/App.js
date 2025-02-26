// frontend/src/App.js
import React from 'react';
import LoginButton from './LoginButton';
import AuthStatus from './AuthStatus';
import DocumentDashboard from './DocumentDashboard';
import MarkdownEditor from './MarkdownEditor';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Community-Driven Documentation Editor</h1>
      <LoginButton />
      <AuthStatus />
      <DocumentDashboard />
      <MarkdownEditor />
    </div>
  );
}

export default App;