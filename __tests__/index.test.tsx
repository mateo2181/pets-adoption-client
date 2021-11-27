import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home', () => {
  it('render title heading in banner', () => {
    render(<Home pets={[]}/>);

    const heading = screen.getByRole('heading', {
      name: 'Find the Perfect Pet for You',
    });

    expect(heading).toBeInTheDocument();
  });
});