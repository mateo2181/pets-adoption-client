import React, { MutableRefObject, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, LoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from '@chakra-ui/react';

interface Props extends React.HTMLProps<HTMLInputElement> {
    placeholder: string,
    defaultValue?: string,
    onPlaceChanged: any,
    librariesGoogleApi: ('drawing' | 'geometry' | 'localContext' | 'places' | 'visualization')[]
}

export interface OnPlaceChangeProps {
    address: string,
    latitude: number,
    longitude: number
}

let autocomplete: google.maps.places.Autocomplete | null = null;

export default function SearchBox({placeholder, onPlaceChanged, defaultValue = '', librariesGoogleApi}: Props) {    

    const onPlacesChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            const coordinates = place.geometry?.location;
            const latitude = coordinates?.lat();
            const longitude = coordinates?.lng();
            // console.log({place, latitude, longitude});
            onPlaceChanged({address: place.formatted_address, latitude, longitude});
             
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    const unmountAutocomplete = () => {
        autocomplete = null;
    };

    const onLoad = (autocompleteProp: google.maps.places.Autocomplete) => {
        console.log('autocomplete: ', autocompleteProp);
        autocomplete = autocompleteProp;
    };

    return (
        <LoadScript googleMapsApiKey={'AIzaSyDhL0Lz6ZpcrHqW9R_sTOIFVz5IkY1mo9E'} libraries={librariesGoogleApi}>
            <Autocomplete onLoad={onLoad} onUnmount={unmountAutocomplete} onPlaceChanged={onPlacesChanged}>
                <Input type="text" placeholder={placeholder} defaultValue={defaultValue} />
          </Autocomplete>
        </LoadScript>
    );
  }