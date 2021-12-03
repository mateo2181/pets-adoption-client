interface IUser {
    id?: string; 
    name?: string;
    email?: string;
}

interface PetPicture {
    id?: string;
    path?: string;
}

interface IPetBreed {
    id?: string | number;
    name?: string;
    pets?: Array<IPet>;
}

interface IPetType {
    id: string | number;
    name?: string;
    breeds?: Array<IPetBreed>;
}

interface IPet {
    id: string;
    name: string;
    high: string;
    pictureDefault?: PetPicture;
    pictures?: Array<PetPicture>;
    breed?: IPetBreed;
    type?: IPetType;
    creator?: IUser;
    owner?: IUser;
}

interface PetListProps {
    pets: Array<IPet>
}

interface PetTypeData {
    petsType: IPetType[];
}

export {
    IPet,
    PetListProps,
    PetPicture,
    IPetBreed,
    IPetType,
    PetTypeData
};