import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
const MapWrapper = ({ children, center }) => {
    return (
        <MapContainer center={center} zoom={13} style={{ height: "550px", width: "70%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {children}
        </MapContainer>
    )
}

export default MapWrapper