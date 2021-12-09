import { Box, BoxProps } from '@chakra-ui/react';
import Image, { ImageProps } from 'next/image';
import styles from './CustomImage.module.scss';

export type NextChakraImageProps = Omit<BoxProps, 'as'> & ImageProps

export function CustomImage({ src, alt, ...rest }: NextChakraImageProps) {
	return (
		// <Box width='100%' className={styles.imageContainer} borderRadius={borderRadius || 0}>
		// 	<Image className={styles.image} objectFit="cover" layout="fill" src={src} alt={alt} />
		// </Box>
		<Box
            position="relative"
            {...rest}
        >
            <Image objectFit="cover" layout="fill" src={src} alt={alt} />
        </Box>
	);
}