import React from 'react';
import '../css/submitAGame.css'

function SubmitGame() {
  return (
    <div className="submit-game-container">
      <h1 className="submit-heading">Submit A Game</h1>
      <p className="submit-text">Game developer? Looking for a partner to share your games and increase traffic? Here, on InfinityPlay.com we support game developers and provide a great platform to get your game in front of players from around the globe.</p>
      <p className="submit-text">New games are published on our page every day! That's why we are always in search of funny and quality online games to enrich our big collection. Racing, shooting, action, sports, puzzle, strategy games, or something completely new, we are open to suggestions and new ideas.</p>
      
      <h2 className="submit-rules-heading">Rules for Game Submission:</h2>
      <ul className="submit-rules-list">
        <li>It should be interesting, funny, and creative.</li>
        <li>It should provide good quality in graphics, animation, and sound.</li>
        <li>It should be playable in every modern browser.</li>
        <li>It should not contain any misleading links or excessive advertising.</li>
      </ul>
      
      <p className="submit-email">Please send your game or a link to <strong>submit@infinityplay.com</strong> and we will review it as soon as possible. If it meets all the criteria, we will publish it!</p>
      
      <p className="submit-signoff">Cheers, Team InfinityPlay</p>
    </div>
  );
}

export default SubmitGame;
