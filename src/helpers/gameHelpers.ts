import { STAGE_HEIGHT, STAGE_WIDTH } from 'components/stage/Stage';
import { Player, Position } from 'models';
import { Tetromino } from './tetrominos';

export interface Row {
  cells: { color: number; locked: boolean }[];
}

export interface GameBoard {
  rows: Row[];
}

export const createStage = (): GameBoard => {
  const initialBoard: GameBoard = {
    rows: []
  };

  while (initialBoard.rows.length < STAGE_HEIGHT) {
    const initialRow: Row = { cells: [] };
    while (initialRow.cells.length < STAGE_WIDTH) {
      initialRow.cells.push({ color: 0, locked: false });
    }

    initialBoard.rows.push(initialRow);
  }

  return initialBoard;
};

export const detectCollision = (
  player: Player,
  stage: GameBoard,
  position: Position
): boolean => {
  const bb = getTetrominoBB(player.tetromino, position);
  if (bb[1] < 0) {
    return false;
  }

  for (let y = 0; y < player.tetromino.shape.length; y++) {
    if (position.y + y < 0) {
      continue;
    }

    for (let x = 0; x < player.tetromino.shape[0].length; x++) {
      const pixel = player.tetromino.shape[y][x];
      if (!pixel) {
        continue;
      }

      if (position.x + x < 0 || position.x + x >= STAGE_WIDTH) {
        return true;
      }

      if (position.y + y >= STAGE_HEIGHT) {
        return true;
      }

      if (stage.rows[position.y + y].cells[position.x + x].locked) {
        return true;
      }
    }
  }

  return false;
};

const getTetrominoBB = (
  tetromino: Tetromino,
  position: Position
): [number, number] => {
  let top = -10;
  let bottom = 0;
  for (let y = 0; y < tetromino.shape.length; y++) {
    if (tetromino.shape[y].reduce((a: number, b: number) => a + b, 0) > 0) {
      if (top === -10) {
        top = position.y + y;
      }
      bottom = top + y;
    }
  }

  return [top, bottom];
};
