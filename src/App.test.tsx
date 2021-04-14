import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';

describe('App should setup and render the game', () => {
  it('Should contain the header named Tetris', () => {
    render(<App />);
    const tetrisHeader = screen.getByText(/Tetris/i);
    expect(tetrisHeader).toBeInTheDocument();
  });
});
