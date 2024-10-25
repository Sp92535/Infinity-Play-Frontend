import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import '../css/navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {

  const [query, setQuery] = useState(''); // Track search query
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (query.trim()) {
        // Navigate to search results page with query as a URL parameter
        navigate(`/search?query=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo"> {/* Use Link for navigation */}
          <span className="logo-silver">INFINITY</span>
          <span className="logo-games">PLAY</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-item">HOME</Link>
          <Link to="/category/new" className="navbar-item">NEW</Link> {/* Example path for new games */}
          <Link to="/category/popular" className="navbar-item">POPULAR</Link>
          <Link to="/category/action" className="navbar-item">ACTION</Link>
          <Link to="/category/racing" className="navbar-item">RACING</Link>
          <Link to="/category/shooting" className="navbar-item">SHOOTING</Link>
          <Link to="/category/sports" className="navbar-item">SPORTS</Link>
          <Link to="/category/strategy" className="navbar-item">STRATEGY</Link>
          <Link to="/category/puzzle" className="navbar-item">PUZZLE</Link>
          <Link to="/category/io" className="navbar-item">.IO</Link>
          <Link to="/category/2-player" className="navbar-item">2 PLAYER</Link>
        </div>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search Games"
            className="search-input"
            value={query} // Bind input value to query state
            onChange={(e) => setQuery(e.target.value)} // Update query state on input change
            onKeyDown={handleSearch} // Trigger search on Enter key press
          />
          <button className="search-button" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
