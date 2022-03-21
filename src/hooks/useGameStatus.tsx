import { useEffect, useState } from 'react';

import {
  fetchHighScores,
  randomTetromino,
  saveScore,
  Tetromino
} from '../helpers';
import { Score } from 'models';

const LEVEL_INCREASE_COUNT = 2;
const pointsTable: number[] = [0, 40, 100, 300, 1200];
const initialTetrominosList: Tetromino[] = [
  randomTetromino(),
  randomTetromino()
];

const initialHighScore = (): number => {
  const tempHighScore = localStorage.getItem('highScores');
  if (!tempHighScore) {
    return 0;
  }

  const scores = JSON.parse(tempHighScore);
  try {
    return scores[0].score ?? 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const useGameStatus = (
  rowsCleared: number
): [
  number,
  number,
  number,
  number,
  boolean,
  Tetromino[],
  () => void,
  () => void
] => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(initialHighScore());
  const [newHighScore, setNewHighScore] = useState(false);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);
  const [tetrominos, setTetrominos] = useState(initialTetrominosList);

  useEffect(() => {
    fetchHighScores();
  }, []);

  useEffect(() => {
    if (rowsCleared) {
      const newScore = score + pointsTable[rowsCleared] * level;
      setRows(rows + rowsCleared);
      setScore(newScore);

      const storableScore: Score = {
        duration: 0,
        level,
        name: 'Chubby Chub',
        rows: rows + rowsCleared,
        score: newScore,
        tetrominos: 0
      };
      saveScore(storableScore);

      if (newScore >= highScore) {
        setHighScore(newScore);
        setNewHighScore(true);
      }

      if (rows + rowsCleared >= level * LEVEL_INCREASE_COUNT) {
        setLevel(1 + Math.ceil((rows + rowsCleared) / LEVEL_INCREASE_COUNT));
      }
    }
  }, [rowsCleared]);

  const resetGame = (): void => {
    setScore(0);
    setNewHighScore(false);
    setRows(0);
    setLevel(1);
  };

  const generateNextTetromino = (): void => {
    setTetrominos([tetrominos[1], randomTetromino()]);
  };

  return [
    score,
    highScore,
    rows,
    level,
    newHighScore,
    tetrominos,
    resetGame,
    generateNextTetromino
  ];
};
