import { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import UploadGame from './UploadGame';
import DeleteGame from './DeleteGame';
import AddAdmin from './AddAdmin';
import DeleteAdmin from './DeleteAdmin';
import Login from './Login'; // Import your Login component
import '../css/adminPanel.css';

function AdminPanel() {
  const [currentView, setCurrentView] = useState('uploadGame'); // Manage different modes
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const [isSuperUser, setIsSuperUser] = useState(false); // Track if the user is a super user

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const superAccess = localStorage.getItem('super_access') === 'true'; // Retrieve super access

    if (token) {
      const isTokenExpired = () => {
        try {
          const { exp } = jwtDecode(token); // Decode the token to get expiration
          return Date.now() >= exp * 1000; // Check if current time is past expiration
        } catch (error) {
          return true; // Assume token is expired or invalid if decoding fails
        }
      };

      if (isTokenExpired()) {
        handleLogout(); // Token is expired, so log the user out
      } else {
        setIsLoggedIn(true); // Set logged in state if token is valid
        setIsSuperUser(superAccess); // Set super user state
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Clear the token
    localStorage.removeItem('super_access'); // Clear super access
    setIsLoggedIn(false); // Update logged in state
    setIsSuperUser(false); // Reset super user state
    setCurrentView('uploadGame');
  };

  if (!isLoggedIn) {
    return <Login onLogin={(superAccess) => { 
      setIsLoggedIn(true); 
      setIsSuperUser(superAccess); 
      setCurrentView('uploadGame')
    }} />; // Pass down super access
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Admin Panel</h2>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
        <div className="card-body">
          <div className="btn-group mb-3">
            {/* Game management buttons */}
            <button onClick={() => setCurrentView('uploadGame')} className="btn btn-success">Upload a Game</button>
            {isSuperUser && ( // Render this button only for super users
              <>
                <button onClick={() => setCurrentView('deleteGame')} className="btn btn-danger">Delete a Game</button>
                <button onClick={() => setCurrentView('addAdmin')} className="btn btn-success">Add Admin</button>
                <button onClick={() => setCurrentView('deleteAdmin')} className="btn btn-danger">Delete Admin</button>
              </>
            )}
          </div>

          {/* Conditionally render components based on the button clicked */}
          {currentView === 'uploadGame' && <UploadGame />}
          {currentView === 'deleteGame' && <DeleteGame />}
          {currentView === 'addAdmin' && <AddAdmin />}
          {currentView === 'deleteAdmin' && <DeleteAdmin />}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
