import React from 'react';

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
      <div className={css.InformationBox}>
        <div className={css.informationBoxText}>
          Swipe i retningen du ønsker at klossene skal bevege seg.
        </div>
        <br />
        <div className={css.informationBoxText}>Tæpp for å rotere.</div>
      </div>
    </div>
  );
};

export default StartScreen;
