import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { handleBikeAccessible, handleWheelchairAccessible, getTimestampBetweenPositions, fetchStations } from "../utils/helpers";
import "../../../../../public/css/backgrounds.css";
import MainModalComponent from "./MainModalComponent";
import { defaultIcon, busIcon, tramIcon } from "../utils/icons";
import { usePublicTransportData } from "../utils/publicTransportFunctions";
import MapContent from "./Map/MapContent";

export function MainComponent() {

  const {
    stops,
    stations,
    routes,
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
  const [userLocation, setUserLocation] = useState([]);
  const [routeUserStation, setRouteUserStation] = useState([]);
  const [selectedStartingStation, setSelectedStartingStation] = useState(null);
  const position = [47.165517, 27.580742];
  const [isOptionSelected, setIsOptionSelected] = useState(false);

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
      console.error("Error fetching live positions:", error);
    }
  };

  const fetchDistanceBetweenUserAndStations = async (stationLatitude, stationLongitude) => {
    const distance = await fetchDistanceBetweenTwoPoints(userLocation[0], userLocation[1], stationLatitude, stationLongitude);
    setRouteUserStation(distance);
  };

  const handleRouteChange = (event) => {
    const selectedRouteId = event.target.value;
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

  const handleDirection = () => {
    const newDirection = direction === 0 ? 1 : 0;
    setDirection(newDirection);
  };

  const handleVehicleIcon = (vehicle_type) => {
    if (vehicle_type === 0) {
      return tramIcon;
    } else {
      return busIcon;
    }
  }

  const clearAll = () => {
    setSelectedRoute("");
    setSelectedStartingStation(null);
    clearShape();
  };

  return (
    <div className="bg-main">
      <div className="flex items-center justify-center flex-row">
        <div className="flex justify-center items-center w-screen md:p-28 flex-col md:flex-row">
          <MainModalComponent
            selectedRoute={selectedRoute}
            routes={routes}
            handleRouteChange={handleRouteChange}
            clearShape={clearShape}
            isOptionSelected={isOptionSelected}
            direction={direction}
            handleDirection={handleDirection}
            onClear={clearAll}
          />
          <MapContent
            position={position}
            shape={shape}
            userLocation={userLocation}
            vehicles={vehicles}
            routeUserStation={routeUserStation}
            selectedStartingStation={selectedStartingStation}
            defaultIcon={defaultIcon}
            getStopsInShape={getStopsInShape}
            fetchDistanceBetweenTwoPoints={fetchDistanceBetweenTwoPoints}
            handleCloseRouteUserStation={handleCloseRouteUserStation}
            handleVehicleIcon={handleVehicleIcon}
            handleWheelchairAccessible={handleWheelchairAccessible}
            handleBikeAccessible={handleBikeAccessible}
            getTimestampBetweenPositions={getTimestampBetweenPositions}
          />
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
        </div>
      </div>
    </div >
  );
}

export default MainComponent;