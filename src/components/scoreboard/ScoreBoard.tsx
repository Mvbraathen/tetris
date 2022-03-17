import React from 'react';

import { ReactComponent as TetrisHeader } from '../../svg/tetrisHeader.svg';
import Display from 'components/display/Display';
import css from './ScoreBoard.module.scss';

interface ScoreBoardProps {
  scoreBoard: boolean;
}

const ScoreBoard = (props: ScoreBoardProps) => {
  const { scoreBoard } = props;

  if (!scoreBoard) {
    return null;
  }

  return (
    <div className={css.scoreScreenOverlay}>
      <div className={css.container}>
        <TetrisHeader className={css.TetrisHeader} />
        <ol className={css.ScoreBoardList}>
          {[...Array(10).keys()].map((i) => (
            <li key={i}>
              <Display content="" />
            </li>
          ))}
        </ol>
        <button className={css.PlayButton}>SPILL OG VINN PREMIE</button>
      </div>
    </div>
  );
};

export default ScoreBoard;
