import React, { ReactNode } from 'react';
import styles from './Pet.module.scss';
import { Box } from '@chakra-ui/layout';
import { IoLocationSharp } from 'react-icons/io5';

interface Props {
    children: ReactNode;
}

// interface Props {
//     id: string;
//     name: string;
//     breed: string;
//     defaultImage: string;
//     widthCard: number;
//     onClick: any;
// }

export default function Pet({children, ...rest}: Props & {onClick: () => void}) {
    return (
        // <Button href={`/pets/${id}`} passHref>
            <button className={styles.Card} {...rest}>
                {/* <Image height={widthCard} width={widthCard} src={defaultImage} alt={name} objectFit={'cover'}/> */}
                {children}
            </button>
        // </Link>
    );
}

Pet.Image = function PetImage({children, ...rest}: Props) {
    return(
        <Box position='relative'>
            {children}
            {/* <CustomImage width={widthCard} height={widthCard} src={defaultImage || ''} alt={name} borderRadius={6}/> */}
        </Box>
    );
};

Pet.Info = function PetInfo({children, ...rest}: Props) {
    return (
        <div className={styles.Info}>
            {children}
        </div>
    );
};

Pet.Title = function PetTitle({children, ...rest}: Props) {
    return (
        <h1 className={styles.H1} {...rest}>{children}</h1>
    );
};

Pet.Breed = function PetBreed({children, ...rest}: Props) {
    return (
        <div className={styles.Breed} {...rest}>{children}</div>
    );
};

Pet.Location = function PetLocation({children, ...rest}: Props) {
    return (
        <div className={styles.Location} {...rest}><IoLocationSharp style={{fontSize: 18}}/> {children}</div>
    );
};

Pet.ExtraContent = function ExtraContent({children, ...rest}: Props) {
    return (
        <div className={styles.ExtraContent} {...rest}>{children}</div>
    );
};