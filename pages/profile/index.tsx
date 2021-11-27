import { GetServerSidePropsContext } from 'next';
import { getSession, signOut } from 'next-auth/client';
import React from 'react';

interface Props {
    session: any
}

export default function Profile({session}: Props) {
    return (
        <div>
            <div>{session.user.name}</div>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    );
}

export async function getServerSideProps({req}: {req: any}) {
    const session = await getSession({req});
    console.log(session);

    if(!session) {
        return {
            redirect: {
              destination: '/',
              permanent: false,
            },
        };
    }

    return {
        props: {
            session
        }
    };
} 