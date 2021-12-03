import React, { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { IPet, IPetBreed, IPetType, PetPicture, PetTypeData } from 'types';
import { GET_PETS_TYPE, GET_PET_BY_ID, PET_SINGLE_REMOVE_PICTURE, PET_SINGLE_UPLOAD_PICTURE, UPDATE_PET } from 'apollo/queries';
import client from 'apollo/client';
import { Container, Flex, GridItem, Heading, HStack, SimpleGrid, Stack, VStack } from '@chakra-ui/layout';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { Select } from '@chakra-ui/select';
import { Button } from '@chakra-ui/button';
import NextLink from 'next/link';
import ImageUploader from 'components/ImageUploader';
import PetImageForm from 'components/Forms/PetImage';
import { ViewIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

interface Props {
    pet: IPet
}

interface Params extends ParsedUrlQuery {
    id: string
}

export default function EditPet({pet}: Props) {

    const { handleSubmit, register, reset, setValue, formState: { errors, isSubmitting }} = useForm();
    
    const [pictures, setPictures] = useState<Array<PetPicture>>([]);
    const [petType, setPetType] = useState<IPetType | null>(null);
    
    const [updatePet, { data, loading, error }] = useMutation(UPDATE_PET);
    const [removePetPicture, { loading: loadingRemovePicture, error: errorRemovePicture }] = useMutation(PET_SINGLE_REMOVE_PICTURE);
    const [uploadPicture, { loading: loadingUploadPicture, error: errorUploadPicture }] = useMutation(PET_SINGLE_UPLOAD_PICTURE);

    const { loading: loadingPetsType, error: errorPetsType, data: dataPetsType } = useQuery<PetTypeData>(GET_PETS_TYPE);
    
    useEffect(() => {
        setPictures(() => pet.pictures || []);
    }, [pet.pictures]);

    const addPicture = useCallback(
        ({target: { validity, files: [file]}}: any) => {
        if(!validity.valid) {
            return;
        }
        uploadPicture({ variables: { file, id: pet.id }})
        .then((res: any) => {
            setPictures(pictures => pictures.concat(res.data.addAvatar));
        });
    }, [setPictures, uploadPicture, pet.id]);
    

    const removePicture = useCallback(
        (petPictureId: number) => {
            removePetPicture({variables: { petId: pet.id, petPictureId }})
            .then(() => {
                setPictures(pictures => pictures.filter(p => Number(p.id) !== petPictureId));
            });
        },
        [setPictures, removePetPicture, pet.id]);

    function onSubmit(values: any) {
        console.log({errors});
        updatePet({
            variables: {
                input: { 
                    id: Number(pet.id),
                    name: values.name,
                    high: values.high,
                    petTypeId: Number(pet.type?.id),
                    petBreedId: Number(values.breed)
                }
            }
        }).then(() => {});
    }

    const changePetType = useCallback((value: any) => {
        const petTypeSelected = dataPetsType?.petsType.find(pt => pt.id == value);
        console.log({petTypeSelected});
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
        console.log(pet.breed?.id);
        setValue('breed', pet.breed?.id, { shouldValidate: true });
    }, [petType, setValue, pet.breed?.id]);

    const BoxFM = motion(Flex);
    const container = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3
          }
        }
      };
      
      const item = {
        hidden: { opacity: 0, scaleY: 0 },
        show: { opacity: 1, scaleY: 1 }
      };

      

    return (
        <>
        <Head>
            <title>Profile | Pet Edit</title>
        </Head>
        <Container maxW="container.md">
            <VStack w="100" p={10} spacing={8} alignItems="flex-start">
                <HStack justifyContent="space-between" w="full">
                    <Heading as='h2' size='2xl'> Edit Pet </Heading>
                    <NextLink href={`/pets/${pet.id}`}>
                        <Button leftIcon={<ViewIcon />} colorScheme='blue'> Public profile </Button>
                    </NextLink>
                </HStack>
                <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
                    <SimpleGrid columns={2} columnGap={4} rowGap={6} w="full">
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={errors.name}>
                                <FormLabel htmlFor='name'>Name</FormLabel>
                                <Input id='name' data-testid="input-name" placeholder='Name' defaultValue={pet.name}
                                    {...register('name',
                                        { required: 'This is required', minLength: { value: 4, message: 'Minimum length should be 4' }}
                                    )} />
                                <FormErrorMessage role="alert"> {errors.name && errors.name.message} </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl isInvalid={errors.high}>
                                <FormLabel htmlFor='high'>High (cm)</FormLabel>
                                <Input id='high' placeholder='High' type="number" defaultValue={pet.high}
                                    {...register('high', { required: 'This is required', min: 1, max: 400 })} />
                                <FormErrorMessage> {errors.high && errors.high.message} </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel htmlFor='type'>Pet Type</FormLabel>
                                <Select id='type' {...register('type')} disabled={true}>
                                    {dataPetsType && dataPetsType?.petsType.map((type: IPetType) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel htmlFor='breed'>Breed</FormLabel>
                                <Select id='breed' {...register('breed', { required: 'This is required' }) }>
                                    {petType?.breeds && petType?.breeds.map((breed: IPetBreed) => (
                                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Stack flexDirection="row" gridGap={4}>
                                <Button colorScheme="blue" isLoading={isSubmitting} type="submit" w="full">Update Pet</Button>
                                <NextLink href='/profile'>
                                    <Button type="button" style={{margin: 0}} w="full">Back to Profile</Button>
                                </NextLink>
                            </Stack>
                        </GridItem>
                    </SimpleGrid>
                </form>
                <BoxFM gridGap={6} transition={{ delay: 4 }} flexWrap='wrap' alignItems="start">
                <AnimatePresence initial={false} exitBeforeEnter>
                    { pictures?.length && pictures.map(picture => <PetImageForm
                                                                                    key={picture.id}
                                                                                    id={pet.id}
                                                                                    path={picture.path || ''}
                                                                                    widthCard={200} 
                                                                                    onClickDelete={() => removePicture(Number(picture.id))} />
                                                                )}
                    
                    <BoxFM initial="hidden" animate="show" variants={item}>
                        <ImageUploader petId={Number(pet.id)} sizeInput={200} onChange={(event: any) => addPicture(event)} />
                    </BoxFM>
                </AnimatePresence>
                </BoxFM>
                
            </VStack>
        </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async(context: GetServerSidePropsContext) => {
    const params = context.params as Params;
    const { data, error } = await client.query({query: GET_PET_BY_ID, variables: {id: Number(params.id)}}); 
    return {
        props: {
            pet: data.pet
        }
    };
};