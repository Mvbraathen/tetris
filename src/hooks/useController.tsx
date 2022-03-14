import { useState } from 'react';

import { GameState } from '../components/tetris/Tetris';

export const useController = (): [
  moveLeft: boolean,
  moveRight: boolean,
  moveDown: boolean,
  rotatePressed: boolean,
  handleKeyPressed: (event: { key: string }, state: GameState) => void,
  handleKeyReleased: (event: { key: string }, state: GameState) => void
] => {
  const [leftPressState, setLeftPressState] = useState(false);
  const [downPressState, setDownPressState] = useState(false);
  const [rightPressState, setRightPressState] = useState(false);
  const [rotatePressState, setRotatePressState] = useState(false);

  const handleKeyPressed = (event: { key: string }, state: GameState): void => {
    if (state.gameOver || state.startScreen) {
      if (event.key === ' ' && !downPressState) {
        setDownPressState(true);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        setLeftPressState(true);
        break;

      case 'ArrowRight':
        setRightPressState(true);
        break;

      case 'ArrowDown':
        setDownPressState(true);
        break;

      case 'ArrowUp':
        if (!rotatePressState) {
          setRotatePressState(true);
        }
        break;

      case ' ':
        setDownPressState(true);
        break;
    }
  };

  const handleKeyReleased = (event: { key: string }): void => {
    switch (event.key) {
      case 'ArrowLeft':
        setLeftPressState(false);
        break;

      case 'ArrowRight':
        setRightPressState(false);
        break;

      case 'ArrowDown':
        setDownPressState(false);
        break;

      case 'ArrowUp':
        setRotatePressState(false);
        break;

      case ' ':
        setDownPressState(false);
        break;
    }
  };

  return [
    leftPressState,
    rightPressState,
    downPressState,
    rotatePressState,
    handleKeyPressed,
    handleKeyReleased
  ];
};
