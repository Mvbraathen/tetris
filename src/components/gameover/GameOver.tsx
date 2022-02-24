import React, { ReactElement } from 'react';

import css from './GameOver.module.scss';

interface GameOverProps {
  gameOver: boolean;
}

const GameOver = (props: GameOverProps) => {
  const { gameOver } = props;

  if (!gameOver) {
    return null;
  }

  return (
    <div className={css.GameOver}>
      <span>GAME OVER</span>
    </div>
  );
};

export default GameOver;
