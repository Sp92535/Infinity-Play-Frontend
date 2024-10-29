import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {env} from '../utils/env'
import '../css/gamePage.css';

function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function GamePage() {
    const { gameName } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hasVoted, setHasVoted] = useState(false);
    const [voteType, setVoteType] = useState(null);
    const [isReportFormVisible, setIsReportFormVisible] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [votes, setVotes] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const decodedGameName = decodeURIComponent(gameName.replace(/-/g, ' '));
                const response = await axios.get(`${env.SERVER}/${encodeURIComponent(decodedGameName)}`);
                setGame(response.data.data);
                setVotes(response.data.data.noOfVotes);
            } catch (error) {
                if (error.response && error.response.status === 404){
                    navigate('/notFound')
                }
                setError(`Unable to fetch: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [gameName]);

    // Load vote and report status from localStorage
    useEffect(() => {
        const savedVoteType = localStorage.getItem(`vote_${gameName}`);
        if (savedVoteType) {
            setVoteType(savedVoteType);
            setHasVoted(true);
        }
        const savedReportStatus = localStorage.getItem(`reported_${gameName}`);
        if (savedReportStatus) {
            setIsReported(true);
        }
    }, [gameName]);

    const handleVote = async (like) => {
        try {
            await axios.get(`${env.SERVER}/vote/${game.gameName}?like=${like}`);
            setHasVoted(true);
            setVotes(votes + 1);
            const vote = like === 1 ? 'like' : 'dislike';
            setVoteType(vote);
            localStorage.setItem(`vote_${gameName}`, vote);
        } catch (error) {
            console.error('Error while voting:', error);
            setError('Error while voting. Please try again.');
        }
    };

    const handleFullScreen = () => {
        const objectElement = document.getElementById('gameObject');
        if (objectElement) {
            if (objectElement.requestFullscreen) {
                objectElement.requestFullscreen();
            } else if (objectElement.mozRequestFullScreen) {
                objectElement.mozRequestFullScreen();
            } else if (objectElement.webkitRequestFullscreen) {
                objectElement.webkitRequestFullscreen();
            } else if (objectElement.msRequestFullscreen) {
                objectElement.msRequestFullscreen();
            }
        }
    };

    const handleReportSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const reportData = {
            game_name: game.gameName,
            message: formData.get('message'),
        };

        axios.post(`${env.SERVER}/mail`, reportData)
            .then(response => {
                setIsReported(true);
                localStorage.setItem(`reported_${gameName}`, 'true');
                setIsReportFormVisible(false);
            })
            .catch(error => {
                console.error('Error submitting report:', error);
            });
    };

    const ReportForm = () => (
        <div className="report-form">
            <h2>Report {game.gameName}</h2>
            <form onSubmit={handleReportSubmit} encType="multipart/form-data">
                <input
                    type="email"
                    name="email"
                    required
                    value="infinityplay@gmail.com"
                    readOnly
                />
                <textarea
                    name="message"
                    required
                    placeholder="Describe the issue..."
                    rows="5"
                />
                <div className="form-buttons">
                    <button type="submit">
                        Submit Report
                    </button>
                    <button type="button" onClick={() => setIsReportFormVisible(false)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="game-page">
            <div className={`game-container ${isReportFormVisible ? 'blur' : ''}`}>
                <h1 className="game-title">{capitalize(game.gameName)}</h1>
                {game.gameType === 'flash' ? (
                    <object
                        id="gameObject"
                        data={`${env.SERVER}/gameFile/${game.gamePath}`}
                        type="application/x-shockwave-flash"
                        width="800"
                        height="500"
                    >
                        <param name="quality" value="high" />
                        <param name="allowScriptAccess" value="always" />
                        <param name="wmode" value="transparent" />
                        Your browser does not support Flash content.
                    </object>
                ) : (
                    <iframe
                        title={game.gameName}
                        src={`${env.SERVER}/gameFile/${game.gamePath}`} // Adjust based on your API
                        width="800"
                        height="500"
                        style={{ border: 'none' }}
                    />
                )}

                <div className="button-container">
                    <button
                        className={`like-btn ${voteType === 'like' ? 'active' : ''}`}
                        onClick={() => handleVote(1)}
                        disabled={hasVoted}
                    >
                        👍 Like
                    </button>
                    <button
                        className={`dislike-btn ${voteType === 'dislike' ? 'active' : ''}`}
                        onClick={() => handleVote(0)}
                        disabled={hasVoted}
                    >
                        👎 Dislike
                    </button>
                    <button
                        className="report-btn"
                        onClick={() => setIsReportFormVisible(true)}
                        disabled={isReported}
                    >
                        {isReported ? '🚨 Reported' : '🚨 Report'}
                    </button>
                    <button onClick={handleFullScreen} className="fullscreen-btn">
                        ⛶ Full Screen
                    </button>
                </div>
                <p className="game-description"><strong>Rating:</strong> {game.avgRating}/5 ({votes} votes)</p>
                <p className="game-description"><strong>Description:</strong> {game.gameDescription}</p>
                <p className="game-category"><strong>Category:</strong> {game.gameCategory.map(capitalize).join(', ')}</p>
            </div>

            {isReportFormVisible && <ReportForm />}
        </div>
    );
}

export default GamePage;
