import { Marker } from "react-leaflet";
import MapWrapper from "./MapWrapper";
import ShapePolyline from "../Polylines/ShapePolyline";
import UserMarker from "../Markers/UserMarker";
import StopsMarkers from "../Markers/StopsMarker";
import VehicleMarkers from "../Markers/VehicleMarkers";
import ScooterMarkers from "../Markers/ScooterMarkers";
import CarMarkers from "../Markers/CarMarkers";
import RoutePolyline from "../Polylines/RoutePolyline";
import DistanceMarker from "../Markers/DistanceMarker";

const MapContent = ({
  position,
  shape,
  userLocation,
  vehicles,
  scooters,
  cars,
  routeUserScooter,
  routeUserStation,
  selectedStartingStation,
  defaultIcon,
  scooterIcon,
  ridesharingIcon,
  getStopsInShape,
  fetchDistanceBetweenUserAndScooters,
  fetchDistanceBetweenTwoPoints,
  setRouteUserScooter,
  handleCloseRouteUserScooter,
  handleCloseRouteUserStation,
  handleVehicleIcon,
  handleWheelchairAccessible,
  handleBikeAccessible,
  getTimestampBetweenPositions
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
      {scooters.length > 0 && (
        <ScooterMarkers
          scooters={scooters}
          scooterIcon={scooterIcon}
          fetchDistance={(scooterLat, scooterLng) =>
            fetchDistanceBetweenUserAndScooters(
              userLocation,
              scooterLat,
              scooterLng,
              fetchDistanceBetweenTwoPoints,
              setRouteUserScooter
            )
          }
          onPopupClose={handleCloseRouteUserScooter}
        />
      )}
      {cars.length > 0 && (
        <CarMarkers
          cars={cars}
          carIcon={ridesharingIcon}
          onPopupClose={handleCloseRouteUserScooter}
          fetchDistance={(scooterLat, scooterLng) =>
            fetchDistanceBetweenUserAndScooters(
              userLocation,
              scooterLat,
              scooterLng,
              fetchDistanceBetweenTwoPoints,
              setRouteUserScooter
            )}
        />
      )}
      {routeUserScooter.route?.length > 0 && <RoutePolyline route={routeUserScooter.route} />}
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
      {routeUserScooter.route?.length > 0 && (
        <DistanceMarker
          position={[routeUserScooter.route[0][1] - 0.0009, routeUserScooter.route[0][0]]}
          distance={routeUserScooter.distance_meters}
          onClose={handleCloseRouteUserScooter}
        />
      )}
    </MapWrapper>
  );
};

export default MapContent;