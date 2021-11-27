import React from 'react';
import Image from 'next/image';
import { HiSearch } from "react-icons/hi";
import styles from './MainSearch.module.scss';

interface Props {
    extStyles: Object
}

export default function MainSearch() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.location}>
                    <HiSearch className={styles.searchIcon} />
                    <input type="text" placeholder="Enter your location"/>
                </div>
                <button>
                    <Image src="/dog-icon-sec.png" width={40} height={40} alt="Dog Icon" /> 
                    <span>Find a dog</span>
                </button>
                <button>
                    <Image className={styles.imgCat} src="/cat-icon-sec.png" width={40} height={40} alt="Cat Icon" /> 
                    <span>Find a cat</span>
                </button>
                <button><span>Find other pets</span></button>            
            </div>
        </div>
    )
}
