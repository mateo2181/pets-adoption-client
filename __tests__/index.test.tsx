import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Home from 'pages/index';
import { mocks } from '__mocks__/mocks';
import { pets } from '__mocks__/pets';

describe('Home', () => {
  it('render title heading in banner', () => {

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home pets={pets}/>
      </MockedProvider>
    );
    
    const heading = screen.getByRole('heading', {
      name: 'Find the Perfect Pet for You',
    });

    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Lila')).toBeInTheDocument();
  });
});