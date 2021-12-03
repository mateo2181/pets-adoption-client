import { useQuery } from '@apollo/client';
import { Container, Heading, HStack, Link, LinkOverlay, Stack, Text, VStack } from '@chakra-ui/layout';
import { GET_MY_PETS, GET_PETS_TYPE } from 'apollo/queries';
import { getSession, signOut } from 'next-auth/client';
import React, { useEffect } from 'react';
import { PetListProps, PetTypeData } from 'types';
import NextLink from 'next/link';
import { Button } from '@chakra-ui/button';
import { createApolloClient } from 'apollo/client';
import Pet from 'components/Pet';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { AddIcon } from '@chakra-ui/icons';

interface Props extends PetListProps {
    session: any
}

export default function Profile({session, pets}: Props) {

    const router = useRouter();

    return (
        <>
        <Head>
            <title>Pet Adoption Detail | My Profile </title>
        </Head>
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} alignItems="flex-start" mb={8}>
                <HStack justifyContent="space-between" w="full">
                    <Heading as='h2' size='2xl'> My Pets </Heading>
                    <NextLink href='/profile/createPet'>
                        <Button leftIcon={<AddIcon/>} colorScheme='blue'> Create Pet </Button>
                    </NextLink>
                </HStack>
                <HStack  spacing={6}>
                {pets.map(pet => <Pet onClick={() => router.push(`profile/pets/${pet.id}`)}
                                        widthCard={220}
                                        name={pet.name}
                                        defaultImage={pet.pictureDefault?.path || ''}
                                        breed={pet.breed?.name || ''}
                                        key={pet.id}
                                        id={pet.id} />)}
                </HStack>
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