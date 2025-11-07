import React, { useState, useEffect } from 'react';
import correctSound from '../assets/correct.mp3';
import failSound from '../assets/fail.mp3';
import enjoyMusic from '../assets/clap.mp3';
import emojiMap from '../assets/emojiMap.js';


const NUM_PLAYS = 5;

function getRandomChallenge() {
  // Pick two random numbers between 1 and 9, sum < 15
  let a = Math.floor(Math.random() * 9) + 1;
  let b = Math.floor(Math.random() * 9) + 1;
  while (a + b >= 15) {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
  }
  // Pick two different fruit emojis for each number
  const fruits = emojiMap.en.filter(e => e.emoji.match(/[🍎🍌🍇🍍🍊🍋🍑🍒🍉🍓]/));
  const shuffled = fruits.sort(() => Math.random() - 0.5);
  const fruitA = shuffled[0].emoji;
  const fruitB = shuffled[1].emoji;
  // Generate three options, one correct, two incorrect
  const correct = a + b;
  let options = [correct];
  while (options.length < 3) {
    let opt = Math.floor(Math.random() * 14) + 2;
    if (opt !== correct && !options.includes(opt)) options.push(opt);
  }
  options = options.sort(() => Math.random() - 0.5);
  return { a, b, fruitA, fruitB, correct, options };
}

function NumbersGame({ strings, onBack }) {
  const [challenge, setChallenge] = useState(getRandomChallenge());
  const [selected, setSelected] = useState(null);
  const [winCount, setWinCount] = useState(0);
  const [disableAll, setDisableAll] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (winCount === NUM_PLAYS) {
      setTimeout(() => {
        setGameOver(true);
        const audio = new Audio(enjoyMusic);
        audio.play();
        setTimeout(() => {
          if (onBack) onBack();
        }, 2500);
      }, 2000);
    }
  }, [winCount]);

  const handleSelect = (num) => {
    if (disableAll || selected !== null || gameOver) return;
    setSelected(num);
    if (num === challenge.correct) {
      setDisableAll(true);
      setWinCount(w => w + 1);
      setAnimate(true);
      const audio = new Audio(correctSound);
      audio.play();
      setTimeout(() => {
        setDisableAll(false);
        setSelected(null);
        setAnimate(false);
        if (winCount + 1 < NUM_PLAYS) {
          setChallenge(getRandomChallenge());
        }
      }, 1800);
    } else {
      const audio = new Audio(failSound);
      audio.play();
      setTimeout(() => {
        setSelected(null);
      }, 1200);
    }
  };

  return (
    <div className="minigame-screen">
      <div style={{ width: '100%', textAlign: 'center', fontSize: 24, marginTop: 16, marginBottom: 8 }}>
        {(typeof strings.winsCounter === 'string' ? strings.winsCounter.replace('{count}', winCount) : `Wins: ${winCount}`)}
      </div>
      {/* Simple numbers and plus sign row */}
      {(!gameOver && !animate) && (
        <div style={{ fontSize: 24, margin: '16px 0', textAlign: 'center' }}>
          {challenge.a} <span style={{ fontSize: 24, margin: '0 12px' }}>+</span> {challenge.b}
        </div>
      )}
      {!gameOver && (
        <>
          {/* Challenge display: only emojis, numbers handled above */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '10px 0',
              position: 'relative',
              height: Math.max(120, 60 + 32 * (Math.max(challenge.a, challenge.b) > 3 ? 2 : 1)),
              minWidth: '60vw',
              transition: 'height 0.3s'
            }}
          >
            {/* Challenge A emojis, multiline if >3 */}
            <div
              style={{
                fontSize: Math.max(32, 64 - challenge.a * 4),
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {challenge.a > 3 ? (
                <>
                  <div>{Array.from({ length: Math.ceil(challenge.a / 2) }).map((_, i) => (
                    <span key={i}>{challenge.fruitA}</span>
                  ))}</div>
                  <div>{Array.from({ length: Math.floor(challenge.a / 2) }).map((_, i) => (
                    <span key={i}>{challenge.fruitA}</span>
                  ))}</div>
                </>
              ) : (
                <div>{Array.from({ length: challenge.a }).map((_, i) => (
                  <span key={i}>{challenge.fruitA}</span>
                ))}</div>
              )}
            </div>
            {/* Black divider between emoji groups */}
            <div
              style={{   
                transform: 'translateX(-50%)',
                width: animate ? '0px': '10vw',
                transition: 'width 0.5s',
                height: '70px',
                zIndex: 10
              }}
            />
            {/* Challenge B emojis, multiline if >3 */}
            <div
              style={{
                fontSize: Math.max(32, 64 - challenge.b * 4),
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {challenge.b > 3 ? (
                <>
                  <div>{Array.from({ length: Math.ceil(challenge.b / 2) }).map((_, i) => (
                    <span key={i}>{challenge.fruitB}</span>
                  ))}</div>
                  <div>{Array.from({ length: Math.floor(challenge.b / 2) }).map((_, i) => (
                    <span key={i}>{challenge.fruitB}</span>
                  ))}</div>
                </>
              ) : (
                <div>{Array.from({ length: challenge.b }).map((_, i) => (
                  <span key={i}>{challenge.fruitB}</span>
                ))}</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
            {challenge.options.map(num => (
              <button
                key={num}
                onClick={() => handleSelect(num)}
                disabled={disableAll || selected === num}
                style={{
                  fontSize: 32,
                  padding: '18px 36px',
                  borderRadius: 16,
                  background: selected === num && num !== challenge.correct ? '#f44336' : '#e0e0e0',
                  color: selected === num && num !== challenge.correct ? 'white' : 'black',
                  cursor: disableAll || selected === num ? 'not-allowed' : 'pointer',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'background 0.3s'
                }}
              >
                {num}
              </button>
            ))}
          </div>
          {/* Animation handled above, no extra emoji row needed */}
        </>
      )}
      {gameOver && (
        <div style={{ fontSize: 40, color: '#333', fontWeight: 'bold', marginTop: 64 }}>
          {(typeof strings.congratulations === 'string' ? strings.congratulations : 'Congratulations!')}
        </div>
      )}
      <button className="back-btn" onClick={onBack} style={{ marginTop: 48 }}>
        {strings.back}
      </button>
    </div>
  );
}

export default NumbersGame;
