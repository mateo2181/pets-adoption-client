import React from 'react';
import { render, screen } from '@testing-library/react';
import { pets } from '../../__mocks__/pets';
import Pet from '.';
import { CustomImage } from 'components/UI';

describe('Pet Component', () => {
    const pet = pets[0];
    it('Pet props are rendered', () => {
        render(<Pet onClick={() => {}} key={pet.id}>
                        <Pet.Image>
                            <CustomImage width={240} height={240} src={pet.pictureDefault?.path || ''} alt={pet.name} />
                        </Pet.Image>
                        <Pet.Info>
                            <Pet.Title>{pet.name}</Pet.Title>
                        </Pet.Info>          
               </Pet>);
        
        expect(screen.getByAltText(pet.name)).toBeInTheDocument();
        expect(screen.getByRole('heading')).toHaveTextContent(pet.name);

    });
});