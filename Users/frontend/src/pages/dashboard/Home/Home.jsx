import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@material-tailwind/react";
import MapWrapper from "./Components/MapWrapper";
import { DistanceMarker } from "./Components/DistanceMarker";
import DashboardNavbar from "../../../layouts/DashboardNavbar";
import SearchableSelect from "./Components/SearchableSelect";
import SearchableStation from "./Components/SearchableStation";
import busImage from "../../../../public/img/front-of-bus.png";
import tramImage from "../../../../public/img/tram.png";
import scooterImage from "../../../../public/img/scooter.png";
import rideSharingImage from "../../../../public/img/ridesharing.png";
import UserMarker from "./Components/UserMarker";
import VehicleMarkers from "./Components/VehicleMarkers";
import ScooterMarkers from "./Components/ScooterMarkers";
import StopsMarkers from "./Components/StopsMarker";
import DirectionButton from "./Components/DirectionButton";
import ShapePolyline from "./Components/ShapePolyline";
import RoutePolyline from "./Components/RoutePolyline";
import { handleBikeAccessible, handleWheelchairAccessible, getDistance } from "./utils/helpers";
import { Marker } from "react-leaflet";
import CarMarkers from "./Components/CarMarkers";

const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const busIcon = L.divIcon({
  html: `
    <div style="background: white;padding: 3px;border-radius: 50%;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);display: flex;align-items: center;justify-content: center;width: 30px;height: 30px;">
      <img src="${busImage}" style="width: 18px; height: 18px;" />
    </div>
  `,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const tramIcon = L.divIcon({
  html: `
    <div style="background: white;padding: 3px;border-radius: 50%;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);display: flex;align-items: center;justify-content: center;width: 30px;height: 30px;">
      <img src="${tramImage}" style="width: 18px; height: 18px;" />
    </div>
  `,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const scooterIcon = L.divIcon({
  html: `
    <div style="background: #50C878;padding: 3px;border-radius: 50%;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);display: flex;align-items: center;justify-content: center;width: 30px;height: 30px;">
      <img src="${scooterImage}" style="width: 18px; height: 18px;" />
    </div>
  `,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const ridesharingIcon = L.divIcon({
  html: `
    <div style="background: #50C878;padding: 3px;border-radius: 50%;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);display: flex;align-items: center;justify-content: center;width: 30px;height: 30px;">
      <img src="${rideSharingImage}" style="width: 18px; height: 18px;" />
    </div>
  `,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

export function Home() {
  const [stops, setStops] = useState([]);
  const [stations, setStations] = useState([]);
  const [direction, setDirection] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [shape, setShape] = useState([]);
  const [shapeId, setShapeId] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [scooters, setScooters] = useState([]);
  const [cars, setCars] = useState([]);
  const [userLocation, setUserLocation] = useState([]);
  const [routeUserScooter, setRouteUserScooter] = useState([]);
  const [routeUserStation, setRouteUserStation] = useState([]);
  const [selectedStartingStation, setSelectedStartingStation] = useState(null);
  const position = [47.165517, 27.580742];
  const proximityThreshold = 0.5;
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

  const fetchStations = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://127.0.0.1:8003/api/v1/tranzy/stops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const uniqueStops = response.data.filter(
        (stop, index, self) =>
          index === self.findIndex((s) => s.stop_name === stop.stop_name)
      );
      setStations(uniqueStops);

    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

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

  const fetchShapeByRoute = async (route_id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`http://127.0.0.1:8003/api/v1/tranzy/shapes/route/${route_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const shape_id = response.data['0'][0].shape_id;
      setShapeId(shape_id);
      fetchShape(shape_id);

    } catch (error) {
      console.error("Error fetching shape by route:", error);
    }
  };

  const getStopsInShape = () => {
    return stops.filter((stop) => {
      return shape.some(([lat, lon]) => {
        const distance = getDistance(stop.stop_lat, stop.stop_lon, lat, lon);
        return distance <= proximityThreshold;
      });
    });
  };

  const fetchStopsForRouteShortName = async (routeShortName) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://127.0.0.1:8003/api/v1/tranzy/stops/route/stop-times/${routeShortName}/${direction}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStops(response.data);
    } catch (error) {
      console.error("Error fetching stops for route short name:", error);
    }
  }

  const fetchLiveVehiclesPositions = async (selectedRouteId) => {
    setVehicles([]);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://127.0.0.1:8003/api/v1/tranzy/vehicles/route/route-short-name/${selectedRouteId}/${direction}
      `, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(response.data);

    }
    catch (error) {
      console.error("Error fetching live vehicles positions:", error);
    }
  }

  const fetchScootersPosition = async () => {
    clearShape();
    clearScooters();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:8003/api/v1/scooter/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScooters(response.data);
    } catch (error) {
      console.error("Error fetching live scooters positions:", error);
    }
  }

  const fetchCarsPosition = async () => {
    // clearShape();
    // clearScooters();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:8003/api/v1/ridesharing/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching live cars positions:", error);
    }
  }

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

  const fetchDistanceBetweenUserAndScooters = async (scooterLatitude, scooterLongitude) => {
    const distance = await fetchDistanceBetweenTwoPoints(userLocation[0], userLocation[1], scooterLatitude, scooterLongitude);
    setRouteUserScooter(distance);
  };

  const fetchDistanceBetweenUserAndStations = async (stationLatitude, stationLongitude) => {
    const distance = await fetchDistanceBetweenTwoPoints(userLocation[0], userLocation[1], stationLatitude, stationLongitude);
    setRouteUserStation(distance);
  };

  const handleRouteChange = (event) => {
    clearScooters();
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

  const clearShape = () => {
    setShape([]);
    setVehicles([]);
    setIsOptionSelected(false);
  };

  const clearScooters = () => {
    setScooters([]);
  };

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

  const getTimestampBetweenPositions = (tinestamp) => {
    var startTime = new Date(tinestamp);
    var endTime = new Date();
    var difference = (endTime.getTime() - startTime.getTime()) / 1000;
    return difference.toFixed(0);
  }

  const toggleScooters = async () => {
    if (showScooters) {
      setScooters([]);
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://127.0.0.1:8003/api/v1/scooter/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScooters(response.data);
      } catch (error) {
        console.error("Error fetching live scooters positions:", error);
      }
    }
    setShowScooters(!showScooters);
  };

  const toggleCars = async () => {
    if (showCars) {
      setCars([]);
    } else {
      fetchCarsPosition();
    }
    setShowCars(!showCars);
  };

  return (
    <div>
      <div className="flex items-center justify-center flex-col">
        <DashboardNavbar />
        <h2 className="text-3xl font-semibold my-6 text-gray-800">
          Caută ruta dorită
        </h2>

        <MapWrapper center={position}>

          {shape.length > 0 && <ShapePolyline shape={shape} />}

          {userLocation.length > 0 && (
            <UserMarker userLocation={userLocation} icon={defaultIcon} />
          )}

          <StopsMarkers stops={getStopsInShape()} />

          {vehicles.length > 0 &&
            <VehicleMarkers
              vehicles={vehicles}
              handleVehicleIcon={handleVehicleIcon}
              handleWheelchairAccessible={handleWheelchairAccessible}
              handleBikeAccessible={handleBikeAccessible}
              getTimestampBetweenPositions={getTimestampBetweenPositions}
            />}

          {scooters.length > 0 &&
            <ScooterMarkers
              scooters={scooters}
              scooterIcon={scooterIcon}
              fetchDistance={fetchDistanceBetweenUserAndScooters}
              onPopupClose={handleCloseRouteUserScooter}
            />
          }
          {
            cars.length > 0 &&
            <CarMarkers
              cars={cars}
              carIcon={ridesharingIcon}
              fetchDistance={fetchDistanceBetweenUserAndScooters}
              onPopupClose={handleCloseRouteUserScooter}
            />
          }

          {routeUserScooter.route && routeUserScooter.route.length > 0 && (
            <RoutePolyline route={routeUserScooter.route} />
          )}

          {routeUserStation.route && routeUserStation.route.length > 0 && (
            <RoutePolyline route={routeUserStation.route} />
          )}

          {
            selectedStartingStation && routeUserStation.distance_meters && (
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
            )
          }


          {routeUserScooter.route && routeUserScooter.route.length > 0 && (
            <DistanceMarker
              position={[routeUserScooter.route[0][1] - 0.0009, routeUserScooter.route[0][0]]}
              distance={routeUserScooter.distance_meters}
              onClose={handleCloseRouteUserScooter}
            />
          )}

        </MapWrapper>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="dropdown-container" onBlur={handleDropdownBlur}>
            <SearchableSelect
              routes={routes}
              selectedRoute={selectedRoute}
              handleRouteChange={handleRouteChange}
              clearShape={clearShape}
            />
          </div>
          {isOptionSelected && (
            <DirectionButton direction={direction} handleDirection={handleDirection} />
          )}

          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center justify-center text-gray-100 text-sm h-8 normal-case bg-green-700"
            onClick={toggleScooters}>
            {showScooters ? "Hide Scooters" : "Show Scooters"}
          </Button>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center justify-center text-gray-100 text-sm h-8 normal-case bg-green-700"
            onClick={toggleCars}>
            {showCars ? "Hide Cars" : "Show Cars"}
          </Button>
          <SearchableStation stations={stations} selectStation={handleSelectStartingStation} onClear={handleCloseRouteUserStation} />
        </div>

      </div>
    </div >
  );
}

export default Home;