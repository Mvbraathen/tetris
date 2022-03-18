import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { render } from 'react-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const firebaseConfig = {
  apiKey: 'AIzaSyA0gvBuEPaccE2sW5ybIANcmPomKbDkkmA',
  authDomain: 'compis-tetris.firebaseapp.com',
  databaseURL:
    'https://compis-tetris-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'compis-tetris',
  storageBucket: 'compis-tetris.appspot.com',
  messagingSenderId: '920428522809',
  appId: '1:920428522809:web:6d7a26faa8208657a1cce8',
  measurementId: 'G-XJJ3HG47TQ'
};

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

getAnalytics(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
