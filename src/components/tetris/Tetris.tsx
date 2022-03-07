import React, { useEffect, useState } from 'react';

import css from './Tetris.module.scss';
import Display from 'components/display/Display';
import GameOver from '../gameover/GameOver';
import Next from 'components/next/Next';
import Stage from 'components/stage/Stage';
import { canMove, createStage, detectCollision } from 'helpers';
import { useGameStatus, useInterval, usePlayer, useStage } from 'hooks';

interface GameState {
  gameOver: boolean;
  dropSpeed: number;
}

const initialGameState: GameState = {
  gameOver: true,
  dropSpeed: 1100
};

const SPEED_FACTOR = 450;
const LEVEL_FACTOR = 125;
const FAST_DROP_SPEED = 25;

export default function Tetris() {
  const [state, setState] = useState(initialGameState);
  const [player, updatePlayerPosition, rotatePlayer, applyNextTetromino] =
    usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player);
  const [score, rows, level, tetrominos, resetGame, generateNextTetromino] =
    useGameStatus(rowsCleared);
  const [dropSpeed, setDropSpeed] = useState(1100);
  const [hasReleased, setHasReleased] = useState(true);
  const [gamesPlayed, increaseGamesPlayed] = useState(0);
  const [keyboardState, setKeyboardState] = useState({
    left: false,
    right: false,
    down: false
  });

  const keyDownHandler = (event: any): void => {
    if (state.gameOver) {
      if (event.key === ' ' && hasReleased) {
        play();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        movePlayer(-1);
        break;

      case 'ArrowRight':
        movePlayer(1);
        break;

      case 'ArrowDown':
        dropPlayer();
        break;

      case 'ArrowUp':
        rotatePlayer(stage, 1);
        break;

      case ' ':
        dropPlayer();
        break;
    }
  };

  const levelSpeed = (): number => {
    return SPEED_FACTOR / level + LEVEL_FACTOR;
  };

  const keyUpHandler = (event: any): void => {
    if (event.key === ' ' || event.key === 'ArrowDown') {
      setDropSpeed(levelSpeed);
      setHasReleased(true);
    }
  };

  useInterval(() => {
    if (!state.gameOver || !player.collided) {
      drop();
    }
  }, dropSpeed);

  useInterval(() => {
    if (!state.gameOver) {
      if (keyboardState.left) {
        movePlayer(-1);
      }
      if (keyboardState.right) {
        movePlayer(1);
      }
      if (keyboardState.down) {
        dropPlayer();
      }
    }
  }, 100);

  useEffect(() => {
    if (player.collided) {
      if (player.position.y < 0) {
        setState({
          ...state,
          gameOver: true
        });
        return;
      } else {
        generateNextTetromino();
      }
    }
  }, [player.collided]);

  useEffect(() => {
    applyNextTetromino(tetrominos[0]);
  }, [tetrominos]);

  useEffect(() => {
    setDropSpeed(levelSpeed);
  }, [level]);

  const movePlayer = (dir: number): void => {
    if (state.gameOver) {
      return;
    }

    if (
      !canMove(player, {
        ...player.position,
        x: player.position.x + dir
      })
    ) {
      return;
    }

    if (
      detectCollision(player, stage, {
        ...player.position,
        x: player.position.x + dir
      })
    ) {
      return;
    }

    updatePlayerPosition(player.position.x + dir, player.position.y, false);
  };

  const drop = (): void => {
    if (state.gameOver) {
      return;
    }

    const didCollide = detectCollision(player, stage, {
      ...player.position,
      y: player.position.y + 1
    });

    updatePlayerPosition(
      player.position.x,
      player.position.y + (didCollide ? 0 : 1),
      didCollide
    );
  };

  const dropPlayer = (): void => {
    setDropSpeed(FAST_DROP_SPEED);
    setHasReleased(false);
  };

  const play = (): void => {
    generateNextTetromino();
    resetGame();
    setStage(createStage());
    setState({
      ...state,
      gameOver: false
    });
    increaseGamesPlayed(gamesPlayed + 1);

    document.querySelector('section')?.focus();
  };

  const handleButtonPressed = (key: string): void => {
    const newState = { ...keyboardState };
    switch (key) {
      case 'left':
        newState.left = true;
        break;

      case 'right':
        newState.right = true;
        break;

      case 'down':
        newState.down = true;
        break;
    }

    setKeyboardState(newState);
  };

  const handleButtonReleased = (key: string): void => {
    const newState = { ...keyboardState };
    switch (key) {
      case 'left':
        newState.left = false;
        break;

      case 'right':
        newState.right = false;
        break;

      case 'down':
        newState.down = false;
        setDropSpeed(levelSpeed);
        break;
    }

    setKeyboardState(newState);
  };

  return (
    <section
      className={css.Tetris}
      onKeyDown={keyDownHandler}
      onKeyUp={keyUpHandler}
      tabIndex={0}
    >
      <Stage stage={stage} />
      <GameOver gameOver={state.gameOver && gamesPlayed > 0} />
      <aside>
        <Next tetromino={tetrominos[1]} />
        <Display content={'Score: ' + score} />
        <Display content={'Rows: ' + rows} />
        <Display content={'Level: ' + level} />
        {state.gameOver && (
          <div>
            <button onClick={() => play()} tabIndex={-1}>
              PLAY
            </button>
          </div>
        )}
      </aside>
      <div className={css.buttons}>
        <button
          disabled={state.gameOver}
          onMouseDown={() => handleButtonPressed('left')}
          onMouseUp={() => handleButtonReleased('left')}
        >
          &lt;
        </button>
        <div>
          <button
            disabled={state.gameOver}
            onClick={() => rotatePlayer(stage, 1)}
          >
            ROTATE
          </button>
          <br />
          <br />
          <button
            disabled={state.gameOver}
            onMouseDown={() => handleButtonPressed('down')}
            onMouseUp={() => handleButtonReleased('down')}
          >
            DOWN
          </button>
        </div>
        <button
          disabled={state.gameOver}
          onMouseDown={() => handleButtonPressed('right')}
          onMouseUp={() => handleButtonReleased('right')}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}
