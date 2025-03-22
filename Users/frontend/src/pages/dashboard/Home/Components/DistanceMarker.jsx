import L from "leaflet";
import { useEffect } from "react";
import { Marker } from "react-leaflet";

export const DistanceMarker = ({ position, distance, onClose }) => {
    useEffect(() => {
        const closeListener = () => onClose();
        document.addEventListener("close-distance-label", closeListener);
        return () => document.removeEventListener("close-distance-label", closeListener);
    }, []);


    const distanceLabelIcon = L.divIcon({
        html: `
      <div style="
        background: white;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 12px;
        text-align: center;
        position: relative;
      ">
        <button onclick="document.dispatchEvent(new CustomEvent('close-distance-label'))" 
                style="position: absolute; top: 2px; right: 4px; border: none; background: transparent; font-size: 14px; cursor: pointer;">✕</button>
        ${distance} m
      </div>`,
        className: '',
        iconSize: [120, 40],
        iconAnchor: [60, 20]
    });

    return (
        <Marker position={position} icon={distanceLabelIcon} />
    );
};
