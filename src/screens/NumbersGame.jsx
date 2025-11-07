import React from 'react';

function NumbersGame({ strings, onBack }) {
  return (
    <div className="minigame-screen">
      <h2>{strings.minigame2}</h2>
      <div className="minigame-placeholder">
        <p>This is a placeholder for the numbers minigame logic.</p>
      </div>
      <button className="back-btn" onClick={onBack}>
        {strings.back}
      </button>
    </div>
  );
}

export default NumbersGame;
