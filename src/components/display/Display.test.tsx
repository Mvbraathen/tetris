import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import Display from './Display';

describe('Display', () => {
  it('Should render a div with whatever content passed to it', () => {
    render(<Display content={'Whatever...'} />);
    expect(screen.getByText('Whatever...')).toBeTruthy();

    cleanup();

    render(<Display content={'Score: 1000'} />);
    expect(screen.getByText('Score: 1000')).toBeTruthy();
  });
});
