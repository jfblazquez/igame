
import { useState } from 'react';
import './App.css';

const MINIGAMES = [
  { key: 'letters', name: 'Letters Game' },
  { key: 'numbers', name: 'Numbers Game' },
  { key: 'memory', name: 'Memory Game' },
];

function App() {
  const [screen, setScreen] = useState('start');
  const [selectedMinigame, setSelectedMinigame] = useState(null);

  const handleSelectMinigame = (key) => {
    setSelectedMinigame(key);
    setScreen('minigame');
  };

  const handleBackToStart = () => {
    setScreen('start');
    setSelectedMinigame(null);
  };

  return (
    <div className="app-container">
      {screen === 'start' && (
        <div className="start-screen">
          <h1 className="title">Welcome!</h1>
          <p className="subtitle">Choose a minigame:</p>
          <div className="minigame-list">
            {MINIGAMES.map((game) => (
              <button
                key={game.key}
                className="minigame-btn"
                onClick={() => handleSelectMinigame(game.key)}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {screen === 'minigame' && (
        <div className="minigame-screen">
          <h2>{MINIGAMES.find(g => g.key === selectedMinigame)?.name}</h2>
          <div className="minigame-placeholder">
            <p>This is a placeholder for the minigame logic.</p>
          </div>
          <button className="back-btn" onClick={handleBackToStart}>
            Back to Start
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
