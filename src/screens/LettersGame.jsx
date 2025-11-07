import React from 'react';

function LettersGame({ strings, onBack }) {
  return (
    <div className="minigame-screen">
      <h2>{strings.minigame1}</h2>
      <div className="minigame-placeholder">
        <p>This is a placeholder for the letters minigame logic.</p>
      </div>
      <button className="back-btn" onClick={onBack}>
        {strings.back}
      </button>
    </div>
  );
}

export default LettersGame;
