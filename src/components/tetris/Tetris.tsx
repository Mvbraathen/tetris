import React, { useEffect, useState } from 'react';

import Lottie from 'lottie-react';
import animationData from '../../lotties/countdown.json';
import css from './Tetris.module.scss';
import Display from 'components/display/Display';
import GameOver from '../gameover/GameOver';
import StartScreen from '../startscreen/StartScreen';
import Next from 'components/next/Next';
import Stage from 'components/stage/Stage';
import { canMove, createStage, detectCollision } from 'helpers';
import { useGameStatus, useInterval, usePlayer, useStage } from 'hooks';

interface GameState {
  gameOver: boolean;
  startScreen: boolean;
  dropSpeed: number;
}

const initialGameState: GameState = {
  gameOver: false,
  startScreen: true,
  dropSpeed: 1100
};

const LEFT = -1;
const RIGHT = 1;
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
  const [leftPressState, setLeftPressState] = useState(false);
  const [downPressState, setDownPressState] = useState(false);
  const [rightPressState, setRightPressState] = useState(false);

  const keyDownHandler = (event: { key: string }): void => {
    if (state.gameOver || state.startScreen) {
      if (event.key === ' ' && hasReleased) {
        play();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        movePlayer(LEFT);
        break;

      case 'ArrowRight':
        movePlayer(RIGHT);
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

  const keyUpHandler = (event: { key: string }): void => {
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
      if (leftPressState) {
        movePlayer(LEFT);
      }
      if (rightPressState) {
        movePlayer(RIGHT);
      }
      if (downPressState) {
        dropPlayer();
      }
    }
  }, 100);

  useEffect(() => {
    if (player.collided) {
      if (player.position.y < 0) {
        setState({
          ...state,
          gameOver: true,
          startScreen: false
        });
        return;
      } else {
        generateNextTetromino();
      }
    }
  }, [player.collided]);

  useEffect(() => {
    setDownPressState(false);
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
    if (state.gameOver || state.startScreen) {
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
    setDownPressState(false);
    setStage(createStage());
    setState({
      ...state,
      gameOver: false,
      startScreen: false
    });
    increaseGamesPlayed(gamesPlayed + 1);

    document.querySelector('section')?.focus();
  };

  const returnHome = (): void => {
    setState({
      ...state,
      gameOver: false,
      startScreen: true
    });
    resetGame();
    setStage(createStage());
    increaseGamesPlayed(0);
  };

  const handleButtonPressed = (
    key: string,
    event: React.TouchEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();

    switch (key) {
      case 'left':
        setLeftPressState(true);
        break;

      case 'right':
        setRightPressState(true);
        break;

      case 'down':
        setDownPressState(true);
        break;
    }
  };

  const handleButtonReleased = (
    key: string,
    event: React.TouchEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();

    switch (key) {
      case 'left':
        setLeftPressState(false);
        break;

      case 'right':
        setRightPressState(false);
        break;

      case 'down':
        setDownPressState(false);
        setDropSpeed(levelSpeed);
        break;
    }
  };

  return (
    <section
      className={css.Tetris}
      onKeyDown={keyDownHandler}
      onKeyUp={keyUpHandler}
      tabIndex={0}
    >
      <section>
        <Stage stage={stage} />
        <GameOver gameOver={state.gameOver && gamesPlayed > 0} />
        <StartScreen startScreen={state.startScreen && gamesPlayed === 0} />
        <aside>
          <Next tetromino={tetrominos[1]} />
          <Display content={'Score: ' + score} />
          <Display content={'Rows: ' + rows} />
          <Display content={'Level: ' + level} />
          {state.gameOver ? (
            <div className={css.ButtonPlacement}>
              <button
                className={css.PlayAgainButton}
                onClick={() => {
                  play();
                }}
                tabIndex={-1}
              >
                Try again
              </button>
              <button
                className={css.HomeButton}
                onClick={() => returnHome()}
                tabIndex={-1}
              >
                Home
              </button>
            </div>
          ) : state.startScreen ? (
            <button
              className={css.PlayButton}
              onClick={() => play()}
              tabIndex={-1}
            >
              PLAY
            </button>
          ) : null}
        </aside>
      </section>
      <div className={css.buttons}>
        <button
          disabled={state.gameOver}
          onTouchStart={(event) => handleButtonPressed('left', event)}
          onTouchEnd={(event) => handleButtonReleased('left', event)}
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
            onTouchStart={(event) => handleButtonPressed('down', event)}
            onTouchEnd={(event) => handleButtonReleased('down', event)}
          >
            DOWN
          </button>
        </div>
        <button
          disabled={state.gameOver}
          onTouchStart={(event) => handleButtonPressed('right', event)}
          onTouchEnd={(event) => handleButtonReleased('right', event)}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}
