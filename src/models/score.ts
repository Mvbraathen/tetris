import firebase from 'firebase/compat';

import Timestamp = firebase.firestore.Timestamp;

export interface Score {
  created?: Timestamp;
  level: number;
  duration: number;
  name: string;
  rows: number;
  score: number;
  tetrominos: number;
}
