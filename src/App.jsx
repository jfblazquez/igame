

import { useState, useEffect } from 'react';
import './App.css';
import locales from './locales.json';
import MenuScreen from './screens/MenuScreen';
import LettersGame from './screens/LettersGame';
import NumbersGame from './screens/NumbersGame';
import MemoryGame from './screens/MemoryGame';

const MINIGAMES = [
  { key: 'letters', nameKey: 'minigame1' },
  { key: 'numbers', nameKey: 'minigame2' },
  { key: 'memory', nameKey: 'minigame3' },
];

function App() {
  const [screen, setScreen] = useState('menu');
  const [selectedMinigame, setSelectedMinigame] = useState(null);
  const [lang, setLang] = useState('en');
  const [strings, setStrings] = useState(locales[lang]);

  useEffect(() => {
    setStrings(locales[lang]);
  }, [lang]);

  const handleSelectMinigame = (key) => {
    console.log(`[DEBUG] handleSelectMinigame called with key: ${key}`);
    setSelectedMinigame(key);
    setScreen(key);
  };

  const handleBackToMenu = () => {
    console.log('[DEBUG] handleBackToMenu called');
    setScreen('menu');
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
      {screen === 'menu' && (
        <MenuScreen MINIGAMES={MINIGAMES} strings={strings} onSelectMinigame={handleSelectMinigame} />
      )}
      {screen === 'letters' && (
        <LettersGame strings={strings} onBack={handleBackToMenu} />
      )}
      {screen === 'numbers' && (
        <NumbersGame strings={strings} onBack={handleBackToMenu} />
      )}
      {screen === 'memory' && (
        <MemoryGame strings={strings} onBack={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;
