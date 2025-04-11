import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";

const MapWrapper = ({ children, center, onMapClick }) => {
  const ClickHandler = () => {
    useMapEvent("click", (e) => {
      const { lat, lng } = e.latlng;
      onMapClick?.([lat, lng]); // call the callback with clicked position
    });
    return null;
  };

  return (
    <MapContainer center={center} zoom={13} style={{ height: "550px", width: "70%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickHandler />
      {children}
    </MapContainer>
  );
};

export default MapWrapper;