import React, { useEffect, useState } from 'react';

import css from './Tetris.module.scss';
import Display from 'components/display/Display';
import Stage from 'components/stage/Stage';
import { createStage, detectCollision } from 'helpers';
import { useGameStatus, useInterval, usePlayer, useStage } from 'hooks';

interface GameState {
  gameOver: boolean;
}

const initialGameState: GameState = {
  gameOver: true
};

export default function Tetris() {
  const [state, setState] = useState(initialGameState);
  const [player, updatePlayerPosition, resetPlayer, rotatePlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player);
  const [score, rows, level, resetGame] = useGameStatus(rowsCleared);
  const [dropSpeed, setDropSpeed] = useState(1100);

  const keyDownHandler = (event: any): void => {
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
      resetPlayer();
    }
  }, [player.collided]);

  useEffect(() => {
    setDropSpeed(900 / level + 200);
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
    resetPlayer();
    resetGame();
    setStage(createStage());
    setState({
      ...state,
      gameOver: false
    });

    document.querySelector('section')?.focus();
  };

  return (
    <section
      className={css.Tetris}
      onKeyDown={(event) => keyDownHandler(event)}
      tabIndex={0}
    >
      <Stage stage={stage} />
      <aside>
        <Display content={'Score: ' + score} />
        <Display content={'Rows: ' + rows} />
        <Display content={'Level ' + level} />
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
