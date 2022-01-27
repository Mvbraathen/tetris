import React from 'react';

import { createStage } from './gameHelpers';
import { STAGE_HEIGHT, STAGE_WIDTH } from 'components/stage/Stage';
import { usePlayer } from '../hooks';

const MockComponent = () => {
  const [player] = usePlayer();

  return <div>TEST</div>;
};

describe('Gamehelpers', () => {
  it('Should create a stage with a 12 x 20 grid containing only empty cells', () => {
    const stage = createStage();
    expect(stage.rows[0].cells.length).toBe(STAGE_WIDTH);
    expect(stage.rows.length).toBe(STAGE_HEIGHT);

    let emptyCells = 0;
    stage.rows.forEach((row) => {
      emptyCells += row.cells.reduce((acc, b) => acc + b.color, 0);
    });

    expect(emptyCells).toBe(0);
  });
});
