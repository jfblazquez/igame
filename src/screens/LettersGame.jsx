import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import correctSound from '../assets/correct.mp3';
import failSound from '../assets/fail.mp3';
import enjoyMusic from '../assets/clap.mp3';

// ...existing code...
const emojiLetterMap = [
  { emoji: "🍎", letter: "A" },
  { emoji: "🐶", letter: "D" },
  { emoji: "🚗", letter: "C" },
  { emoji: "🦁", letter: "L" },
  { emoji: "🌳", letter: "T" },
  { emoji: "🍌", letter: "B" },
  { emoji: "🐘", letter: "E" },
  { emoji: "🐟", letter: "F" },
  { emoji: "🍇", letter: "G" },
  { emoji: "🏠", letter: "H" },
];

function getRandomChallenge() {
  const idx = Math.floor(Math.random() * emojiLetterMap.length);
  const correct = emojiLetterMap[idx];
  // Pick 2 random incorrect letters
  let letters = emojiLetterMap.map(e => e.letter).filter(l => l !== correct.letter);
  letters = shuffle(letters).slice(0, 2);
  const options = shuffle([correct.letter, ...letters]);
  return { emoji: correct.emoji, letter: correct.letter, options };
}

function shuffle(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const NUM_PLAYS = 3; // Change to desired number for debugging or gameplay

const LettersGame = ({ onBackToMenu }) => {
  const [challenge, setChallenge] = useState(getRandomChallenge());
  const [selected, setSelected] = useState({});
  const [winCount, setWinCount] = useState(0);
  const [disableAll, setDisableAll] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  // Prevent further challenges on game over

  useEffect(() => {
    if (winCount === NUM_PLAYS) {
      setGameOver(true);
      // play enjoy music
      const audio = new Audio(enjoyMusic);
      audio.play();
      setTimeout(() => {
        if (onBackToMenu) onBackToMenu();
      }, 5000);
    }
  }, [winCount, onBackToMenu]);

  const handleSelect = (char) => {
    if (disableAll || selected[char] || gameOver) return;
    if (char === challenge.letter) {
      setDisableAll(true);
      setWinCount(w => w + 1);
      // play correct sound
      const audio = new Audio(correctSound);
      audio.play();
      setTimeout(() => {
        setDisableAll(false);
        setSelected({});
        // Only show new challenge if not game over
        if (winCount + 1 < NUM_PLAYS) {
          setChallenge(getRandomChallenge());
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
          <div style={{ position: "absolute", top: 16, left: 16, fontSize: 24 }}>
            Wins: {winCount}
          </div>
          {/* Emoji challenge */}
          <div style={{ fontSize: 96, textAlign: "center", margin: "48px 0" }}>
            {challenge.emoji}
          </div>
          {/* Options */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
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
            {typeof window.strings === 'object' && window.strings.congratulations ? window.strings.congratulations : '¡Felicidades!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default LettersGame;
