import React from 'react';
import { render } from 'react-dom';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const firebaseConfig = {
  apiKey: 'AIzaSyAd8NZ-dEf0hKOi8aVN-8TdsI_k4fV1QKk',
  authDomain: 'tetris-7b8bd.firebaseapp.com',
  projectId: 'tetris-7b8bd',
  storageBucket: 'tetris-7b8bd.appspot.com',
  messagingSenderId: '579789069904',
  appId: '1:579789069904:web:64fe71a1a74baf7471bb55',
  measurementId: 'G-5CR5XFGP8K'
};

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
