import React from 'react';

function MemoryGame({ strings, onBack }) {
  return (
    <div className="minigame-screen">
      <h2>{strings.minigame3}</h2>
      <div className="minigame-placeholder">
        <p>This is a placeholder for the memory minigame logic.</p>
      </div>
      <button className="back-btn" onClick={onBack}>
        {strings.back}
      </button>
    </div>
  );
}

export default MemoryGame;
