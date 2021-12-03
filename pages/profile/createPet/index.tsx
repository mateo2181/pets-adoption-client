import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import client from 'apollo/client';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Container, GridItem, Heading, SimpleGrid, Stack, VStack } from '@chakra-ui/layout';
import { CREATE_PET, GET_PETS_TYPE } from 'apollo/queries';
import { getSession } from 'next-auth/client';
import { IPetBreed, IPetType, PetTypeData } from 'types';
import { Select } from '@chakra-ui/select';
import { Button } from '@chakra-ui/button';
import { useForm } from 'react-hook-form';
import NextLink from 'next/link';

interface Props {
    session: any
}

export default function CreatePet({session}: Props) {
    
    const { handleSubmit, register, reset, formState: { errors, isSubmitting }} = useForm();
    const [petType, setPetType] = useState<IPetType | null>(null);
    const [createPet, { data, loading, error }] = useMutation(CREATE_PET);
    const { loading: loadingPetsType, error: errorPetsType, data: dataPetsType } = useQuery<PetTypeData>(GET_PETS_TYPE);

    useEffect(() => {
        if(dataPetsType?.petsType.length) {
            setPetType(() => dataPetsType?.petsType[0]);
        }
    }, [dataPetsType]);
    
    function onSubmit(values: any) {
        createPet({
            variables: {
                input: { 
                    name: values.name,
                    high: values.high,
                    petTypeId: Number(values.type),
                    petBreedId: Number(values.breed)
                }
            }
        }).then(() => reset());
    }

    function changePetType(event: any) {
        console.log(event.target.value);
        const petTypeSelected = dataPetsType?.petsType.find(pt => pt.id == event.target.value);
        if(petTypeSelected) {
            setPetType(petTypeSelected);
        } 
    }

    if(loadingPetsType) return <div>Loading...</div>;
    return (
        <Container maxW="container.md">
            <VStack w="100" p={10} spacing={8} alignItems="flex-start">
                <Heading as='h2' size='2xl'> Create Pet </Heading>
                <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
                    <SimpleGrid columns={2} columnGap={4} rowGap={6} w="full">
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={errors.name}>
                                <FormLabel htmlFor='name'>Name</FormLabel>
                                <Input id='name' placeholder='Name'
                                    {...register('name',
                                        { required: 'This is required', minLength: { value: 4, message: 'Minimum length should be 4' }}
                                    )} />
                                <FormErrorMessage> {errors.name && errors.name.message} </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={errors.high}>
                                <FormLabel htmlFor='high'>High (cm)</FormLabel>
                                <Input id='high' placeholder='High' type="number"
                                    {...register('high', { required: 'This is required', min: 1, max: 400 })} />
                                <FormErrorMessage> {errors.high && errors.high.message} </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel htmlFor='type'>Pet Type</FormLabel>
                                <Select id='type' {...register('type', { required: 'This is required' })} onChange={changePetType}>
                                    {dataPetsType && dataPetsType?.petsType.map((type: IPetType) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel htmlFor='breed'>Breed</FormLabel>
                                <Select id='breed' {...register('breed', { required: 'This is required' })}>
                                    {petType?.breeds && petType?.breeds.map((breed: IPetBreed) => (
                                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Stack flexDirection="row" gridGap={4}>
                                <Button colorScheme="blue" isLoading={isSubmitting} type="submit" w="full">Save Pet</Button>
                                <NextLink href='/profile'>
                                    <Button type="button" style={{margin: 0}} w="full">Back to Profile</Button>
                                </NextLink>
                            </Stack>
                        </GridItem>
                    </SimpleGrid>
                </form>
            </VStack>
        </Container>
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