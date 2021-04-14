import React from 'react';

import css from './App.module.scss';
import Tetris from 'components/tetris/Tetris';

export default function App() {
  return (
    <div className={css.App}>
      <header className={css.AppHeader}>TETRIS</header>
      <main>
        <Tetris />
      </main>
    </div>
  );
}
