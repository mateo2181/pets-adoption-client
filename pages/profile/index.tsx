import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Grid, Heading, HStack, Link, LinkOverlay, SimpleGrid, Stack, Text, VStack } from '@chakra-ui/layout';
import { GET_MY_PETS, GET_PETS_TYPE } from 'apollo/queries';
import { getSession, signOut } from 'next-auth/client';
import { PetListProps, PetTypeData } from 'types';
import NextLink from 'next/link';
import { Button } from '@chakra-ui/button';
import { createApolloClient } from 'apollo/client';
import Pet from 'components/Pet';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { AddIcon } from '@chakra-ui/icons';
import { useBreakpointValue, useMediaQuery } from '@chakra-ui/media-query';

interface Props extends PetListProps {
    session: any
}

export default function Profile({session, pets}: Props) {

    const [width, setWidth] = useState(0);
    const widthImagePet = useBreakpointValue({ base: width, sm: 240 });
    const router = useRouter();
    const ref = useRef() as MutableRefObject<HTMLDivElement>;

    const getWidthPetList = () => {
        if(ref.current) {
            const newWidth = ref.current.clientWidth;
            setWidth(newWidth);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', getWidthPetList);
        return () => {
            window.removeEventListener('resize', getWidthPetList);
        };
    }, []);
    
    return (
        <>
        <Head>
            <title>Pet Adoption Detail | My Profile </title>
        </Head>
        <Container maxW="container.xl" py={8}>
            <VStack p={[4, 6, 8, 10]} spacing={8} alignItems="flex-start" mb={8}>
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent={{base: 'flex-start', sm: 'space-between'}} w={['auto','full']}>
                    <Heading as='h2' size='2xl'> My Pets </Heading>
                    <NextLink href='/profile/createPet'>
                        <Button leftIcon={<AddIcon/>} colorScheme='blue'> Create Pet </Button>
                    </NextLink>
                </Stack>
                <Grid ref={ref} templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(auto-fit, minmax(190px, 220px))'}} gap={6} w='full'>
                {pets.map(pet => <Pet onClick={() => router.push(`profile/pets/${pet.id}`)}
                                        widthCard={widthImagePet || 100}
                                        name={pet.name}
                                        defaultImage={pet.pictureDefault?.path || ''}
                                        breed={pet.breed?.name || ''}
                                        key={pet.id}
                                        id={pet.id} />)}
                </Grid>
            </VStack>
            {/* <VStack spacing={4} alignItems={'flex-start'}>
                <Text fontSize='xl'> Username: {session.user.name || session.user?.email }</Text>
            </VStack> */}
        </Container>
        </>
    );
}

export async function getServerSideProps({req}: {req: any}) {
    try {
        const session = await getSession({req});
        if(!session) {
            return {
                redirect: {
                destination: '/',
                permanent: false,
                },
            };
        }

        const client = createApolloClient(session.token as string || '');
        const { data } = await client.query({query: GET_MY_PETS, variables: {limit: 10}});

        return {
            props: {
                session,
                pets: data.myPets
            }
        };
    } catch (error) {
        console.log({'ERROR SERVER SIDE': error});
        return {
                redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    
} 