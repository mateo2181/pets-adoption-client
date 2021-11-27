import { gql } from '@apollo/client';

export const GET_PETS = gql`
query getPets($limit: Float, $petTypeId: Float) {
  pets(filters: {petTypeId: $petTypeId, limit: $limit}) {
    id
    name
    status
    pictureDefault {
      path 
    }
    breed {
      name
    }
    creator {
      name
      email
    }
  }
}
`;

export const GET_PET_BY_ID = gql`
query getPet($id: Float!) {
    pet(id: $id) {
      id
      name
      status
      pictures {
        id
        path
      }
      breed {
        name
      }
      creator {
        name
        email
      }
    }
}
`;