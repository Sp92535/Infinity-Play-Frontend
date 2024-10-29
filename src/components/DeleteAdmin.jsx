import React, { useState } from 'react';
import {env} from '../utils/env'
import '../css/deleteAdmin.css';

const DeleteAdmin = () => {
  const [username, setUsername] = useState('');
  const [admins, setAdmins] = useState([]); // Store matched admins
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Confirmation state
  const [confirmDeleteUsername, setConfirmDeleteUsername] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');

  // Function to handle searching admins
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error
    setSuccess(null); // Clear previous success message

    try {
      const response = await fetch(`${env.SERVER}/admin/search?username=${username}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Include JWT token
        },
      });
      const data = await response.json();
      setAdmins([]);
      if (response.ok) {
        if (data.admins.length === 0) {
          setError('No such admins found.');
        } else {
          setAdmins(data.admins); // Set matching admins
        }
      } else {
        setError(data.error || 'Failed to fetch admins.');
      }

      // Clear messages after 3 seconds
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('An error occurred while searching for admins.');
      // Clear messages after 3 seconds
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    }
  };

  // Function to handle the confirmation popup
  const handleDeleteClick = (adminUsername) => {
    setConfirmDeleteUsername(adminUsername); // Set the admin username for confirmation
  };

  // Function to handle deleting an admin
  const handleDelete = async () => {
    if (confirmDeleteUsername) {
      setError(null); // Clear previous error
      setSuccess(null); // Clear previous success message

      try {
        const response = await fetch(`${env.SERVER}/admin/delete?username=${confirmDeleteUsername}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Include JWT token
          }
        });
        const data = await response.json();

        if (response.ok) {
          setSuccess(data.message);
          // Remove deleted admin from the list
          setAdmins(admins.filter(admin => admin !== confirmDeleteUsername));
        } else {
          setError(data.error || 'Failed to delete admin.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while deleting the admin.');
      } finally {
        // Reset confirmation state
        setConfirmDeleteUsername(null);
        setConfirmInput('');
      }
    }
  };

  return (
    <div className="delete-admin">
      <h2>Delete Admin</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="username">Search by Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Search Admins</button>
      </form>

      {admins.length > 0 ? (
        <div className="admin-list">
          <h3>Matched Admins:</h3>
          <ul>
            {admins.map((admin) => (
              <li key={admin} className="admin-item">
                <span className="admin-username">{admin}</span>
                <button className="btn btn-danger" onClick={() => handleDeleteClick(admin)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="no-admins-message">No admins to display.</div>
      )}

      {/* Confirmation Popup */}
      {confirmDeleteUsername && (
        <div className="confirmation-popup">
          <h3>Type "CONFIRM" to delete</h3>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="Type CONFIRM"
            className="confirmation-input"
          />
          <button
            onClick={handleDelete}
            disabled={confirmInput !== "CONFIRM"}
            className="btn btn-danger"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setConfirmDeleteUsername(null); // Close popup
              setConfirmInput(""); // Reset input
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteAdmin;
