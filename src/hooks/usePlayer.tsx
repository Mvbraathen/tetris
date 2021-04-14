import { useCallback, useState } from 'react';

import {
  detectCollision,
  GameBoard,
  randomTetromino,
  Tetromino
} from 'helpers';
import { STAGE_WIDTH } from 'components/stage/Stage';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  position: Position;
  tetromino: Tetromino;
  collided: boolean;
}

const initialPlayerState: Player = {
  position: { x: STAGE_WIDTH / 2 - 2, y: -3 },
  tetromino: randomTetromino(),
  collided: false
};

export const usePlayer = (): [
  Player,
  (x: number, y: number, collided: boolean) => void,
  any,
  (stage: GameBoard, dir: number) => void
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
    const tetromino = randomTetromino();
    setPlayer({
      ...initialPlayerState,
      tetromino,
      position: {
        x: STAGE_WIDTH / 2 - 2,
        y: -1 * Math.max(2, tetromino.shape.length + 1)
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

  return [player, updatePlayerPosition, resetPlayer, rotatePlayer];
};
