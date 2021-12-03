import { GET_PETS } from '../apollo/queries';
import { pets } from './pets';


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
];