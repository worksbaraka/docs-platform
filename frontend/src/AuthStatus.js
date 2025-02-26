// frontend/src/AuthStatus.js
import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';

const AuthStatus = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/auth/status', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching auth status:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading authentication status...</p>;
  }

  if (user) {
    return (
      <div>
        <p>Logged in as: {user.login}</p>
        <img
          src={user.avatar_url}
          alt="Avatar"
          style={{ width: '50px', borderRadius: '50%' }}
        />
        <LogoutButton />
      </div>
    );
  } else {
    return <p>You are not logged in.</p>;
  }
};

export default AuthStatus;