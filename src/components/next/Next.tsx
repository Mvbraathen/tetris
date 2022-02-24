import React, { ReactElement } from 'react';

import css from './Next.module.scss';
import Cell from 'components/cell/Cell';
import { Tetromino } from '../../helpers';

interface NextProps {
  tetromino: Tetromino;
}

const Next = (props: NextProps): ReactElement => {
  const { tetromino } = props;

  const renderTetromino = (): ReactElement => {
    const stage = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[0].length; x++) {
        const pixel = tetromino.shape[y][x];
        if (!pixel) {
          continue;
        }

        stage[y][x] = tetromino.color;
      }
    }

    return (
      <div className={css.tetromino}>
        {stage.map((row, index) => (
          <div key={'p' + index} className={css.row}>
            {row.map((cell, n) => (
              <Cell key={'c' + index + '_' + n} color={cell} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={css.Next}>
      <span>NEXT</span>
      {renderTetromino()}
    </div>
  );
};

export default Next;
