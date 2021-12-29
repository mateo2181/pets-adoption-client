import React, { useState } from 'react';
import Image from 'next/image';
import { HiSearch } from 'react-icons/hi';
import styles from './MainSearch.module.scss';
import SearchBox, { OnPlaceChangeProps } from 'components/UI/SearchBox';
import { librariesGoogleMapsApi, PETS_TYPES } from 'utils';
import { useRouter } from 'next/router';
import { LocationType } from 'types';

interface Props {
    extStyles: Object
}

export default function MainSearch() {

    const router = useRouter();

    const [location, setLocation] = useState<LocationType>({latitude: null, longitude: null, address: null});

    function changeLocation({address, latitude, longitude}: OnPlaceChangeProps) {
        setLocation(() => ({address, latitude, longitude}));
    }

    function search(petType: number | string) {
        router.push({
            pathname: '/search',
            query: {
                latitude: location.latitude,
                longitude: location.longitude,
                address: location.address,
                petTypeId: petType
            }
        });
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.location}>
                    <HiSearch className={styles.searchIcon} />
                    <SearchBox placeholder='Enter a location'
                               librariesGoogleApi={librariesGoogleMapsApi}
                               onPlaceChanged={changeLocation} />
                </div>
                <div className={styles.buttons}>
                    <button onClick={() => search(PETS_TYPES.dog)}>
                        <Image src="/dog-icon-sec.png" width={40} height={40} alt="Dog Icon" /> 
                        <span>Find a dog</span>
                    </button>
                    <button onClick={() => search(PETS_TYPES.cat)}>
                        <Image className={styles.imgCat} src="/cat-icon-sec.png" width={40} height={40} alt="Cat Icon" /> 
                        <span>Find a cat</span>
                    </button>
                    <button onClick={() => search('')}><span>Find other pets</span></button>            
                </div>
            </div>
        </div>
    );
}
