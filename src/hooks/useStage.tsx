import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { createStage, GameBoard, Row } from 'helpers/gameHelpers';
import { Player } from 'models';
import { STAGE_HEIGHT, STAGE_WIDTH } from 'components/stage/Stage';

const initialStage = createStage();

export const useStage = (
  player: Player
): [GameBoard, Dispatch<SetStateAction<GameBoard>>, number] => {
  const [stage, setStage] = useState(initialStage);
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);
  }, []);

  useEffect(() => {
    const newStage = { ...stage };

    clearStage(newStage);
    renderTetromino(player, newStage);

    const lines = checkLines(newStage);
    setRowsCleared(lines);

    setStage(newStage);
  }, [player]);

  return [stage, setStage, rowsCleared];
};

const clearStage = (stage: GameBoard): void => {
  for (let y = 0; y < STAGE_HEIGHT; y++) {
    for (let x = 0; x < STAGE_WIDTH; x++) {
      if (stage.rows[y].cells[x].locked) {
        continue;
      }

      stage.rows[y].cells[x].color = 0;
    }
  }
};

const renderTetromino = (player: Player, stage: GameBoard): void => {
  for (let y = 0; y < player.tetromino.shape.length; y++) {
    for (let x = 0; x < player.tetromino.shape[0].length; x++) {
      const pixel = player.tetromino.shape[y][x];
      if (!pixel) {
        continue;
      }

      if (player.position.y + y < 0) {
        continue;
      }

      stage.rows[player.position.y + y].cells[player.position.x + x] = {
        color: pixel !== 0 ? player.tetromino.color : 0,
        locked: player.collided
      };
    }
  }
};

const checkLines = (stage: GameBoard): number => {
  const keepers: Row[] = [];

  for (let y = 0; y < STAGE_HEIGHT; y++) {
    if (stage.rows[y].cells.findIndex((cell) => !cell.locked) !== -1) {
      keepers.push(stage.rows[y]);
    }
  }

  const lines = STAGE_HEIGHT - keepers.length;
  if (!lines) {
    return 0;
  }

  while (keepers.length < STAGE_HEIGHT) {
    const newRow: Row = { cells: [] };
    for (let x = 0; x < STAGE_WIDTH; x++) {
      newRow.cells.push({ color: 0, locked: false });
    }
    keepers.unshift(newRow);
  }

  stage.rows = keepers;

  return lines;
};
