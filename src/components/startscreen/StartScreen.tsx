import React from 'react';

import Lottie from 'lottie-react';
import animationData from '../../lotties/hiro-hiding.json';
import css from './StartScreen.module.scss';

interface StartScreenProps {
  startScreen: boolean;
}

const StartScreen = (props: StartScreenProps) => {
  const { startScreen } = props;

  if (!startScreen) {
    return null;
  }

  return (
    <div className={css.StartScreen}>
      <h1 className={css.StartSreenHeader}>Welcome!</h1>
      <p className={css.StartScreenInformation}>
        1: Use the arrow keys to move the tetromino.
      </p>
      <p className={css.StartScreenInformation}>
        2: Press play or space to start the game.
      </p>
      <p className={css.StartScreenInformation}>3: Good luck, and have fun!</p>
      <Lottie
        animationData={animationData}
        autoPlay
        loop
        style={{ height: 187 }}
      />
    </div>
  );
};

export default StartScreen;
