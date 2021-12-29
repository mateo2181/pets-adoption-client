import React, { useEffect } from 'react';
import Image from 'next/image';
import { PetPicture } from 'types';
import { Box, Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { motion, usePresence } from 'framer-motion';
import { CustomImage } from 'components/UI';

interface Props extends PetPicture {
    widthCard: number;
    onClickDelete: any;
}
function PetImageForm({id, path, widthCard, onClickDelete}: Props) {

    const [isPresent, safeToRemove] = usePresence();

    const BoxFM = motion(Flex);

    useEffect(() => {
        if(!isPresent && safeToRemove) { 
            setTimeout(safeToRemove, 1000);
        }
      }, [isPresent, safeToRemove]);
    
    const item = {
        hidden: { opacity: 0, scale: 0 },
        show: { opacity: 1, scale: 1 }
      };

    const transition = { type: 'spring', stiffness: 500, damping: 50, mass: 1 };
    return (
        <BoxFM  animate={isPresent ? 'show' : 'hidden'}
                initial="hidden" layout={true} transition={transition} exit={{ opacity: 0 }} variants={item}
                justifySelf={{ base: 'center', sm: 'flex-start'}} width={widthCard} height={widthCard}>
        <Box position='relative' width="100%" _hover={{ '&>svg': { display: 'block' }}}>
            <SmallCloseIcon 
                onClick={onClickDelete}
                position='absolute'
                zIndex={1}
                display={{ sm: 'block', lg: 'none' }}
                top={2}
                right={2}
                transitionProperty='all'
                transitionDuration='1'
                cursor='pointer'
                transitionTimingFunction='ease-in-out' 
                borderRadius={12}
                color='gray.100'
                bg='gray.500'
                boxSize={6} />
            <Box borderRadius={6} overflow='hidden'>
                <CustomImage width={widthCard} height={widthCard} src={path || ''} alt={path} borderRadius={6}/>  
            </Box>
        </Box>
        </BoxFM>
    );
}

export default React.memo(PetImageForm);