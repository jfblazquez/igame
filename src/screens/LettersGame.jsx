import React, { useState, useEffect } from 'react';
// Placeholder for confetti and sounds
// import Confetti from 'react-confetti';
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

const LettersGame = ({ onBackToMenu }) => {
  const [challenge, setChallenge] = useState(getRandomChallenge());
  const [selected, setSelected] = useState({});
  const [winCount, setWinCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disableAll, setDisableAll] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (winCount === 3) {
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
    if (disableAll || selected[char]) return;
    if (char === challenge.letter) {
      setShowConfetti(true);
      setDisableAll(true);
      setWinCount(w => w + 1);
      // play correct sound
      const audio = new Audio(correctSound);
      audio.play();
      setTimeout(() => {
        setShowConfetti(false);
        setDisableAll(false);
        setSelected({});
        setChallenge(getRandomChallenge());
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
      {/* Confetti placeholder */}
      {showConfetti && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
          {/* <Confetti /> */}
          <div style={{ fontSize: 48, color: "#FFD700", textAlign: "center", marginTop: 120 }}>🎉🎊</div>
        </div>
      )}
      {/* Game over music and redirect */}
      {gameOver && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
          <div>Enjoy the music! 🎵</div>
        </div>
      )}
    </div>
  );
};

export default LettersGame;
