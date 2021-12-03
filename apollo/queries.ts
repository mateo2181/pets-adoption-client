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

export const GET_MY_PETS = gql`
query myPets($limit: Float!) {
  myPets(filters:{ limit: $limit }) {
    id
    name
    pictureDefault {
      path
    }
    breed {
      name
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
      high
      pictures {
        id
        path
      }
      breed {
        id
        name
      }
      type {
        id
        name
      }
      creator {
        name
        email
      }
    }
}
`;

export const GET_PETS_TYPE = gql`
query petsType {
  petsType {
    id
    name
    breeds {
      id
      name
    }
  }
}
`;

export const CREATE_PET = gql`
mutation createPet($input: PetInput!) {
  createPet(variables: $input) {
    id
    name
  }
}
`;

export const UPDATE_PET = gql`
mutation updatePet($input: PetEditInput!) {
  updatePet(variables: $input) {
    id
    name
  }
}
`;

export const PET_SINGLE_UPLOAD_PICTURE = gql`
mutation addAvatar($file: Upload!, $id: ID!) {
  addAvatar(file: $file,petId: $id) { 
    id,
    path
  }
}
`;

export const PET_SINGLE_REMOVE_PICTURE = gql`
mutation removevatar($petId: ID!, $petPictureId: ID!) {
  removeAvatar(petId: $petId, petPictureId: $petPictureId) { 
    id
  }
}
`;