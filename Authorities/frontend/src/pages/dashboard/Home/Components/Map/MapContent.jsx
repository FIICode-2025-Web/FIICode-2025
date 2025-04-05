import { useRef, useState } from "react";
import { Marker, Popup, Circle } from "react-leaflet";
import MapWrapper from "./MapWrapper";
import ShapePolyline from "../Polylines/ShapePolyline";
import UserMarker from "../Markers/UserMarker";
import StopsMarkers from "../Markers/StopsMarker";
import VehicleMarkers from "../Markers/VehicleMarkers";
import RoutePolyline from "../Polylines/RoutePolyline";
import DistanceMarker from "../Markers/DistanceMarker";

const trafficData = [
  { lat: 47.141368, lng: 27.579762, level: "high" },
  { lat: 47.153304, lng: 27.588764, level: "high" }, 
  { lat: 47.173758, lng: 27.541168, level: "high" }, 
  { lat: 47.137118, lng: 27.606345, level: "high" }, 
  { lat: 47.162483, lng: 27.603442, level: "medium" }, 
  { lat: 47.172643, lng: 27.573555, level: "medium" }, 
  { lat: 47.158462, lng: 27.625022, level: "low" }, 
  { lat: 47.178215, lng: 27.585083, level: "low" }, 
];

const getColorForTraffic = (level) => {
  switch (level) {
    case "low":
      return "green";
    case "medium":
      return "orange";
    case "high":
      return "red";
    default:
      return "blue";
  }
};

const MapContent = ({
  position,
  shape,
  userLocation,
  vehicles,
  routeUserStation,
  selectedStartingStation,
  defaultIcon,
  getStopsInShape,
  handleCloseRouteUserStation,
  handleVehicleIcon,
  handleWheelchairAccessible,
  handleBikeAccessible,
  getTimestampBetweenPositions,
}) => {
  return (
    <MapWrapper center={position}>
      {shape.length > 0 && <ShapePolyline shape={shape} />}
      {userLocation.length > 0 && <UserMarker userLocation={userLocation} icon={defaultIcon} />}
      <StopsMarkers stops={getStopsInShape()} />
      {vehicles.length > 0 && (
        <VehicleMarkers
          vehicles={vehicles}
          handleVehicleIcon={handleVehicleIcon}
          handleWheelchairAccessible={handleWheelchairAccessible}
          handleBikeAccessible={handleBikeAccessible}
          getTimestampBetweenPositions={getTimestampBetweenPositions}
        />
      )}
      {routeUserStation.route?.length > 0 && <RoutePolyline route={routeUserStation.route} />}
      {selectedStartingStation && routeUserStation.distance_meters && (
        <>
          <DistanceMarker
            position={[userLocation[0] - 0.0009, userLocation[1]]}
            distance={routeUserStation.distance_meters}
            onClose={handleCloseRouteUserStation}
          />
          <Marker
            position={[selectedStartingStation.stop_lat, selectedStartingStation.stop_lon]}
            icon={defaultIcon}
          />
        </>
      )}

      {trafficData.map((data, index) => (
        <Circle
          key={index}
          center={[data.lat, data.lng]}
          radius={620}
          pathOptions={{
            color: getColorForTraffic(data.level),
            fillColor: getColorForTraffic(data.level),
            fillOpacity: 0.4,
          }}
        />
      ))}
    </MapWrapper>
  );
};

export default MapContent;
