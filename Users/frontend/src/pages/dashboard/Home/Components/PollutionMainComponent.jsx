import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { handleBikeAccessible, handleWheelchairAccessible, getTimestampBetweenPositions, fetchStations } from "../utils/helpers";
import "../../../../../public/css/backgrounds.css";
import MainModalComponent from "./MainModalComponent";
import { defaultIcon, busIcon, tramIcon, scooterIcon, ridesharingIcon } from "../utils/icons";
import { fetchDistanceBetweenUserAndScooters, toggleScooters } from "../utils/scootersFunctions";
import { fetchDistanceBetweenUserAndCars, fetchCarsPosition, toggleCars } from "../utils/carsFunctions";
import { usePublicTransportData } from "../utils/publicTransportFunctions";
import MapContent from "./Map/MapContent";
import PollutionMainModalComponent from "./PollutionMainModalComponent";
import PollutionMapContent from "./Map/PollutionMapContent";

export function PollutionMainComponent() {

  const {
    stops,
    stations,
    routes,
    setRoutes,
    shape,
    vehicles,
    fetchShapeByRoute,
    fetchStopsForRouteShortName,
    fetchLiveVehiclesPositions,
    getStopsInShape,
    direction,
    setDirection,
    clearShape
  } = usePublicTransportData();

  const [shapeId, setShapeId] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [scooters, setScooters] = useState([]);
  const [cars, setCars] = useState([]);
  const [userLocation, setUserLocation] = useState([]);
  const [routeUserScooter, setRouteUserScooter] = useState([]);
  const [routeUserCar, setRouteUserCar] = useState([]);
  const [routeUserStation, setRouteUserStation] = useState([]);
  const [selectedStartingStation, setSelectedStartingStation] = useState(null);
  const position = [47.165517, 27.580742];
  const [showScooters, setShowScooters] = useState(false);
  const [showCars, setShowCars] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);


  const handleCloseRouteUserScooter = () => {
    setRouteUserScooter([]);
  }

  const handleCloseRouteUserStation = () => {
    setRouteUserStation([]);
    setSelectedStartingStation(null);
  }

  useEffect(() => {
    if (!selectedRoute) return;

    fetchShapeByRoute(selectedRoute);
    fetchStopsForRouteShortName(selectedRoute);
    fetchLiveVehiclesPositions(selectedRoute);
  }, [direction]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8003/api/v1/tranzy/routes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const routesData = response.data.map((route) => ({
          ...route,
          label: `${route.route_short_name} - ${route.route_long_name}`,
        }));
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    const fetchStops = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8003/api/v1/tranzy/stops", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStops(response.data);
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };
    fetchRoutes();
    getUserCurrentLocation();
    fetchStations();
    // fetchStops();
  }, []);


  const getUserCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    });
  }

  const fetchShape = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`http://127.0.0.1:8003/api/v1/tranzy/shapes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const shapeCoordinates = response.data.map((point) => [point.shape_pt_lat, point.shape_pt_lon]);
      setShape(shapeCoordinates);
    } catch (error) {
      console.error("Error fetching shape data:", error);
    }
  };

  const fetchDistanceBetweenTwoPoints = async (point_A_lat, point_A_long, point_B_lat, point_B_long) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8003/api/v1/tranzy/route_between_two_points",
        {
          latitude_A: point_A_lat,
          longitude_A: point_A_long,
          latitude_B: point_B_lat,
          longitude_B: point_B_long
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching live scooters positions:", error);
    }
  };

  const fetchDistanceBetweenUserAndStations = async (stationLatitude, stationLongitude) => {
    const distance = await fetchDistanceBetweenTwoPoints(userLocation[0], userLocation[1], stationLatitude, stationLongitude);
    setRouteUserStation(distance);
  };

  const handleRouteChange = (event) => {
    clearScooters();
    const selectedRouteId = event.target.value; // short_name
    const selected_route_id = event.target.route_id; // route_id
    setSelectedRouteId(selected_route_id);
    setSelectedRoute(selectedRouteId);
    setIsOptionSelected(!!selectedRouteId);
    fetchShapeByRoute(selectedRouteId);
    fetchStopsForRouteShortName(selectedRouteId);
    fetchLiveVehiclesPositions(selectedRouteId);
  };


  const handleDropdownBlur = (event) => {
    if (!event.relatedTarget || !event.relatedTarget.closest('.dropdown-container')) {
      setIsOptionSelected(false);
      setSelectedRoute("");
    }
  };

  const handleSelectStartingStation = (station) => {
    setSelectedStartingStation(station);
    fetchDistanceBetweenUserAndStations(station.stop_lat, station.stop_lon);
  };


  const clearScooters = () => {
    setScooters([]);
  };

  const clearCars = () => {
    setCars([]);
  }

  const handleDirection = () => {
    const newDirection = direction === 0 ? 1 : 0;
    setDirection(newDirection);
    clearScooters();
  };

  const handleVehicleIcon = (vehicle_type) => {
    if (vehicle_type === 0) {
      return tramIcon;
    } else {
      return busIcon;
    }
  }

  const handleToggleScooters = () => {
    toggleScooters(showScooters, setScooters, setCars, setShowScooters, setShowCars);
  };

  const handleToggleCars = () => {
    toggleCars(showCars, setCars, setScooters, setShowCars, setShowScooters, fetchCarsPosition);
  };

  const clearAll = () => {
    setSelectedRoute("");
    setSelectedStartingStation(null);
    setRouteUserScooter([]);
    setRouteUserCar([]);
    clearShape();
    clearScooters();
    clearCars();
  };

  return (
    <div className="bg-main">
      <div className="flex items-center justify-center flex-row">
        <div className="flex justify-center items-center w-screen md:p-28 flex-col md:flex-row">
        
          <PollutionMainModalComponent
            toggleCars={handleToggleCars}
            toggleScooters={handleToggleScooters}
            selectedRoute={selectedRoute}
            routes={routes}
            handleRouteChange={handleRouteChange}
            clearShape={clearShape}
            isOptionSelected={isOptionSelected}
            direction={direction}
            handleDirection={handleDirection}
            onClear={clearAll}
            selected_route_id={selectedRouteId}
          />
          <PollutionMapContent
            position={position}
            userLocation={userLocation}
            defaultIcon={defaultIcon}
          />
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
        </div>
      </div>
    </div >
  );
}

export default PollutionMainComponent;