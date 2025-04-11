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
  const [clickedPoint, setClickedPoint] = useState(null);
  const [routeToClickedPoint, setRouteToClickedPoint] = useState([]);
  const [rideStarted, setRideStarted] = useState(false);
  const [rideTimer, setRideTimer] = useState(0);
  const [rideInterval, setRideInterval] = useState(null);
  const [rideEnded, setRideEnded] = useState(false);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null); 
  const [rideStartTime, setRideStartTime] = useState(null);

  const handleCarArrival = async () => {
    if (!rideStartTime) return;
  
    const endTime = new Date();
    const duration = rideTimer;
    const durationMinutes = Math.floor(duration / 60);
    const kmTravelled = 1 + (duration / 60) * 0.4;
    const cost = 3.0 + (1.2 * durationMinutes);
  
    const payload = {
      type: "car",
      km_travelled: parseFloat(kmTravelled.toFixed(2)),
      duration,
      cost: parseFloat(cost.toFixed(2)),
      start_time: rideStartTime.toISOString(),
      end_time: endTime.toISOString(),
    };
  
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8003/api/v1/ride-history/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      setRideStarted(false);
      setRideTimer(0);
      setArrivalCar(null);
      setRideEnded(true);
  
      clearInterval(timerInterval);
    } catch (err) {
      console.error("Ride submission failed:", err);
    }
  };

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

  const handleMapClick = async (point) => {
    if (destinationLocation || !userLocation || userLocation.length !== 2) return;

    setClickedPoint(point);
    const [endLat, endLng] = point;
    const [startLat, startLng] = userLocation;

    const result = await fetchDistanceBetweenTwoPoints(startLat, startLng, endLat, endLng);

    if (result?.route) {
      setRouteToClickedPoint((prevRoute) => {
        return result.route.length > 0 && !arraysAreEqual(prevRoute, result.route) ? result.route : prevRoute;
      });
    }
  };

  const handleConfirmLocation = () => {
    if (clickedPoint) {
      setDestinationLocation(clickedPoint);
      setIsLocationConfirmed(true);
      setClickedPoint(null);
    }
  };
  const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i][0] !== arr2[i][0] || arr1[i][1] !== arr2[i][1]) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (rideEnded && timerInterval) {
      clearInterval(timerInterval);
    }
  }, [rideEnded, timerInterval]);

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
      
        handleCarArrival();
      
        return;
      }

      setMovingCarPosition([reversedRoute[index][1], reversedRoute[index][0]]);
      index++;
    }, 1000);
  };

  useEffect(() => {
    if (arrivalCar && !rideStarted) {
      handleCarArrival();
    }
  }, [arrivalCar]);
  const startRideToDestination = () => {
    if (!routeToClickedPoint || routeToClickedPoint.length === 0) return;
  
    setRideStarted(true);
    setRideEnded(false);
    setArrivalCar(null);
    setRideStartTime(new Date());
    let index = 0;
  
    const carInterval = setInterval(() => {
      if (index >= routeToClickedPoint.length) {
        clearInterval(carInterval);
        setIsCarMoving(false);
        setRideEnded(true);
        setRideStarted(false);
  
        clearInterval(timerInterval);
        return;
      }
  
      const [lng, lat] = routeToClickedPoint[index];
      setMovingCarPosition([lat, lng]);
      index++;
    }, 1000);
  
    setIsCarMoving(true);
    setRideInterval(carInterval);
  
    const newTimerInterval = setInterval(() => {
      if (rideEnded) {
        clearInterval(newTimerInterval);
      } else {
        setRideTimer((prev) => prev + 1);
      }
    }, 1000);
  
    setTimerInterval(newTimerInterval);
  };
  return (
    <MapWrapper center={position} onMapClick={handleMapClick}>
      {rideStarted && (
        <div className="absolute top-4 right-4 bg-white shadow px-4 py-2 rounded-md z-[1000] text-primary font-medium">
          Timp cursă: {rideTimer}s
        </div>
      )}

      {rideEnded && (
        <div className="absolute top-4 right-4 bg-green-100 text-green-700 shadow px-4 py-2 rounded-md z-[1000] font-semibold">
          Cursa a fost finalizată în {rideTimer} secunde!
        </div>
      )}
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
          {!destinationLocation && clickedPoint && (
            <Marker position={clickedPoint}>
              <Popup>
                <button onClick={handleConfirmLocation} className=" px-3 py-2 bg-primary text-white rounded-md">
                  Confirmă destinția
                </button>
              </Popup>
            </Marker>
          )}

          {destinationLocation && (
            <Marker position={destinationLocation}>
              <Popup>Destinație confirmată</Popup>
            </Marker>
          )}

          {routeToClickedPoint.length > 0 && <RoutePolyline route={routeToClickedPoint} />}
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
          {!isLocationConfirmed && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white py-2 px-4 rounded-md shadow-lg z-[1000]">
              Selecteaza locatia
            </div>
          )}
          {isLocationConfirmed && (
            <button
              onClick={handleRequestClosestCar}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white py-2 px-4 rounded-lg shadow-lg z-[1000]"
            >
              Comandă Mașină
            </button>
          )}
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
      {arrivalCar && !rideStarted && (
        <Marker position={[arrivalCar.latitude, arrivalCar.longitude]} icon={ridesharingIcon} ref={arrivalMarkerRef}>
          <Popup>
            <div className="flex flex-col items-start text-sm p-2 space-y-1 leading-snug text-gray-800">
              <h3 className="text-base font-semibold text-center w-full text-primary">Șoferul a ajuns!</h3>
              <p>Șoferul a ajuns la locația ta.</p>
              <button
                className="mt-2 px-3 py-1 bg-primary text-white rounded-md"
                onClick={startRideToDestination}
              >
                Începe cursa
              </button>
            </div>
          </Popup>
        </Marker>
      )}
    </MapWrapper>
  );

};

export default MapContent;