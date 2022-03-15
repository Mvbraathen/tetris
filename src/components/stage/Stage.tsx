import React from 'react';

export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

import './Stage.scss';
import Cell from 'components/cell/Cell';
import { GameBoard } from 'helpers/gameHelpers';

export default function Stage(props: {
  stage: GameBoard;
  onClick: () => void;
}) {
  const { onClick, stage } = props;

  return (
    <div className={'Stage'} onClick={onClick}>
      {stage.rows.map((row, index) => (
        <div key={'r-' + index} className="Row">
          {row.cells.map((cell, index) => (
            <Cell key={'cl-' + index} color={cell.color} />
          ))}
        </div>
      ))}
    </div>
  );
}
