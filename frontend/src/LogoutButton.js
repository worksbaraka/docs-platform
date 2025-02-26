// frontend/src/LogoutButton.js
import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    // Redirect to the logout route on the backend
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  return (
    <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Logout
    </button>
  );
};

export default LogoutButton;