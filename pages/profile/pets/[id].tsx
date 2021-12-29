import React, { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { IPet, IPetBreed, IPetType, PetPicture, PetTypeData } from 'types';
import { GET_PETS_TYPE, GET_PET_BY_ID, PET_SINGLE_REMOVE_PICTURE, PET_SINGLE_UPLOAD_PICTURE, UPDATE_PET } from 'apollo/queries';
import client from 'apollo/client';
import { Container, Flex, GridItem, Heading, HStack, SimpleGrid, Stack, VStack } from '@chakra-ui/layout';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { ViewIcon } from '@chakra-ui/icons';
import { Input, Select, Button, useBreakpointValue } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import NextLink from 'next/link';
import ListPetImages from 'components/Forms/ListPetImages';
import SearchBox, { OnPlaceChangeProps } from 'components/UI/SearchBox';
import { librariesGoogleMapsApi } from 'utils';

interface Props {
    pet: IPet
}

interface Params extends ParsedUrlQuery {
    id: string
}

export default function EditPet({pet}: Props) {

    const colSpan = useBreakpointValue({ base: 2, md: 1 });

    const { handleSubmit, register, reset, setValue, formState: { errors, isSubmitting }} = useForm();
    
    const [petType, setPetType] = useState<IPetType | null>(null);
    
    const [updatePet, { data, loading, error }] = useMutation(UPDATE_PET);
    const { loading: loadingPetsType, error: errorPetsType, data: dataPetsType } = useQuery<PetTypeData>(GET_PETS_TYPE);

    function onSubmit(values: any) {
        console.log({errors});
        updatePet({
            variables: {
                input: { 
                    id: Number(pet.id),
                    name: values.name,
                    high: values.high,
                    petTypeId: Number(pet.type?.id),
                    petBreedId: Number(values.breed),
                    latitude: values.latitude,
                    longitude: values.longitude,
                    address: values.address
                }
            }
        }).then(() => {});
    }

    useEffect(() => {
        setValue('latitude', pet.latitude);
        setValue('longitude', pet.longitude);
        setValue('address', pet.address);
    }, [setValue, pet]);

    const changePetType = useCallback((value: any) => {
        const petTypeSelected = dataPetsType?.petsType.find(pt => pt.id == value);
        if(petTypeSelected) {
            setPetType(petTypeSelected);
        }
    }, [dataPetsType?.petsType]);

    useEffect(() => {
        if(dataPetsType?.petsType.length) {
            changePetType(pet.type?.id);
        }
    }, [dataPetsType, changePetType, pet.type?.id]);

    useEffect(() => {
        setValue('breed', pet.breed?.id, { shouldValidate: true });
    }, [petType, setValue, pet.breed?.id]);

    function changeLocation({address, latitude, longitude}: OnPlaceChangeProps) {
        console.log({latitude, longitude});
        setValue('latitude', latitude);
        setValue('longitude', longitude);
        setValue('address', address);
    }

    return (
        <>
        <Head>
            <title>Profile | Pet Edit</title>
        </Head>
        <Container maxW="container.md">
            <VStack w="100" p={[4, 6, 8, 10]} spacing={8} alignItems="flex-start">
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent={{base: 'flex-start', sm: 'space-between'}} w={['auto','full']}>
                    <Heading as='h2' size='2xl'> Edit Pet </Heading>
                    <NextLink href={`/pets/${pet.id}`}>
                        <Button leftIcon={<ViewIcon />} colorScheme='blue'> Public profile </Button>
                    </NextLink>
                </Stack>
                <Tabs isFitted style={{width: '100%'}}>
                    <TabList>
                        <Tab _selected={{ fontWeight: 700, borderBottomColor: 'blue.500', boxShadow: 'none' }}>Basic</Tab>
                        <Tab _selected={{ fontWeight: 700, borderBottomColor: 'blue.500', boxShadow: 'none' }}>Pictures</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
                                <SimpleGrid columns={2} columnGap={4} rowGap={6} w="full">
                                    <GridItem colSpan={colSpan}>
                                        <FormControl isInvalid={errors.name}>
                                            <FormLabel htmlFor='name'>Name</FormLabel>
                                            <Input id='name' data-testid="input-name" placeholder='Name' defaultValue={pet.name}
                                                {...register('name',
                                                    { required: 'This is required', minLength: { value: 2, message: 'Minimum length should be 4' }}
                                                )} />
                                            <FormErrorMessage role="alert"> {errors.name && errors.name.message} </FormErrorMessage>
                                        </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={colSpan}>
                                        <FormControl isInvalid={errors.high}>
                                            <FormLabel htmlFor='high'>High (cm)</FormLabel>
                                            <Input id='high' placeholder='High' type="number" defaultValue={pet.high}
                                                {...register('high', { required: 'This is required', min: 1, max: 400 })} />
                                            <FormErrorMessage> {errors.high && errors.high.message} </FormErrorMessage>
                                        </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={colSpan}>
                                        <FormControl>
                                            <FormLabel htmlFor='type'>Pet Type</FormLabel>
                                            <Select id='type' {...register('type')} disabled={true}>
                                                {dataPetsType && dataPetsType?.petsType.map((type: IPetType) => (
                                                    <option key={type.id} value={type.id}>{type.name}</option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={colSpan}>
                                        <FormControl>
                                            <FormLabel htmlFor='breed'>Breed</FormLabel>
                                            <Select id='breed' {...register('breed', { required: 'This is required' }) }>
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
                                            <FormLabel htmlFor='address'> Address </FormLabel>
                                            <SearchBox placeholder='Type your address'
                                                    onPlaceChanged={changeLocation}
                                                    id='address'
                                                    name='address'
                                                    defaultValue={pet.address}
                                                    librariesGoogleApi={librariesGoogleMapsApi} />
                                        </FormControl>
                                    </GridItem>
                                </SimpleGrid>
                                <Stack mt={10} flexDirection="row" width='auto' justifyContent='flex-end' gridGap={4}>
                                    <Button colorScheme="blue" size='lg' isLoading={isSubmitting} type="submit" w="150px">Update Pet</Button>
                                    <NextLink href='/profile'>
                                        <Button type="button" size='lg' variant='ghost' style={{margin: 0}} w="150px">Back to Profile</Button>
                                    </NextLink>
                                </Stack>
                            </form>
                        </TabPanel>
                        <TabPanel>
                            <ListPetImages picturesProp={pet.pictures || []} petId={pet.id} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async(context: GetServerSidePropsContext) => {
    const params = context.params as Params;
    const req = context.req as any;
    const { data, error } = await client.query({query: GET_PET_BY_ID, variables: {id: Number(params.id)}}); 
    const session = await getSession({req});
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
            pet: data.pet
        }
    };
};