import React from 'react';
import Image from 'next/image';
import styles from './Banner.module.scss';

export default function Banner() {
    return (
        <div className={styles.banner}>
            <h1>Find the Perfect <br></br> Pet for You</h1> 
            <Image className={styles.img} src="/banner.png" alt="Pets Banner" width={740} height={340} />
        </div>
    );
}
