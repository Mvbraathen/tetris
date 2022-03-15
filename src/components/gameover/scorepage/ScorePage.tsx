import React, { useEffect, useState } from 'react';

import { ReactComponent as ComputasLogo } from '../../../svg/computas.svg';
import css from './ScorePage.module.scss';

interface ScorePageProps {
  score: number;
  rank: string;
}

const ScorePage = (props: ScorePageProps) => {
  const { score, rank } = props;

  return (
    <div className={css.ScorePage}>
      <ComputasLogo
        style={{
          width: '210px',
          height: '210px',
          filter: 'invert(100%) grayscale(100%) contrast(200%)'
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
        <button>Toppliste</button>
      </div>
    </div>
  );
};

export default ScorePage;
