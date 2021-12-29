import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import styles from './PetDetail.module.scss';
import client from '../../apollo/client';
import { GET_PETS, GET_PET_BY_ID } from '../../apollo/queries';
import { IPet, PetPicture } from '../../types';
import { AspectRatio, Box, Container, Stack } from '@chakra-ui/react';

interface Props {
    pet: IPet
}

interface Params extends ParsedUrlQuery {
    id: string
 }

export default function PetDetail({pet}: Props) {

    const [currentImage, setCurrentImage] = useState<PetPicture | null>(null);

    useEffect(() => {
        setCurrentImage(pet.pictures?.length ? pet.pictures[0]: null);
    }, [pet.pictures]);

    // function getDefaultImage() {
    //     setCurrentImage()
    // }

    if(!pet) {
        return <h1>Pet Not Found</h1>;
    }

    return (
        <>
        <Head>
            <title>Pet Adoption Detail | {pet.name}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.wrapper}>
            <Container maxW="container.lg" py={6}>
                {currentImage &&
                    <Stack direction={['column','column','row']} spacing='16px'>
                        <AspectRatio borderRadius={12} flexGrow={1} maxW='775px' ratio={4 / 3} className={styles.imageMain}>
                            <Image layout="fill" src={currentImage?.path || ''} alt={pet.name} objectFit="cover" />
                        </AspectRatio>
                        <Stack flexShrink={0} overflowX={['scroll','scroll','auto']} w={['100%','100%','200px']} direction={['row','row','column']} spacing='16px' className={styles.imagesList}>
                            { pet.pictures?.length &&  pet.pictures.map((picture, i) => (
                                <Box w={['140px','200px']} borderRadius={12} role="button" tabIndex={i} key={picture.id} onClick={() => setCurrentImage(picture)} onKeyDown={() => setCurrentImage(picture)}>
                                    <AspectRatio minW={140} ratio={1}>
                                        <Image layout="fill" src={picture.path || ''} alt={pet.name} objectFit="cover" />
                                    </AspectRatio>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                }
                <div className={styles.info}>
                    <h1>{pet.name}</h1>
                    <div className={styles.breed}>{pet.breed?.name}</div>
                    <div className="hr" style={{margin: '16px 0 20px'}}></div>
                    {/* About */}
                    <h2>About</h2>
                    <p className={'opac'}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, facilis repellat,
                       voluptatibus porro temporibus fugiat quaerat error aperiam magnam iste distinctio ducimus reprehenderit!
                       Natus vel optio voluptatibus corrupti nobis assumenda!</p>
                </div>
                
            </Container>
        </div>
        </>
    );
}

export const getStaticProps: GetStaticProps = async(context: GetStaticPropsContext) => {
    const params = context.params as Params;
    const { data, error } = await client.query({query: GET_PET_BY_ID, variables: {id: Number(params.id)}}); 
    return {
        props: {
            pet: data.pet
        }
    };
};

export const getStaticPaths: GetStaticPaths = async() => {
    const { data } = await client.query({query: GET_PETS, variables: {limit: 5}});

    const paths = data.pets.map((pet: IPet) => ({
        params: { id: pet.id }
    }));

    return {
        paths,
        fallback: false
    };
};