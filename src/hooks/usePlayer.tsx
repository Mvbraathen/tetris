import { useState } from 'react';

import {
  detectCollision,
  GameBoard,
  getTetrominoBB,
  randomTetromino,
  Tetromino
} from 'helpers';
import { Player } from '../models/player';
import { STAGE_WIDTH } from 'components/stage/Stage';

const initialPlayerState: Player = {
  position: { x: STAGE_WIDTH / 2 - 2, y: -4 },
  tetromino: randomTetromino(),
  collided: false
};

export const usePlayer = (): [
  Player,
  (x: number, y: number, collided: boolean) => void,
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

  const applyNextTetromino = (tetromino: Tetromino): void => {
    const bb = getTetrominoBB(tetromino, { x: 0, y: 0 });
    const width = bb[2] - bb[0] + 1;
    const height = bb[3] - bb[1] + 1;

    setPlayer({
      ...player,
      position: {
        x: STAGE_WIDTH / 2 - Math.round(width / 2) - bb[0],
        y: -1 * height
      },
      tetromino,
      collided: false
    });
  };

  return [player, updatePlayerPosition, rotatePlayer, applyNextTetromino];
};
