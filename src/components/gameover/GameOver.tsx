import React, { useEffect, useState } from 'react';

import css from './GameOver.module.scss';
import ScorePage from './scorepage/ScorePage';

interface GameOverProps {
  gameOver: boolean;
  score: number;
}

interface HighScores {
  score: number;
  name: string;
}

const GameOver = (props: GameOverProps) => {
  const { gameOver, score } = props;
  const [text, setText] = useState(<span>GAME OVER</span>);
  const [currentRank, setCurrentRank] = useState(1);

  const currentHighScores = JSON.parse(
    localStorage.getItem('highScores') ?? '[]'
  ) as HighScores[];

  const highScore = (
    <ScorePage
      score={score}
      rank={`${currentRank}/${currentHighScores.length}`}
    />
  );
  useEffect(() => {
    if (gameOver) {
      if (currentHighScores.length === 0) {
        const newScore = [{ score, name: 'Player' }];
        localStorage.setItem('highScores', JSON.stringify(newScore));
      } else {
        currentHighScores.push({ score, name: 'Player' });
        currentHighScores.sort(
          (a: HighScores, b: HighScores) => b.score - a.score
        );
        localStorage.setItem('highScores', JSON.stringify(currentHighScores));
        setCurrentRank(
          currentHighScores.findIndex((item) => item.score <= score) + 1
        );
      }
      setText(<span>GAME OVER</span>);
      setTimeout(() => {
        setText(highScore);
      }, 2000);
    }
  }, [gameOver]);

  if (!gameOver) {
    return null;
  }

  return <div className={css.GameOver}>{text}</div>;
};

export default GameOver;
