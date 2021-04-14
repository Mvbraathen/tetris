import { useEffect, useState } from 'react';

const pointsTable: number[] = [0, 40, 100, 300, 1200];

export const useGameStatus = (
  rowsCleared: number
): [number, number, number, () => void] => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);

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

  return [score, rows, level, resetGame];
};
