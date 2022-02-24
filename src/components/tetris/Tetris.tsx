import React, { useEffect, useState } from 'react';

import css from './Tetris.module.scss';
import Display from 'components/display/Display';
import Next from 'components/next/Next';
import Stage from 'components/stage/Stage';
import { createStage, detectCollision } from 'helpers';
import { useGameStatus, useInterval, usePlayer, useStage } from 'hooks';
import GameOver from '../gameover/GameOver';

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
  const [
    player,
    updatePlayerPosition,
    resetPlayer,
    rotatePlayer,
    applyTetromino
  ] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player);
  const [score, rows, level, tetrominos, resetGame, nextTetromino] =
    useGameStatus(rowsCleared);
  const [dropSpeed, setDropSpeed] = useState(1100);
  const [hasReleased, setHasReleased] = useState(true);
  const [gamesPlayed, increaseGamesPlayed] = useState(0);

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
        setDropSpeed(FAST_DROP_SPEED);
        setHasReleased(false);
        break;
    }
  };

  const keyUpHandler = (event: any): void => {
    if (event.key === ' ') {
      setDropSpeed(SPEED_FACTOR / level + LEVEL_FACTOR);
      setHasReleased(true);
    }
  };

  useInterval(() => {
    if (!state.gameOver) {
      drop();
    }
  }, dropSpeed);

  useEffect(() => {
    if (player.collided) {
      if (player.position.y < 1) {
        setState({
          ...state,
          gameOver: true
        });
        return;
      }
      nextTetromino();
      resetPlayer();
    }
  }, [player.collided]);

  useEffect(() => {
    applyTetromino(tetrominos[0]);
  }, [tetrominos]);

  useEffect(() => {
    setDropSpeed(SPEED_FACTOR / level + LEVEL_FACTOR);
    console.log('SPEED', SPEED_FACTOR / level + LEVEL_FACTOR);
  }, [level]);

  const movePlayer = (dir: number): void => {
    if (state.gameOver) {
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

    const collided = detectCollision(player, stage, {
      ...player.position,
      y: player.position.y + 1
    });

    updatePlayerPosition(
      player.position.x,
      player.position.y + (collided ? 0 : 1),
      collided
    );
  };

  const dropPlayer = (): void => {
    drop();
  };

  const play = (): void => {
    nextTetromino();
    resetPlayer();
    resetGame();
    setStage(createStage());
    setState({
      ...state,
      gameOver: false
    });
    increaseGamesPlayed(gamesPlayed + 1);

    document.querySelector('section')?.focus();
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
    </section>
  );
}
