import { act, render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import EditPet from 'pages/profile/pets/[id]';
import { pets } from '__mocks__/pets';
import { mocks } from '__mocks__/mocks';

describe('Testing Pet Edit page', ()  => {
    it('Invalid form when field name is empty', async () => {
        act(() => {
            render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <EditPet pet={pets[0]}/>
            </MockedProvider>
            );
        });
        expect(screen.getByRole('textbox', {name: 'Name'})).toHaveValue(pets[0].name);
        fireEvent.input(screen.getByRole('textbox', { name: 'Name' }), {
            target: {
              value: ''
            }
          });
        fireEvent.submit(screen.getByText('Update Pet'));
        expect(await screen.findAllByRole('alert')).toHaveLength(1);

    });
});