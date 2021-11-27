import React from 'react';
import { IPet, PetListProps } from '../../types';
import Pet from '../Pet';
import styles from './PetList.module.scss';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

export default function PetList({ pets }: PetListProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <h2>Find your Pets</h2>
                    <a href="/search"> See More <HiOutlineArrowNarrowRight style={{height: 27}}/> </a>
                </div>
                <div id="highlightPetList" className={styles.list}>
                {pets.map(pet => <Pet name={pet.name}
                                      defaultImage={pet.pictureDefault?.path || ''}
                                      breed={pet.breed?.name || ''}
                                      key={pet.id}
                                      id={pet.id} />)}
                </div>
            </div>
        </div>
    );
}
