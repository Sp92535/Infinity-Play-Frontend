import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {env} from '../utils/env'
import '../css/categoryPage.css';

function CategoryPage() {
  const [CategoryGames, setCategoryGames] = useState([]);
  const [AllCategoryGames, setAllCategoryGames] = useState([]);
  const [totalGames, setTotalGames] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const gamesPerPage = 30; // Cards per page
  const gamesPerRow = 8; // Cards per row
  const navigate = useNavigate();
  const { category, page } = useParams(); // Destructure page from URL params
  const available = new Set(["new","popular","action","racing","shooting","sports","strategy","puzzle","io","2-player"]);
  

  // State to track carousel position
  const [CategoryGameIndex, setCategoryGameIndex] = useState(0);

  // Function to fetch game data based on category
  const fetchGameData = async () => {
    try {
      
      if(!available.has(category)){
          navigate("/notFound");
      }

      const response = await fetch(`${env.SERVER}/category_latest/${category}`);
      const data = await response.json();
      setCategoryGames(data.games);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  // Function to fetch all games in a category
  const fetchAllGamesByCategory = async () => {
    try {
      const response = await fetch(`${env.SERVER}/category_all/${category}?page_no=${pageNo}`);
      const data = await response.json();
      setAllCategoryGames(data.games);
      setTotalGames(data.total);
    } catch (error) {
      console.error('Error fetching all category games:', error);
    }
  };

  useEffect(() => {
    fetchGameData();
    fetchAllGamesByCategory();
  }, [category, pageNo]); // Re-fetch data when category changes or page number changes

  // Set pageNo based on URL parameters or default to 1
  useEffect(() => {
    const pageParam = parseInt(page, 10); // Parse the page parameter to an integer
    if (!isNaN(pageParam) && pageParam > 0) {
      setPageNo(pageParam); // Set pageNo from URL if valid
    } else {
      setPageNo(1); // Default to 1 if no valid page parameter
    }
  }, [page]); // Run this effect when the page parameter changes

  const capitalizeGameName = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleGameClick = (gameName) => {
    navigate(`/game/${gameName}`);
  };

  // Carousel navigation functions
  const nextCategoryGame = () => {
    setCategoryGameIndex((prevIndex) => (prevIndex + 1) % Math.ceil(CategoryGames.length / 7));
  };

  const prevCategoryGame = () => {
    setCategoryGameIndex((prevIndex) => (prevIndex - 1 + Math.ceil(CategoryGames.length / 7)) % Math.ceil(CategoryGames.length / 7));
  };

  // Helper function to get the current games for the carousel
  const getCurrentGames = (games, index) => {
    const start = index * 7;
    return games.slice(start, start + 7);
  };

  // Helper function for pagination
  const handlePagination = (page) => {
    setPageNo(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalGames / gamesPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <div className="pagination">
        <button onClick={() => handlePagination(pageNo - 1)} disabled={pageNo === 1} className="carousel-button"> &larr; </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePagination(page)}
            className={pageNo === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
        <button onClick={() => handlePagination(pageNo + 1)} disabled={pageNo === totalPages} className="carousel-button"> &rarr; </button>
      </div>
    );
  };

  // Helper function to format games into rows
  const formatGamesIntoRows = (games) => {
    const rows = [];
    for (let i = 0; i < games.length; i += gamesPerRow) {
      rows.push(games.slice(i, i + gamesPerRow));
    }
    return rows;
  };

  const allGamesRows = formatGamesIntoRows(AllCategoryGames);

  return (
    <div className="categoryPage">
      <div className="hero-banner">
        <img src="/home.webp" alt="Hero Banner" />
      </div>

      {/* New Games Section */}
      <div className="game-section">
        <h2>{capitalizeGameName(category)} Games</h2>
        <div className="game-row">
          <button onClick={prevCategoryGame} className="carousel-button lArrow">&larr;</button>
          {getCurrentGames(CategoryGames, CategoryGameIndex).map((game, index) => (
            <div key={index} className="game-card" onClick={() => handleGameClick(game.name)}>
              <img src={game.img} alt={game.name} />
              <p>{capitalizeGameName(game.name)}</p>
            </div>
          ))}
          <button onClick={nextCategoryGame} className="carousel-button rArrow">&rarr;</button>
        </div>
      </div>

      {/* All {category} Games Section */}
      <div className="all-games-section">
        <h2>All {capitalizeGameName(category)} Games</h2>
        <div className="all-games-row">
          {allGamesRows.map((row, rowIndex) => (
            <div key={rowIndex} className="game-row">
              {row.map((game, index) => (
                <div key={index} className="game-card" onClick={() => handleGameClick(game.name)}>
                  <img src={game.img} alt={game.name} />
                  <p>{capitalizeGameName(game.name)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        {renderPagination()}
      </div>
    </div>
  );
}

export default CategoryPage;
