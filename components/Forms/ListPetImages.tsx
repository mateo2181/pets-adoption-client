import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Grid } from '@chakra-ui/layout';
import { AnimatePresence, motion } from 'framer-motion';
import ImageUploader from 'components/ImageUploader';
import PetImageForm from 'components/Forms/PetImage';
import { PetPicture } from 'types';
import { PET_SINGLE_REMOVE_PICTURE, PET_SINGLE_UPLOAD_PICTURE } from 'apollo/queries';
import { useMutation } from '@apollo/client';

interface Props {
    picturesProp: Array<PetPicture>,
    petId: string
}

export default function ListPetImages({picturesProp, petId}: Props) {
    
    const [pictures, setPictures] = useState<Array<PetPicture>>([]);
    
    const [removePetPicture, { loading: loadingRemovePicture, error: errorRemovePicture }] = useMutation(PET_SINGLE_REMOVE_PICTURE);
    const [uploadPicture, { loading: loadingUploadPicture, error: errorUploadPicture }] = useMutation(PET_SINGLE_UPLOAD_PICTURE);

    const BoxFM = motion(Grid);
    const item = {
        hidden: { opacity: 0, scaleY: 0 },
        show: { opacity: 1, scaleY: 1 }
    };

    useEffect(() => {
        setPictures(() => picturesProp || []);
    }, [picturesProp]);

    const addPicture = useCallback(
        ({target: { validity, files: [file]}}: any) => {
        if(!validity.valid) {
            return;
        }
        uploadPicture({ variables: { file, id: petId }})
        .then((res: any) => {
            setPictures(pictures => pictures.concat(res.data.addAvatar));
        });
    }, [setPictures, uploadPicture, petId]);
    

    const removePicture = useCallback(
        (petPictureId: number) => {
            removePetPicture({variables: { petId: petId, petPictureId }})
            .then(() => {
                setPictures(pictures => pictures.filter(p => Number(p.id) !== petPictureId));
            });
        },
        [setPictures, removePetPicture, petId]);

    return (
        <BoxFM templateColumns={{ base: 'repeat(auto-fit, minmax(190px, 190px))'}}
               gridGap={6}
               transition={{ delay: 4 }}>
            <AnimatePresence initial={false} exitBeforeEnter>
                    { pictures?.length && pictures.map(picture => <PetImageForm
                                                                    key={picture.id}
                                                                    id={petId}
                                                                    path={picture.path || ''}
                                                                    widthCard={190} 
                                                                    onClickDelete={() => removePicture(Number(picture.id))} />
                                                                )}
                    
                <BoxFM initial="hidden" animate="show" variants={item}>
                    <ImageUploader petId={Number(petId)} sizeInput={190} onChange={(event: any) => addPicture(event)} />
                </BoxFM>
            </AnimatePresence>
        </BoxFM>
    );
}
