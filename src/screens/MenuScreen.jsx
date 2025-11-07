import React from 'react';

function MenuScreen({ MINIGAMES, strings, onSelectMinigame }) {
  return (
    <div className="start-screen">
      <h1 className="title">{strings.title}</h1>
      <div className="minigame-list">
        {MINIGAMES.map((game) => (
          <button
            key={game.key}
            className="minigame-btn"
            onClick={() => onSelectMinigame(game.key)}
          >
            {strings[game.nameKey]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MenuScreen;
