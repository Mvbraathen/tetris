import React, { useState } from 'react';

import css from './GameOver.module.scss';
import ScorePage from './scorepage/ScorePage';

interface GameOverProps {
  gameOver: boolean;
  score: number;
}

const GameOver = (props: GameOverProps) => {
  const { gameOver, score } = props;
  const [text, setText] = useState(<span>GAME OVER</span>);
  const highScore = <ScorePage score={score} />;

  if (!gameOver) {
    return null;
  }

  const currentHighScore = localStorage.getItem('highScore');
  if (currentHighScore === null) {
    localStorage.setItem('highScore', score.toString());
  } else {
    if (score > parseInt(currentHighScore, 10)) {
      localStorage.setItem('highScore', score.toString());
    }
  }

  setTimeout(() => {
    setText(highScore);
  }, 2000);

  return <div className={css.GameOver}>{text}</div>;
};

export default GameOver;
