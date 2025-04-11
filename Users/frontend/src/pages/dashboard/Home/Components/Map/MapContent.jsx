import { useRef, useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import MapWrapper from "./MapWrapper";
import ShapePolyline from "../Polylines/ShapePolyline";
import UserMarker from "../Markers/UserMarker";
import StopsMarkers from "../Markers/StopsMarker";
import VehicleMarkers from "../Markers/VehicleMarkers";
import ScooterMarkers from "../Markers/ScooterMarkers";
import CarMarkers from "../Markers/CarMarkers";
import RoutePolyline from "../Polylines/RoutePolyline";
import DistanceMarker from "../Markers/DistanceMarker";
import axios from "axios";


const MapContent = ({
  position,
  shape,
  userLocation,
  vehicles,
  scooters,
  cars,
  routeUserScooter,
  routeUserCar,
  routeUserStation,
  selectedStartingStation,
  defaultIcon,
  scooterIcon,
  ridesharingIcon,
  getStopsInShape,
  fetchDistanceBetweenUserAndCars,
  fetchDistanceBetweenUserAndScooters,
  fetchDistanceBetweenTwoPoints,
  setRouteUserScooter,
  setRouteUserCar,
  handleCloseRouteUserScooter,
  handleCloseRouteUserCar,
  handleCloseRouteUserStation,
  handleVehicleIcon,
  handleWheelchairAccessible,
  handleBikeAccessible,
  getTimestampBetweenPositions,
  clearCars,
  setScooters
}) => {
  const [movingCarPosition, setMovingCarPosition] = useState(null);
  const [isCarMoving, setIsCarMoving] = useState(false);
  const [arrivalPrompt, setArrivalPrompt] = useState(false);
  const [arrivalCar, setArrivalCar] = useState(null);
  const arrivalMarkerRef = useRef(null)
  const [carsState, setCarsState] = useState(cars);

  const handleRequestClosestCar = async () => {
    const token = localStorage.getItem("token");
  
    if (!userLocation || userLocation.length !== 2) return;
  
    try {
      const res = await axios.post(
        "http://127.0.0.1:8003/api/v1/ridesharing/car",
        {
          user_latitude: userLocation[0],
          user_longitute: userLocation[1],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const closestCar = res.data;
  
      setCarsState((prev) =>
        prev.map((car) =>
          car.id === closestCar.id ? { ...closestCar, selected: true } : car
        )
      );
  
      fetchDistanceBetweenUserAndCars(
        userLocation,
        closestCar.latitude,
        closestCar.longitude,
        fetchDistanceBetweenTwoPoints,
        setRouteUserCar
      );
  
      moveCarAlongRoute(routeUserCar.route);
    } catch (err) {
      console.error("Failed to fetch closest car:", err);
    }
  };

  useEffect(() => {
    if (routeUserCar.route?.length > 0) {
      moveCarAlongRoute(routeUserCar.route);
    }
  }, [routeUserCar.route]);

  useEffect(() => {
    setCarsState(cars);
  }, [cars]);

  const moveCarAlongRoute = (route) => {
    if (!route || route.length === 0) return;
  
    setIsCarMoving(true);
    const reversedRoute = [...route].reverse();
    let index = 0;
    setCarsState([])
  
    const interval = setInterval(() => {
      if (index >= reversedRoute.length) {
        clearInterval(interval);
        setIsCarMoving(false);
        const arrivalPos = {
          latitude: reversedRoute[index - 1][1],
          longitude: reversedRoute[index - 1][0],
        };
  
        setArrivalCar(arrivalPos);
        if (arrivalMarkerRef.current) {
          arrivalMarkerRef.current.openPopup();
        }
  
        return;
      }
  
      setMovingCarPosition([reversedRoute[index][1], reversedRoute[index][0]]);
      index++;
    }, 1000);
  };

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
        setScooters={setScooters}
      />
      
      )}
      {carsState.length > 0 && (
        <>
        <CarMarkers
          cars={carsState}
          carIcon={ridesharingIcon}
          onPopupClose={handleCloseRouteUserCar}
          fetchDistance={(carLat, carLng) =>
            fetchDistanceBetweenUserAndCars(
              userLocation,
              carLat,
              carLng,
              fetchDistanceBetweenTwoPoints,
              setRouteUserCar,
              moveCarAlongRoute,
              clearCars
            )
          }
        />
        <button
        onClick={handleRequestClosestCar}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white py-2 px-4 rounded-lg shadow-lg z-[1000]"
      >
        Comandă Mașină
      </button>
      </>
      )}
      {routeUserCar.route?.length > 0 && <RoutePolyline route={routeUserCar.route} />}
      {isCarMoving && movingCarPosition && (
        <Marker position={movingCarPosition} icon={ridesharingIcon} />
      )}
      {routeUserScooter.route?.length > 0 && <RoutePolyline route={routeUserScooter.route} />}
      {routeUserCar.route?.length > 0 && <RoutePolyline route={routeUserCar.route} />}
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
      {arrivalCar && (
        <Marker position={[arrivalCar.latitude, arrivalCar.longitude]} icon={ridesharingIcon}>
          <Popup>
            <div className="flex flex-col items-start text-sm p-2 space-y-1 leading-snug text-gray-800">
              <h3 className="text-base font-semibold text-center w-full text-primary">Șoferul a ajuns!</h3>
              <p>Șoferul a ajuns la destinație, </p>
            </div>
          </Popup>
        </Marker>
      )}
    
    </MapWrapper>
  );
  
};

export default MapContent;