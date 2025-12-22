import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Heatmap = ({ data }) => {
    // Determine color based on intensity (0-100)
    const getColor = (score) => {
        return score > 80 ? '#ef4444' : // Red
            score > 50 ? '#f97316' : // Orange
                '#eab308';               // Yellow
    };

    return (
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {data.map((point, idx) => (
                <CircleMarker
                    key={idx}
                    center={[point.lat, point.lon]}
                    fillColor={getColor(point.intensity)}
                    color={getColor(point.intensity)}
                    radius={20}
                    fillOpacity={0.6}
                    stroke={false}
                >
                    <Popup>
                        Hunger Score: {point.intensity.toFixed(1)}
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};

export default Heatmap;
