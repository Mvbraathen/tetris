import { useCallback, useState } from 'react';

import {
  detectCollision,
  GameBoard,
  randomTetromino,
  Tetromino
} from 'helpers';
import { Player } from '../models/player';
import { STAGE_WIDTH } from 'components/stage/Stage';

const initialPlayerState: Player = {
  position: { x: STAGE_WIDTH / 2 - 2, y: -3 },
  tetromino: randomTetromino(),
  nextTetromino: randomTetromino(),
  collided: false
};

export const usePlayer = (): [
  Player,
  (x: number, y: number, collided: boolean) => void,
  any,
  (stage: GameBoard, dir: number) => void,
  (tetromino: Tetromino) => void
] => {
  const [player, setPlayer] = useState(initialPlayerState);

  const updatePlayerPosition = (x: number, y: number, collided: boolean) => {
    setPlayer({
      ...player,
      position: { x, y },
      collided
    });
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      ...initialPlayerState,
      position: {
        x: STAGE_WIDTH / 2 - 2,
        y: -1 * Math.max(2, player.tetromino.shape.length + 1)
      }
    });
  }, []);

  const rotate = (tetromino: Tetromino, dir: number): Tetromino => {
    const transposedTetromino = player.tetromino.shape.map(
      (_: any, index: number) =>
        player.tetromino.shape.map((col: number[]) => col[index])
    );

    if (dir > 0) {
      return transposedTetromino.map((row: number[]) => row.reverse());
    }
    return transposedTetromino.reverse();
  };

  const rotatePlayer = (stage: GameBoard, dir: number): void => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino, dir);

    if (detectCollision(clonedPlayer, stage, clonedPlayer.position)) {
      return;
    }

    setPlayer(clonedPlayer);
  };

  const applyTetromino = (tetromino: Tetromino): void => {
    setPlayer({
      ...player,
      tetromino
    });
  };

  return [
    player,
    updatePlayerPosition,
    resetPlayer,
    rotatePlayer,
    applyTetromino
  ];
};
