/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';

function MapUpdater({ center }) {
    const map = useMap();
    map.setView(center);
    map.setZoom(13);
    return null;
}

const MapComponent = ({ results }) => {
    const [center, setCenter] = useState([39.95, -75.165]); // [latitude, longitude

    useEffect(() => {
        if (results && results.length > 0) {
            setCenter([results[0].latitude, results[0].longitude]);
        }
    }, [results]);

    return (
        <MapContainer
            className='h-[500px] w-full'
            center={center}
            zoom={13}
            scrollWheelZoom={false}
        >
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {results.map((result, index) => (
                <Marker
                    key={index}
                    position={[result.latitude, result.longitude]}
                >
                    <Popup>
                        {result.name}
                        <br />
                        {result.categories}
                    </Popup>
                </Marker>
            ))}
            <MapUpdater center={center} />
        </MapContainer>
    );
};

export default MapComponent;
