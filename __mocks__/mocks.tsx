import { GET_PETS, UPDATE_PET } from '../apollo/queries';
import { pets } from './pets';

// const { id, name, breed, high } = pets[0];

export const mocks = [
    {
        request: {
            query: GET_PETS,
            variables: {
                limit: 5,
                petTypeId: 1
            },
        },
        result: {
            data: {
                pets
            },
        },
    },
    {
        request: {
            query: UPDATE_PET,
            variables: {
                input: { 
                    id: Number(pets[0].id),
                    name: pets[0].name,
                    high: pets[0].high,
                    petTypeId: null,
                    petBreedId: 0
                }
            }
        },
        updatePetFn: jest.fn(() => ({
            data: {
              updatePet: {
                  id: pets[0].id,
                  name: pets[0].name
              }
            },
          })),
    }
];