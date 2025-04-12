import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";

const MapWrapper = ({ children, center }) => {
  const [clickPosition, setClickPosition] = useState(null);

  const ClickHandler = () => {
    useMapEvent("click", (e) => {
      console.log("Clicked on map at:", e.latlng);
      setClickPosition([e.latlng.lat, e.latlng.lng]);
    });
    return null;
  };

  return (
    <MapContainer center={center} zoom={13} style={{ height: "550px", width: "90%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickHandler />

      {clickPosition && (
        <Marker position={clickPosition}>
          <div className="leaflet-popup-content">
            <p>Ai selectat acest punct</p>
          </div>
        </Marker>
      )}

      {children}
    </MapContainer>
  );
};

export default MapWrapper;