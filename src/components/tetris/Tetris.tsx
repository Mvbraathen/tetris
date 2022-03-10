import React, { useEffect, useState } from 'react';

import css from './Tetris.module.scss';
import Display from 'components/display/Display';
import GameOver from '../gameover/GameOver';
import StartScreen from '../startscreen/StartScreen';
import Next from 'components/next/Next';
import Stage from 'components/stage/Stage';
import { canMove, createStage, detectCollision } from 'helpers';
import {
  useController,
  useGameStatus,
  useInterval,
  usePlayer,
  useStage
} from 'hooks';

export interface GameState {
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
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [
    leftPressState,
    rightPressState,
    downPressState,
    rotatePressState,
    handleKeyPressed,
    handleKeyReleased,
    handleButtonPressed,
    handleButtonReleased
  ] = useController();

  const levelSpeed = (): number => {
    return SPEED_FACTOR / level + LEVEL_FACTOR;
  };

  useEffect(() => {
    document.querySelector('section')?.focus();
  }, []);

  useEffect(() => {
    if (!downPressState) {
      setDropSpeed(levelSpeed);
    } else {
      if (state.gameOver || state.startScreen) {
        play();
      }
    }
  }, [downPressState]);

  useEffect(() => {
    if (rotatePressState) {
      rotatePlayer(stage, 1);
    }
  }, [rotatePressState]);

  useEffect(() => {
    if (leftPressState) {
      movePlayer(LEFT);
    }
    if (rightPressState) {
      movePlayer(RIGHT);
    }
  }, [leftPressState, rightPressState]);

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
    // setDownPressState(false);
    applyNextTetromino(tetrominos[0]);
  }, [tetrominos]);

  useEffect(() => {
    setDropSpeed(levelSpeed);
  }, [level]);

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
  }, 130);

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
  };

  const play = (): void => {
    generateNextTetromino();
    resetGame();
    setStage(createStage());
    setState({
      ...state,
      gameOver: false,
      startScreen: false
    });
    setGamesPlayed(gamesPlayed + 1);

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
    setGamesPlayed(0);
  };

  return (
    <section
      className={css.Tetris}
      onKeyDown={(event) => handleKeyPressed(event, state)}
      onKeyUp={(event) => handleKeyReleased(event, state)}
      tabIndex={0}
      onContextMenu={(event) => {
        event.stopPropagation();
        event.preventDefault();
      }}
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
          onTouchStart={() => handleButtonPressed('left')}
          onTouchEnd={() => handleButtonReleased('left')}
          onContextMenu={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          &lt;
        </button>
        <div>
          <button
            disabled={state.gameOver}
            onClick={() => rotatePlayer(stage, 1)}
            onContextMenu={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            ROTATE
          </button>
          <br />
          <br />
          <button
            disabled={state.gameOver}
            onTouchStart={() => handleButtonPressed('down')}
            onTouchEnd={() => handleButtonReleased('down')}
            onContextMenu={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            DOWN
          </button>
        </div>
        <button
          disabled={state.gameOver}
          onTouchStart={() => handleButtonPressed('right')}
          onTouchEnd={() => handleButtonReleased('right')}
          onContextMenu={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}
