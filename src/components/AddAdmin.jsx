import React, { useState } from 'react';
import '../css/addAdmin.css';

const AddAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for password match and set error state if they don't match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setTimeout(() => setError(null), 3000); // Clear error message after 3 seconds
      return;
    }

    try {
      const response = await fetch('https://infinityplayserver.onrender.com/api/admin/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
      } else {
        setError(data.error || 'Failed to create user.');
        setTimeout(() => setError(null), 3000); // Clear error message after 3 seconds
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while creating the admin.');
      setTimeout(() => setError(null), 3000); // Clear error message after 3 seconds
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="add-admin">
      <h2>Add New Admin</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
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

        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group password-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="toggle-password-wrapper">
          <span onClick={togglePasswordVisibility} className="toggle-password">
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        
        <button type="submit" className="btn btn-success">Add Admin</button>
      </form>
    </div>
  );
};

export default AddAdmin;
