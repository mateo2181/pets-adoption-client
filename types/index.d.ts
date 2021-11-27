interface IUser {
    id?: string; 
    name?: string;
    email?: string;
}

interface PetPicture {
    id?: string;
    path?: string;
    url?: string;
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
    pictureDefault?: PetPicture;
    pictures?: Array<PetPicture>;
    breed?: IPetBreed;
    creator?: IUser;
    owner?: IUser;
}

interface PetListProps {
    pets: Array<IPet>
}

export {
    IPet,
    PetListProps,
    PetPicture
};