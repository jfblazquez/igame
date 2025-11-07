import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import correctSound from '../assets/correct.mp3';
import failSound from '../assets/fail.mp3';
import enjoyMusic from '../assets/clap.mp3';
import emojiMap from '../assets/emojiMap.js';

function getEmojiLetterMap(locale) {
  return emojiMap[locale].map(e => ({
    emoji: e.emoji,
    name: e.name,
    letter: e.name[0].toUpperCase()
  }));
}

function getRandomChallenge(emojiLetterMap) {
  const idx = Math.floor(Math.random() * emojiLetterMap.length);
  const correct = emojiLetterMap[idx];
  // Pick 2 random incorrect letters, always different
  let letters = emojiLetterMap.map(e => e.letter).filter(l => l !== correct.letter);
  letters = Array.from(new Set(letters)); // ensure uniqueness
  const incorrect = shuffle(letters).slice(0, 2);
  const options = shuffle([correct.letter, ...incorrect]);
  return { emoji: correct.emoji, letter: correct.letter, name: correct.name, options };
}

function shuffle(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const NUM_PLAYS = 10; // Change to desired number for debugging or gameplay

const LettersGame = ({ strings, onBack, lang }) => {
  const locale = lang || 'en';
  const emojiLetterMap = getEmojiLetterMap(locale);
  const [challenge, setChallenge] = useState(getRandomChallenge(emojiLetterMap));
  const [selected, setSelected] = useState({});
  const [winCount, setWinCount] = useState(0);
  const [disableAll, setDisableAll] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    if (winCount === NUM_PLAYS) {
      // Wait before showing congratulations so user can see last word
      setTimeout(() => {
        setGameOver(true);
        const audio = new Audio(enjoyMusic);
        audio.play();
        setTimeout(() => {
          if (onBack) onBack();
        }, 2500);
      }, 2000); // 2 seconds to see last word
    }
  }, [winCount]);

  const handleSelect = (char) => {
    if (disableAll || selected[char] || gameOver) return;
    if (char === challenge.letter) {
      setDisableAll(true);
      setWinCount(w => w + 1);
      setShowName(true);
      // play correct sound
      const audio = new Audio(correctSound);
      audio.play();
      setTimeout(() => {
        setDisableAll(false);
        setSelected({});
        setShowName(false);
        // Only show new challenge if not game over
        if (winCount + 1 < NUM_PLAYS) {
          setChallenge(getRandomChallenge(emojiLetterMap));
        }
      }, 2000);
    } else {
      setSelected(s => ({ ...s, [char]: "fail" }));
      // play fail sound
      const audio = new Audio(failSound);
      audio.play();
    }
  };

  return (
    <div className="letters-game" style={{ position: "relative", padding: 32 }}>
      {!gameOver && (
        <>
          {/* Win counter */}
          <div style={{ width: '100%', textAlign: 'center', fontSize: 24, marginTop: 16, marginBottom: 8 }}>
            {(typeof strings.winsCounter === 'string' ? strings.winsCounter.replace('{count}', winCount) : `Wins: ${winCount}`)}
          </div>
          {/* Emoji challenge */}
          <div style={{ fontSize: 96, textAlign: "center", margin: "48px 0" }}>
            {challenge.emoji}
            {showName && (
              <div style={{ fontSize: 32, marginTop: 16, color: "#333" }}>
                {challenge.name}
              </div>
            )}
          </div>
          {/* Options */}
              {!showName && (
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {challenge.options.map(char => (
              <button
                key={char}
                onClick={() => handleSelect(char)}
                disabled={disableAll || selected[char] === "fail"}
                style={{
                  fontSize: 48,
                  padding: "24px 40px",
                  borderRadius: 16,
                  background: selected[char] === "fail" ? "#f44336" : "#e0e0e0",
                  color: selected[char] === "fail" ? "white" : "black",
                  cursor: disableAll || selected[char] === "fail" ? "not-allowed" : "pointer",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "background 0.3s"
                }}
              >
                {char}
              </button>
            ))}
          </div>
              )}
        </>
      )}
      {/* Game over confetti and congratulations */}
      {gameOver && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999 }}>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={400}
            gravity={0.25}
            colors={["#FFD700", "#FF69B4", "#4FC3F7", "#81C784", "#FFB300", "#AB47BC", "#F44336"]}
            shapes={["rect", "star"]}
            recycle={false}
          />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#333", background: "transparent", fontWeight: "bold" }}>
            {(typeof strings.congratulations === 'string' ? strings.congratulations : 'Congratulations!')}
          </div>
        </div>
      )}
      <button className="back-btn" onClick={onBack} style={{ marginTop: 48 }}>
        {strings.back}
      </button>
    </div>
  );
};

export default LettersGame;
