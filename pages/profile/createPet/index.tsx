import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Container, GridItem, Heading, SimpleGrid, Stack, VStack } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { Button } from '@chakra-ui/button';
import { useBreakpointValue } from '@chakra-ui/media-query';
import { CREATE_PET, GET_PETS_TYPE } from 'apollo/queries';
import { IPetBreed, IPetType, PetTypeData } from 'types';
import { useForm } from 'react-hook-form';
import { getSession } from 'next-auth/client';
import NextLink from 'next/link';
import SearchBox, { OnPlaceChangeProps } from 'components/UI/SearchBox';
import { librariesGoogleMapsApi } from 'utils';

interface Props {
    session: any
}

export default function CreatePet({session}: Props) {
    
    const colSpan = useBreakpointValue({ base: 2, md: 1 });

    const { handleSubmit, register, reset, setValue, formState: { errors, isSubmitting }} = useForm();
    const [petType, setPetType] = useState<IPetType | null>(null);
    const [createPet, { data, loading, error }] = useMutation(CREATE_PET);
    const { loading: loadingPetsType, error: errorPetsType, data: dataPetsType } = useQuery<PetTypeData>(GET_PETS_TYPE);

    useEffect(() => {
        if(dataPetsType?.petsType.length) {
            setPetType(() => dataPetsType?.petsType[0]);
        }
    }, [dataPetsType]);
    
    function onSubmit(values: any) {
        console.log(values);
        createPet({
            variables: {
                input: { 
                    name: values.name,
                    high: values.high,
                    petTypeId: Number(values.type),
                    petBreedId: Number(values.breed),
                    latitude: values.latitude,
                    longitude: values.longitude,
                    address: values.address
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

    function changeLocation({address, latitude, longitude}: OnPlaceChangeProps) {
        console.log({latitude, longitude});
        setValue('latitude', latitude);
        setValue('longitude', longitude);
        setValue('address', address);
    }

    if(loadingPetsType) return <div>Loading...</div>;
    return (
        <Container maxW="container.md">
            <VStack w="100" p={[4, 6, 8, 10]} spacing={8} alignItems="flex-start">
                <Heading as='h2' size='2xl'> Create Pet </Heading>
                <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
                    <SimpleGrid columns={2} columnGap={4} rowGap={6} w="full">
                        <GridItem colSpan={colSpan}>
                            <FormControl isInvalid={errors.name}>
                                <FormLabel htmlFor='name'>Name</FormLabel>
                                <Input id='name' placeholder='Name'
                                    {...register('name',
                                        { required: 'This is required', minLength: { value: 2, message: 'Minimum length should be 4' }}
                                    )} />
                                <FormErrorMessage> {errors.name && errors.name.message} </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={colSpan}>
                            <FormControl isInvalid={errors.high}>
                                <FormLabel htmlFor='high'>High (cm)</FormLabel>
                                <Input id='high' placeholder='High' type="number"
                                    {...register('high', { required: 'This is required', min: 1, max: 400 })} />
                                <FormErrorMessage> {errors.high && errors.high.message} </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={colSpan}>
                            <FormControl>
                                <FormLabel htmlFor='type'>Pet Type</FormLabel>
                                <Select id='type' {...register('type', { required: 'This is required' })} onChange={changePetType}>
                                    {dataPetsType && dataPetsType?.petsType.map((type: IPetType) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={colSpan}>
                            <FormControl>
                                <FormLabel htmlFor='breed'>Breed</FormLabel>
                                <Select id='breed' {...register('breed', { required: 'This is required' })}>
                                    {petType?.breeds && petType?.breeds.map((breed: IPetBreed) => (
                                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        <input style={{display: 'none'}} type="text" {...register('latitude', { required: 'This is required' })} />
                        <input style={{display: 'none'}} type="text" {...register('longitude', { required: 'This is required' })} />
                        <GridItem>
                            <FormControl>
                                <FormLabel htmlFor='address'>Address</FormLabel>
                                <SearchBox placeholder='Type your address'
                                           onPlaceChanged={changeLocation}
                                           id='address'
                                           name='address'
                                           librariesGoogleApi={librariesGoogleMapsApi} />
                            </FormControl>
                        </GridItem>
                    </SimpleGrid>
                    <Stack mt={10} flexDirection="row" width='auto' justifyContent='flex-end' gridGap={4}>
                        <Button colorScheme="blue" size='lg' isLoading={isSubmitting} type="submit">Save Pet</Button>
                        <NextLink href='/profile'>
                            <Button type="button" size='lg' variant='ghost' style={{margin: 0}}>Back to Profile</Button>
                        </NextLink>
                    </Stack>
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