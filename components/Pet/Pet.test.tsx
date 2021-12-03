import React from 'react';
import { render, screen } from '@testing-library/react';
import { pets } from '../../__mocks__/pets';
import Pet from '.';

describe('Pet Component', () => {
    const pet = pets[0];
    it('Pet props are rendered', () => {
        render(<Pet name={pet.name}
            widthCard={200}
            onClick={() => {}}
            defaultImage={pet.pictureDefault?.path || ''}
            breed={pet.breed?.name || ''}
            key={pet.id}
            id={pet.id}/>);
        
        expect(screen.getByAltText(pet.name)).toBeInTheDocument();
        expect(screen.getByRole('heading')).toHaveTextContent(pet.name);

    });
});