import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {env} from '../utils/env'
import '../css/searchResults.css'

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 20; // Assume 20 games per page
  const navigate = useNavigate();

  // Function to handle game card click
  const handleGameClick = (gameName) => {
    navigate(`/game/${gameName}`); // Navigate to GamePage
  };

  // Fetch games based on query and page number
  const fetchSearchResults = async (pageNo) => {
    setLoading(true);
    try {
      const response = await axios.get(`${env.SERVER}/search`, {
        params: { query, page_no: pageNo }
      });
      setGames(response.data.games);
      setTotalPages(Math.ceil(response.data.total / gamesPerPage)); // Calculate total pages
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch search results');
      setLoading(false);
    }
  };

  // Fetch results when component loads or query/page changes
  useEffect(() => {
    if (query) {
      fetchSearchResults(currentPage);
    }
  }, [query, currentPage]);

  // Handle page switching
  const handlePageChange = (pageNo) => {
    if (pageNo > 0 && pageNo <= totalPages) {
      setCurrentPage(pageNo);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="search-results">
      {/* <div className="hero-banner">
        <img src="/search.png" alt="Hero Banner" />
      </div> */}
        <h2>Search Results for "{query}"</h2>
        <br></br>
      <div className="game-grid">
        {games.length > 0 ? (
          games.map((game, index) => (
            <div key={index} className="game-card" onClick={() => handleGameClick(game.name)}>
              <img src={game.img} alt={game.name} />
              <h3>{game.name}</h3>
            </div>
          ))
        ) : (
          <h2>No games found</h2>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          className="pagination-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr; {/* Left arrow */}
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`pagination-page ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="pagination-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &rarr; {/* Right arrow */}
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
