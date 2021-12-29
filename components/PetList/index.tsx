import React from 'react';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { Heading, Link } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import { IPet, PetListProps } from '../../types';
import Pet from '../Pet';
import { CustomImage } from 'components/UI';
import { getAddressWithoutCountry } from 'utils/helpers';
import styles from './PetList.module.scss';

export default function PetList({ pets }: PetListProps) {
    
    const router = useRouter();

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <Heading as='h2' flexGrow={1} fontSize={['24px', '40px']}>Find your Pets</Heading>
                    <Link href="/search" fontSize={['16px', '20px']}> See More <HiOutlineArrowNarrowRight style={{height: 27}}/> </Link>
                </div>
                <div id="highlightPetList" className={styles.list}>
                {pets.map(pet => <Pet onClick={() => router.push(`pets/${pet.id}`)} key={pet.id}>
                                        <Pet.Image>
                                            <CustomImage width={240} height={240} src={pet.pictureDefault?.path || ''} alt={pet.name} />
                                        </Pet.Image>
                                        <Pet.Info>
                                            <Pet.Title>{pet.name}</Pet.Title>
                                            <Pet.Breed>{pet.breed?.name}</Pet.Breed>
                                            <Pet.Location>{getAddressWithoutCountry(pet.address)}</Pet.Location>
                                        </Pet.Info>          
                                 </Pet>)}
                </div>
            </div>
        </div>
    );
}
