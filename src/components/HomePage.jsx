import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/homePage.css';

function HomePage() {
  const [newGames, setNewGames] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // State to track carousel position
  const [newGameIndex, setNewGameIndex] = useState(0);
  const [trendingGameIndex, setTrendingGameIndex] = useState(0);
  const [popularGameIndex, setPopularGameIndex] = useState(0);
  
  // Function to fetch game data
  const fetchGameData = async () => {
    try {
      const newGamesResponse = await fetch('https://infinityplayserver.onrender.com/api/category_latest/new');
      const newGamesData = await newGamesResponse.json();
      setNewGames(newGamesData.games);

      const trendingGamesResponse = await fetch('https://infinityplayserver.onrender.com/api/category_latest/trending');
      const trendingGamesData = await trendingGamesResponse.json();
      setTrendingGames(trendingGamesData.games);

      const popularGamesResponse = await fetch('https://infinityplayserver.onrender.com/api/category_latest/popular');
      const popularGamesData = await popularGamesResponse.json();
      setPopularGames(popularGamesData.games);
      
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const capitalizeGameName = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleGameClick = (gameName) => {
    navigate(`/game/${gameName}`); // Navigate to GamePage
  };

  // Carousel navigation functions
  const nextNewGame = () => {
    setNewGameIndex((prevIndex) => (prevIndex + 1) % Math.ceil(newGames.length / 7));
  };

  const prevNewGame = () => {
    setNewGameIndex((prevIndex) => (prevIndex - 1 + Math.ceil(newGames.length / 7)) % Math.ceil(newGames.length / 7));
  };

  const nextTrendingGame = () => {
    setTrendingGameIndex((prevIndex) => (prevIndex + 1) % Math.ceil(trendingGames.length / 7));
  };

  const prevTrendingGame = () => {
    setTrendingGameIndex((prevIndex) => (prevIndex - 1 + Math.ceil(trendingGames.length / 7)) % Math.ceil(trendingGames.length / 7));
  };

  const nextPopularGame = () => {
    setPopularGameIndex((prevIndex) => (prevIndex + 1) % Math.ceil(popularGames.length / 7));
  };

  const prevPopularGame = () => {
    setPopularGameIndex((prevIndex) => (prevIndex - 1 + Math.ceil(popularGames.length / 7)) % Math.ceil(popularGames.length / 7));
  };

  // Helper function to get the current games for the carousel
  const getCurrentGames = (games, index) => {
    const start = index * 7;
    return games.slice(start, start + 7);
  };

  return (
    <div className="homePage">
      <div className="hero-banner">
        <img src="/home.webp" alt="Hero Banner" />
      </div>

      {/* New Games Section */}
      <div className="game-section">
        <h2>New Games</h2>
        <div className="game-row">
          <button onClick={prevNewGame} className="carousel-button lArrow">&larr;</button>
          {getCurrentGames(newGames, newGameIndex).map((game, index) => (
            <div key={index} className="game-card" onClick={() => handleGameClick(game.name)}>
              <img src={game.img} alt={game.name} />
              <p>{capitalizeGameName(game.name)}</p>
            </div>
          ))}
          <button onClick={nextNewGame} className="carousel-button rArrow">&rarr;</button>
        </div>
      </div>

      {/* Trending Games Section */}
      <div className="game-section">
        <h2>Trending Games</h2>
        <div className="game-row">
          <button onClick={prevTrendingGame} className="carousel-button lArrow">&larr;</button>
          {getCurrentGames(trendingGames, trendingGameIndex).map((game, index) => (
            <div key={index} className="game-card" onClick={() => handleGameClick(game.name)}>
              <img src={game.img} alt={game.name} />
              <p>{capitalizeGameName(game.name)}</p>
            </div>
          ))}
          <button onClick={nextTrendingGame} className="carousel-button rArrow">&rarr;</button>
        </div>
      </div>

      {/* Popular Games Section */}
      <div className="game-section">
        <h2>Popular Games</h2>
        <div className="game-row">
          <button onClick={prevPopularGame} className="carousel-button lArrow">&larr;</button>
          {getCurrentGames(popularGames, popularGameIndex).map((game, index) => (
            <div key={index} className="game-card" onClick={() => handleGameClick(game.name)}>
              <img src={game.img} alt={game.name} />
              <p>{capitalizeGameName(game.name)}</p>
            </div>
          ))}
          <button onClick={nextPopularGame} className="carousel-button rArrow">&rarr;</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
