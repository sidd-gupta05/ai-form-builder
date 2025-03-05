import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MyMapComponent = () => {
    const googleApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    return (
        <LoadScript googleMapsApiKey={googleApiKey}>
            <GoogleMap
                id="google-map"
                mapContainerStyle={{
                    width: '100%',
                    height: '400px',
                }}
                zoom={10}
                center={{
                    lat: 40.7128, // Example coordinates (New York City)
                    lng: -74.0060,
                }}
            >
                {/* Add markers or other components here */}
            </GoogleMap>
        </LoadScript>
    );
};

export default MyMapComponent;
