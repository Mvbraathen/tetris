import { useEffect, useState } from 'react';
import { randomTetromino, Tetromino } from '../helpers';

interface TetrominosList {
  tetrominos: Tetromino[];
}

const pointsTable: number[] = [0, 40, 100, 300, 1200];

const initialTetrominosList = [randomTetromino(), randomTetromino()];

export const useGameStatus = (
  rowsCleared: number
): [number, number, number, Tetromino[], () => void, () => void] => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);
  const [tetrominos, setTetromino] = useState(initialTetrominosList);

  useEffect(() => {
    if (rowsCleared) {
      setRows(rows + rowsCleared);
      setScore(score + pointsTable[rowsCleared] * level);

      if (rows + rowsCleared >= level * 10) {
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

  const nextTetromino = (): void => {
    setTetromino([tetrominos[1], randomTetromino()]);
  };

  return [score, rows, level, tetrominos, resetGame, nextTetromino];
};
