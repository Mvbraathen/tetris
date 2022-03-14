import React from 'react';

import { ReactComponent as TetrisHeader } from './svg/tetrisHeader.svg';
import Tetris from 'components/tetris/Tetris';

export default function App() {
  return (
    <div>
      <TetrisHeader
        style={{
          display: 'block',
          width: '20rem',
          margin: 'auto'
        }}
      />
      <main>
        <Tetris />
      </main>
    </div>
  );
}
