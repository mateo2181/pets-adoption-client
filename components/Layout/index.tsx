import React, { ReactElement } from 'react';
import Image from 'next/image';
import Navbar from '../Navbar';
import styles from './Layout.module.scss';
import { Container } from '@chakra-ui/layout';

interface Props {
    children: ReactElement
}

export default function Layout({children}: Props) {
    return (
        <>
            <Navbar />

            <main className={styles.main} role="main">{children}</main>
            
            <footer className={styles.footer}>
                Powered by{' '}
                <span className={styles.logo}>
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                </span>
            </footer>
        </>
    );
}
