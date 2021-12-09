import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Pet.module.scss';
import { CustomImage } from 'components/UI/CustomImage';
import { Box } from '@chakra-ui/layout';

interface Props {
    id: string;
    name: string;
    breed: string;
    defaultImage: string;
    widthCard: number;
    onClick: any;
}

export default function Pet({id, name, breed, defaultImage, widthCard = 240, onClick}: Props) {
    return (
        // <Button href={`/pets/${id}`} passHref>
            <button onClick={onClick} className={styles.Card}>
                {/* <Image height={widthCard} width={widthCard} src={defaultImage} alt={name} objectFit={'cover'}/> */}
                <Box position='relative'>
                    <CustomImage width={widthCard} height={widthCard} src={defaultImage || ''} alt={name} borderRadius={6}/>
                </Box>
                <div className={styles.Info}>
                    <h2>{name}</h2>
                    <div className={styles.Breed}>{breed}</div>
                </div>
            </button>
        // </Link>
    );
}
