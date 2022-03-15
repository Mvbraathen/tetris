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

export const canMove = (player: Player, position: Position): boolean => {
  const bb = getTetrominoBB(player.tetromino, position);
  if (bb[0] < 0 || bb[2] >= STAGE_WIDTH) {
    return false;
  }

  return true;
};

export const detectCollision = (
  player: Player,
  stage: GameBoard,
  position: Position
): boolean => {
  const bb = getTetrominoBB(player.tetromino, { x: 0, y: 0 });
  if (position.y + bb[3] < 0) {
    return false;
  }

  if (position.x + bb[0] < 0 || position.x + bb[2] > STAGE_WIDTH) {
    return true;
  }

  for (let y = bb[1]; y <= bb[3]; y++) {
    const yPos = position.y + y - bb[1];
    if (yPos < 0) {
      continue;
    }

    for (let x = bb[0]; x <= bb[2]; x++) {
      const pixel = player.tetromino.shape[y][x];
      if (!pixel) {
        continue;
      }

      if (yPos >= STAGE_HEIGHT) {
        return true;
      }

      if (
        bb[1] >= 0 &&
        (position.x + x < 0 ||
          position.x + x >= STAGE_WIDTH ||
          position.y + y < 0)
      ) {
        return true;
      }

      if (stage.rows[yPos].cells[position.x + x].locked) {
        return true;
      }
    }
  }

  return false;
};

export const getTetrominoBB = (
  tetromino: Tetromino,
  position: Position
): [number, number, number, number] => {
  let left = 100;
  let top = -10;
  let right = -10;
  let bottom = -10;

  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] !== 0) {
        if (position.x + x < left) {
          left = position.x + x;
        }

        if (position.x + x > right) {
          right = position.x + x;
        }

        if (top === -10) {
          top = position.y + y;
        }
        bottom = position.y + y;
      }
    }
  }

  return [left, top, right, bottom];
};

export const calculateLandingRow = (
  player: Player,
  stage: GameBoard
): number => {
  const bb = getTetrominoBB(player.tetromino, { x: 0, y: 0 });
  const height = bb[3] - bb[1] + 1;

  let landingAt = stage.rows.length - height;
  let collision = false;
  for (
    let ry = player.position.y + bb[1];
    ry <= stage.rows.length - height;
    ry++
  ) {
    for (let y = 0; y <= bb[3]; y++) {
      const examineY = ry + y;
      for (let x = bb[0]; x <= bb[2]; x++) {
        const pixel = player.tetromino.shape[y][x];
        if (!pixel) {
          continue;
        }

        if (examineY < 0 || examineY >= stage.rows.length) {
          continue;
        }

        if (stage.rows[examineY].cells[player.position.x + x].locked) {
          collision = true;
          landingAt = ry - 1 + bb[1];
          break;
        }
      }

      if (collision) {
        break;
      }
    }

    if (collision) {
      break;
    }
  }

  return landingAt;
};
