import React, { useState } from 'react';
import '../css/login.css';

const Login = ({ onLogin }) => { // Accept onLogin as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    setLoading(true);
    setError(''); // Clear any previous error messages
  
    try {
      const response = await fetch('https://infinityplayserver.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Store the token and super access in local storage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('super_access', data.super_access); // Store super access
        onLogin(data.super_access); // Pass super access to AdminPanel
      } else {
        // Handle login failure
        setError(data.message); // Set error message
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Internal Server Error. Please try again later.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
};

export default Login;
