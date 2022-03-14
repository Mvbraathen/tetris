import React from 'react';

import css from './ScorePage.module.scss';

interface ScorePageProps {
  score: number;
}

const ScorePage = (props: ScorePageProps) => {
  const { score } = props;
  const highScore = localStorage.getItem('highScore');
  const currentHighScore = highScore === null ? 0 : parseInt(highScore, 10);
  if (score > currentHighScore) {
    localStorage.setItem('highScore', score.toString());
  }

  const hiScore = () => {
    console.log('hello world');
  };

  return (
    <div className={css.ScorePage}>
      <div className={css.ScorePage__score}>
        <span>Poeng: {score}</span>
        <span>High Score: {highScore}</span>
      </div>
      <div className={css.ScorePage__button}>
        <button onClick={() => hiScore()}>Se toppliste</button>
      </div>
    </div>
  );
};

export default ScorePage;
