import { useEffect, useState } from 'react';

import { randomTetromino, Tetromino } from '../helpers';

const LEVEL_INCREASE_COUNT = 2;
const pointsTable: number[] = [0, 40, 100, 300, 1200];
const initialTetrominosList: Tetromino[] = [
  randomTetromino(),
  randomTetromino()
];

export const useGameStatus = (
  rowsCleared: number
): [number, number, number, Tetromino[], () => void, () => void] => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);
  const [tetrominos, setTetrominos] = useState(initialTetrominosList);

  useEffect(() => {
    if (rowsCleared) {
      setRows(rows + rowsCleared);
      setScore(score + pointsTable[rowsCleared] * level);

      if (rows + rowsCleared >= level * LEVEL_INCREASE_COUNT) {
        increaseLevel();
      }
    }
  }, [rowsCleared]);

  const resetGame = (): void => {
    setScore(0);
    setRows(0);
    setLevel(1);
  };

  const increaseLevel = (): void => {
    setLevel(level + 1);
  };

  const generateNextTetromino = (): void => {
    setTetrominos([tetrominos[1], randomTetromino()]);
  };

  return [score, rows, level, tetrominos, resetGame, generateNextTetromino];
};
