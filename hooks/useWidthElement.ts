import React, { MutableRefObject, useCallback, useEffect, useState } from 'react';

interface Props {
    ref: MutableRefObject<HTMLDivElement>;
    initialWidth: number
}

export default function useWidthElement({ref, initialWidth}: Props) {
    
    const [width, setWidth] = useState(initialWidth);

    const getWidth = useCallback(() => {
        // Timeout to have the ref element and get the WIDTH
        const timer = setTimeout(() => {
            if(ref.current) {
                const newWidth = ref.current.clientWidth;
                setWidth(newWidth);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [ref]);

    useEffect(() => {
        window.addEventListener('resize', getWidth);
        return () => {
            window.removeEventListener('resize', getWidth);
        };
    }, [getWidth]);

    useEffect(() => {
        getWidth();
    }, [getWidth]);

    return { width };
}
