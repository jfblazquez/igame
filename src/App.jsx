

import { useState, useEffect } from 'react';
import './App.css';

import locales from './locales.json';

const MINIGAMES = [
  { key: 'letters', nameKey: 'minigame1' },
  { key: 'numbers', nameKey: 'minigame2' },
  { key: 'memory', nameKey: 'minigame3' },
];

function App() {
  const [screen, setScreen] = useState('start');
  const [selectedMinigame, setSelectedMinigame] = useState(null);
  const [lang, setLang] = useState('en');
  const [strings, setStrings] = useState(locales[lang]);

  useEffect(() => {
    setStrings(locales[lang]);
  }, [lang]);

  const handleSelectMinigame = (key) => {
    setSelectedMinigame(key);
    setScreen('minigame');
  };

  const handleBackToStart = () => {
    setScreen('start');
    setSelectedMinigame(null);
  };

  const handleLangChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <div className="app-container">
      {/* Dynamic background bubbles */}
      <div className="background-bubbles">
        <div className="bubble" style={{width:'120px',height:'120px',background:'#4a90e2',top:'10%',left:'5%',animationDelay:'0s'}}></div>
        <div className="bubble" style={{width:'80px',height:'80px',background:'#50e3c2',top:'60%',left:'80%',animationDelay:'2s'}}></div>
        <div className="bubble" style={{width:'100px',height:'100px',background:'#f7b42c',top:'80%',left:'20%',animationDelay:'4s'}}></div>
        <div className="bubble" style={{width:'60px',height:'60px',background:'#e94e77',top:'30%',left:'70%',animationDelay:'1s'}}></div>
      </div>
      <div className="lang-switcher">
        <select value={lang} onChange={handleLangChange}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      {screen === 'start' && (
        <div className="start-screen">
          <h1 className="title">{strings.title}</h1>
          <div className="minigame-list">
            {MINIGAMES.map((game) => (
              <button
                key={game.key}
                className="minigame-btn"
                onClick={() => handleSelectMinigame(game.key)}
              >
                {strings[game.nameKey]}
              </button>
            ))}
          </div>
        </div>
      )}
      {screen === 'minigame' && (
        <div className="minigame-screen">
          <h2>{
            selectedMinigame === 'letters' ? strings.minigame1 :
            selectedMinigame === 'numbers' ? strings.minigame2 :
            strings.minigame3
          }</h2>
          <div className="minigame-placeholder">
            <p>This is a placeholder for the minigame logic.</p>
          </div>
          <button className="back-btn" onClick={handleBackToStart}>
            {strings.back}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
