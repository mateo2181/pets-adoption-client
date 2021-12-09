import { extendTheme, theme as base, withDefaultColorScheme, withDefaultVariant } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        brand: {
            
        }
    }
},
withDefaultVariant({
    variant: 'filled',
    components: ['Input', 'Select']
})
);

export default theme;