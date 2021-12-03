import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.scss';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Navbar() {
    
    const [session, loading] = useSession();

    return (
        <header className={styles.header}>
            <nav className={styles.nav} role="navigation">
            <Link href="/" passHref><h1>PETS</h1></Link>
                <div>
                    <ul>
                        <li><a href="/search">Find a Pet</a></li>
                        <li><a href="/about">About Us</a></li>
                    </ul>
                    <ul className={styles.auth}>
                        { !session ? <>
                                        <li><button onClick={() => signIn()}>Sign Up</button></li>
                                        <li><button onClick={() => signIn()}>Log In</button></li>
                                    </>
                                    :
                                    <>
                                        <div className={styles.username}>{session.user?.name || session.user?.email }</div>
                                        <li><a href="/profile">Profile</a></li>
                                        {/* <li><button onClick={() => signOut()}>Sign Out</button></li> */}
                                    </>
                        }
                    </ul>
                </div>
            </nav>
        </header>
    );
}
