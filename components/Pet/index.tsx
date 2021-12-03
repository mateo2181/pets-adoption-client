import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Pet.module.scss';

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
            <button onClick={onClick} className={styles.Card} style={{width: widthCard}}>
                <Image height={widthCard} width={widthCard} src={defaultImage} alt={name} objectFit={'cover'}/>
                <div className={styles.Info}>
                    <h2>{name}</h2>
                    <div className={styles.Breed}>{breed}</div>
                </div>
            </button>
        // </Link>
    );
}
