import { addDoc, collection, DocumentData, getDocs } from 'firebase/firestore';

import { firestore } from '../index';
import { Score } from 'models';

export const fetchHighScores = async () => {
  const collRef = collection(firestore, 'Scores');
  const docSnap = await getDocs(collRef);

  docSnap.forEach((entry) => {
    const score = getScoreFromEntry(entry.data());
    console.log(score);
  });
};

export const saveScore = async (score: Score) => {
  const collRef = collection(firestore, 'Scores');
  const status = await addDoc(collRef, score);
  console.log('SAVED', status);
};

const getScoreFromEntry = (entry: DocumentData): Score => {
  return {
    created: entry.created,
    level: entry.level,
    duration: entry.duration,
    name: entry.name,
    rows: entry.rows,
    score: entry.score,
    tetrominos: entry.tetrominos
  };
};
