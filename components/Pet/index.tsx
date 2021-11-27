import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Pet.module.scss';

interface Props {
    id: string;
    name: string;
    breed: string;
    defaultImage: string;
}

export default function Pet({id, name, breed, defaultImage}: Props) {
    return (
        <Link href={`/pets/${id}`} passHref>
            <div className={styles.Card}>
                <Image height={300} width={300} src={defaultImage} alt={name} objectFit={'cover'}/>
                <div className={styles.Info}>
                    <h2>{name}</h2>
                    <div className={styles.Breed}>{breed}</div>
                </div>
            </div>
        </Link>
    );
}
