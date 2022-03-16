import React, { useEffect, useState } from 'react';

import css from './GameOver.module.scss';
import ScorePage from './scorepage/ScorePage';

interface GameOverProps {
  gameOver: boolean;
  score: number;
  restart: () => void;
}

interface HighScores {
  score: number;
  name: string;
}

const GameOver = (props: GameOverProps) => {
  const { gameOver, score, restart } = props;
  const [showScores, setShowScores] = useState(false);
  const [currentRank, setCurrentRank] = useState(1);

  const currentHighScores = JSON.parse(
    localStorage.getItem('highScores') ?? '[]'
  ) as HighScores[];

  const showHighScores = () => {
    restart();
  };

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
      setShowScores(false);
      setTimeout(() => {
        setShowScores(true);
      }, 2000);
    }
  }, [gameOver]);

  if (!gameOver) {
    return null;
  }

  return showScores ? (
    <div className={css.GameOver}>
      <ScorePage
        score={score}
        rank={`${currentRank}/${currentHighScores.length + 1}`}
        showHighScores={showHighScores}
      />
    </div>
  ) : (
    <div className={css.GameOver}>
      <span>GAME OVER</span>
    </div>
  );
};

export default GameOver;
