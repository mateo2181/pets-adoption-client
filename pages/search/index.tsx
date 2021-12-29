import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GET_PETS, GET_PETS_TYPE } from 'apollo/queries';
import { useQuery } from '@apollo/client';
import { Box, Button, Container, Flex, FormLabel, Grid, Select, Stack, useBreakpointValue } from '@chakra-ui/react';
import { IPetType, LocationType, PetListProps, PetTypeData } from 'types';
import Pet from 'components/Pet';
import { librariesGoogleMapsApi } from 'utils';
import SearchBox, { OnPlaceChangeProps } from 'components/UI/SearchBox';
import { getNewUrlWithParams } from 'utils/navigation';
import { CustomImage } from 'components/UI';
import { getAddressWithoutCountry } from 'utils/helpers';
import useWidthElement from 'hooks/useWidthElement';

interface FilterSearch {
    latitude: number | null,
    longitude: number | null,
    address: string | null,
    petTypeId: number | null
};

export default function SearchPage() {
    
    const router = useRouter();
    const { address, latitude, longitude, petTypeId } = router.query;
    const ref = useRef() as MutableRefObject<HTMLDivElement>;
    const { width } = useWidthElement({ref, initialWidth: 0});
    const widthImagePet = useBreakpointValue({ base: width, sm: 240 });

    const [filterVariables, setFilterVariables] = useState<FilterSearch>({
        latitude: null,
        longitude: null,
        address: null,
        petTypeId: null
    });

    const { error: errorPetsType, loading: loadingPetsType, data: dataPetsType } = useQuery<PetTypeData>(GET_PETS_TYPE);
    const { data, loading, error, refetch } = useQuery<PetListProps>(GET_PETS, {
        variables: { latitude: Number(latitude), longitude: Number(longitude), petTypeId: petTypeId ? Number(petTypeId): null}
    });

    useEffect(() => {
        console.log('SETTING VARIABLES');
        
        setFilterVariables(prev => ({
            ...prev,
            latitude: Number(latitude),
            longitude: Number(longitude),
            petTypeId: petTypeId ? Number(petTypeId): null,
            address: address ? address?.toString() : ''
        }));
        return () => {};
    }, [latitude, longitude, address, petTypeId]);
    // const [location, setLocation] = useState<LocationType>({latitude: null, longitude: null, address: null});

    // const [petType, setPetType] = useState(null);
    function changePetType(event: any) {
        const petTypeSelected = event.target.value;
        setFilterVariables(prev => ({...prev, petTypeId: petTypeSelected ? Number(petTypeSelected) : null}));
    }

    function changeLocation({address, latitude, longitude}: OnPlaceChangeProps) {
        setFilterVariables(prev => ({...prev, address, latitude, longitude}));

    }

    async function search() {
        await refetch({latitude: filterVariables.latitude, longitude: filterVariables.longitude, petTypeId: filterVariables.petTypeId});
        const newurl = getNewUrlWithParams(window.location, Object.entries(filterVariables));
        window.history.replaceState({path: newurl}, 'Search', newurl);
    }

    if(error) return <div>{error.message}</div>;
    if(errorPetsType) return <div>{errorPetsType.message}</div>;

    return (
        <>
        <Head>
            <title>Search Pets</title>
        </Head>
        <Container maxW="container.lg" py={6}>
            <Stack direction={['column', 'row']} spacing={8} w='full' alignItems='flex-end'>
                <Box w={['full', 'auto']} flexGrow={1}>
                    <FormLabel htmlFor='location'>Location</FormLabel>
                    <SearchBox placeholder='Enter a location'
                                librariesGoogleApi={librariesGoogleMapsApi}
                                defaultValue={address?.toString()}
                                onPlaceChanged={changeLocation} />
                </Box>
                <Box w={['full', 'auto']}>
                    <FormLabel htmlFor='type'>Pet Type</FormLabel>
                    {!loadingPetsType && 
                        <Select id='type' placeholder='Select pet type' defaultValue={petTypeId} onChange={changePetType}>
                            <option value='null'>{'All'}</option>
                            {dataPetsType && dataPetsType?.petsType.map((type: IPetType) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </Select>
                    }
                </Box>
                <Button colorScheme="blue" onClick={search}>Search</Button>
            </Stack>
            <Box mt={12}>
                {loading ? 
                    <div>Loading...</div>
                    :
                    data?.pets.length === 0 ? 
                        <Box w='full' textAlign='center'> Pets not found. Try change the filter. </Box>   
                        : 
                        <Grid ref={ref} templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(auto-fit, minmax(190px, 220px))'}} gap={6} w='full'>
                            {data?.pets.map(pet => <Pet onClick={() => router.push(`pets/${pet.id}`)} key={pet.id}>
                                                        <Pet.Image>
                                                            <CustomImage width={widthImagePet} height={widthImagePet} src={pet.pictureDefault?.path || ''} alt={pet.name} />
                                                        </Pet.Image>
                                                        <Pet.Info>
                                                            <Pet.Title>{pet.name}</Pet.Title>
                                                            <Pet.Breed>{pet.breed?.name}</Pet.Breed>
                                                            <Pet.Location>{getAddressWithoutCountry(pet.address)}</Pet.Location>
                                                        </Pet.Info>
                                                        
                                                    </Pet>)}
                        </Grid>
                }
            </Box>
        </Container>
        </>
    );
}