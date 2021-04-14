import React from 'react';

export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

import './Stage.scss';
import Cell from 'components/cell/Cell';
import { GameBoard } from 'helpers/gameHelpers';

export default function Stage(props: { stage: GameBoard }) {
  const stage = props.stage;

  return (
    <div className="stage">
      {stage.rows.map((row, index) => (
        <div key={index} className="Row">
          {row.cells.map((cell, index) => (
            <Cell key={index} color={cell.color} />
          ))}
        </div>
      ))}
    </div>
  );
}
