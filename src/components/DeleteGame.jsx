import { useState } from "react";
import axios from "axios";
import {env} from '../utils/env'
import "../css/deleteGame.css";

function DeleteGame() {
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Confirmation state
  const [confirmDeleteGameName, setConfirmDeleteGameName] = useState(null); // Changed from ID to Name
  const [confirmInput, setConfirmInput] = useState("");

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }

    try {
      const response = await axios.get(`${env.SERVER}/search`, {
        params: { query: trimmedQuery },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Include JWT token
        },
      });
      setGames(response.data.games);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleDeleteGame = async () => {
    if (confirmDeleteGameName) {
      try {
        await axios.delete(
          `${env.SERVER}/${confirmDeleteGameName}`
        ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Include JWT token
          },
        }); // Pass game name
        // Remove the deleted game from the local state
        setGames((prevGames) =>
          prevGames.filter((game) => game.name !== confirmDeleteGameName)
        );
      } catch (error) {
        console.error("Error deleting game:", error);
      } finally {
        // Reset confirmation state
        setConfirmDeleteGameName(null);
        setConfirmInput("");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      {/* Delete Game Search Bar */}
      <div className="input-group mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a game to delete"
          className="form-control"
          onKeyUp={handleKeyPress}
        />
        <button onClick={handleSearch} className="btn btn-warning">
          Search
        </button>
      </div>

      <div className="game-grid">
        {games.length > 0 ? (
          <>
            <h2>Select games to delete:</h2>
            <div className="game-card-container">
              {games.map((game) => (
                <div key={game.id} className="game-card">
                  <img src={game.img} alt={game.name} />
                  <h3>{game.name}</h3>
                  <button
                    onClick={() => {
                      setConfirmDeleteGameName(game.name); // Set the game name for confirmation
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          searchPerformed && (
            <h2 style={{ color: "black" }}>
              Game not found. Try a different search!
            </h2>
          )
        )}
      </div>

      {/* Confirmation Popup */}
      {confirmDeleteGameName !== null && (
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
            onClick={handleDeleteGame}
            disabled={confirmInput !== "CONFIRM"}
            className="btn btn-danger"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setConfirmDeleteGameName(null); // Close popup
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
}

export default DeleteGame;
