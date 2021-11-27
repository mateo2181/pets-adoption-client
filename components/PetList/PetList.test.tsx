import React from 'react';
import { render, screen } from '@testing-library/react';
import PetList from '.';
import { pets } from '../../__mocks__/pets';

describe('PetList component', () => {
    it('Pets are rendered', () => {
        const namePet = pets[0].name;
        render(<PetList pets={pets} />);
        expect(screen.getByText(namePet)).toBeInTheDocument();
    });
});