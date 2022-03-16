import React, { useEffect, useState } from 'react';

import { ReactComponent as ComputasLogo } from '../../../svg/computas.svg';
import { ReactComponent as Block0 } from '../../../svg/Block.svg';
import { ReactComponent as Block1 } from '../../../svg/Block-1.svg';
import { ReactComponent as Block2 } from '../../../svg/Block-2.svg';
import { ReactComponent as Block3 } from '../../../svg/Block-3.svg';
import { ReactComponent as Block4 } from '../../../svg/Block-4.svg';
import { ReactComponent as Block5 } from '../../../svg/Block-6.svg';
import { ReactComponent as Block6 } from '../../../svg/Block-8.svg';
import css from './ScorePage.module.scss';

interface ScorePageProps {
  score: number;
  rank: string;
  showHighScores: () => void;
}

const ScorePage = (props: ScorePageProps) => {
  const { score, rank, showHighScores } = props;

  return (
    <div className={css.ScorePage}>
      <div className={css.Column}>
        <div className={css.Tetromino}>
          <Block4 />
        </div>
        <div className={css.Tetromino}>
          <Block0 />
        </div>
        <div className={css.Tetromino}>
          <Block5 />
        </div>
        <div className={css.Tetromino}>
          <Block1 />
        </div>
      </div>
      <div className={css.Column}>
        <ComputasLogo
          style={{
            width: '210px',
            height: '210px',
            padding: '3rem'
          }}
        />
        <div className={css.ScorePageScore}>
          <span>
            Poengsum: <br />
            {score}
          </span>
        </div>
        <div className={css.ScorePageRank}>
          <span>Plassering: {rank}</span>
        </div>
        <div className={css.ScorePageButton}>
          <button onClick={() => showHighScores()}>
            <span className={css.ButtonText}>Toppliste</span>
          </button>
        </div>
        <div className={css.Tetromino}>
          <Block6 />
        </div>
      </div>
      <div className={css.Column}>
        <div className={css.Tetromino}>
          <Block3 />
        </div>
        <div className={css.Tetromino}>
          <Block5 />
        </div>
        <div className={css.Tetromino}>
          <Block0 />
        </div>
        <div className={css.Tetromino}>
          <Block2 />
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
