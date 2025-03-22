import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Navbar, Typography, Button, IconButton, Breadcrumbs } from "@material-tailwind/react";
import DashboardNavbar from "../../../layouts/DashboardNavbar";
import SearchableSelect from "./Components/SearchableSelect";
import busImage from "../../../../public/img/front-of-bus.png";
import tramImage from "../../../../public/img/tram.png";
import scooterImage from "../../../../public/img/scooter.png";

const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const busIcon = L.divIcon({
  html: `
    <div style="
      background: white;
      padding: 3px;
      border-radius: 50%;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
    ">
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
    <div style="
      background: white;
      padding: 3px;
      border-radius: 50%;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
    ">
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
    <div style="
      background: #50C878;
      padding: 3px;
      border-radius: 50%;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
    ">
      <img src="${scooterImage}" style="width: 18px; height: 18px;" />
    </div>
  `,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});




const handleWheelchairAccessible = (wheelchair_accessible) => {
  if (wheelchair_accessible === "WHEELCHAIR_ACCESSIBLE") {
    return "Da";
  } else {
    return "Nu";
  }
};

const handleBikeAccessible = (bike_accessible) => {
  if (bike_accessible === "BIKE_ACCESSIBLE") {
    return "Da";
  } else {
    return "Nu";
  }
};


const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};



export function Home() {
  const [stops, setStops] = useState([]);
  const [direction, setDirection] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [shape, setShape] = useState([]);
  const [shapeId, setShapeId] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [scooters, setScooters] = useState([]);
  const [userLocation, setUserLocation] = useState([]);
  const [routeUserScooter, setRouteUserScooter] = useState([]);
  const position = [47.165517, 27.580742];
  const proximityThreshold = 0.1;


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
        ${routeUserScooter.distance_meters} m
      </div>`,
    className: '',
    iconSize: [120, 40],
    iconAnchor: [60, 20]
  });

  const handleCloseRouteUserScooter = () => {
    setRouteUserScooter([]);
  }

  useEffect(() => {
    const closeListener = () => handleCloseRouteUserScooter();
    document.addEventListener("close-distance-label", closeListener);
    return () => document.removeEventListener("close-distance-label", closeListener);
  }, []);


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

  const fetchDistanceBetweenUserAndScooters = async (scooterLatitude, scooterLongitude) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8003/api/v1/scooter/route",
        {
          latitude_A: userLocation[0],
          longitude_A: userLocation[1],
          latitude_B: scooterLatitude,
          longitude_B: scooterLongitude
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRouteUserScooter(response.data);
    } catch (error) {
      console.error("Error fetching live scooters positions:", error);
    }
  };


  const handleRouteChange = (event) => {
    clearScooters();
    const selectedRouteId = event.target.value;
    setSelectedRoute(selectedRouteId);
    console.log("Selected route: " + selectedRouteId);
    fetchShapeByRoute(selectedRouteId);
    fetchStopsForRouteShortName(selectedRouteId);
    fetchLiveVehiclesPositions(selectedRouteId);
  };


  const clearShape = () => {
    setShape([]);
    setVehicles([]);
  };

  const clearScooters = () => {
    setScooters([]);
  };

  const handleDirection = () => {
    clearScooters();
    if (direction === 0) {
      setDirection(1);
      fetchShapeByRoute(selectedRoute);
      fetchStopsForRouteShortName(selectedRoute);
      fetchLiveVehiclesPositions(selectedRoute);

    } else {
      setDirection(0);
      fetchShapeByRoute(selectedRoute);
      fetchStopsForRouteShortName(selectedRoute);
      fetchLiveVehiclesPositions(selectedRoute);
    }
  }

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

  return (
    <div>
      <div className="flex items-center justify-center flex-col">
        <DashboardNavbar />
        <h2 className="text-3xl font-semibold my-6 text-gray-800">
          Caută ruta dorită
        </h2>

        <MapContainer center={position} zoom={13} style={{ height: "550px", width: "70%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {shape.length > 0 && <Polyline positions={shape} color="blue" />}

          {userLocation.length > 0 && (
            <Marker position={userLocation} icon={defaultIcon}>
              <Popup close>
                <div className="flex flex-col space-y-0 leading-tight text-sm">
                  <p className="m-0 p-0 text-center font-bold">Locația ta</p>
                </div>
              </Popup>
            </Marker>
          )}

          {getStopsInShape().map((stop) => (
            <CircleMarker key={stop.stop_id} center={[stop.stop_lat, stop.stop_lon]} icon={defaultIcon} radius={6} fillColor="blue"
              fillOpacity={0.8} >
              <Popup>{stop.stop_name}</Popup>
            </CircleMarker>
          ))}
          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.vehicle_id}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={handleVehicleIcon(vehicle.vehicle_type)}
            >
              <Popup>
                <div className="flex flex-col space-y-0 leading-tight text-sm">
                  <p className="m-0 p-0 text-center font-bold"># Parc: {vehicle.label}</p>
                  <p className="m-0 p-0">♿: {handleWheelchairAccessible(vehicle.wheelchair_accessible)}</p>
                  <p className="m-0 p-0">🚲: {handleBikeAccessible(vehicle.bike_accessible)}</p>
                  <p className="m-0 p-0">Viteza: {vehicle.speed} km/h</p>
                  <p>De acum: {getTimestampBetweenPositions(vehicle.timestamp)} secunde</p>
                </div>
              </Popup>
            </Marker>
          ))}
          {scooters.map((scooter) => (
            <Marker
              key={scooter.id}
              position={[scooter.latitude, scooter.longitude]}
              icon={scooterIcon}
              eventHandlers={
                {
                  popupclose: () => {
                    handleCloseRouteUserScooter();
                  }
                }
              }
            >
              <Popup >
                <div className="flex flex-col space-y-0 text-sm">
                  <p className="m-0 p-0 text-center">Trotinetă</p>
                  <p className="m-0 p-0">Baterie: {scooter.battery_level}%</p>
                  <p className="m-0 p-0">Interval de: {Math.floor(scooter.battery_level * 45 / 100)} km</p>
                  <p className="m-0 p-0">1,50 Ron pentru a debloca</p>
                  <p className="m-0 p-0">0,95 Ron/minut</p>
                  <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center justify-center text-primary text-sm h-8 normal-case bg-gray-300"
                    onClick={() => fetchDistanceBetweenUserAndScooters(scooter.latitude, scooter.longitude)}
                  >
                    Rezervă
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))
          }
          {routeUserScooter.route && routeUserScooter.route.length > 0 && (
            <Polyline
              positions={routeUserScooter.route.map(coord => [coord[1], coord[0]])}
              pathOptions={{ color: 'red', dashArray: '8 8' }}
            />
          )}
          {routeUserScooter.route && routeUserScooter.route.length > 0 && (
            <Marker
              position={[routeUserScooter.route[0][1] - 0.0005, routeUserScooter.route[0][0]]}
              icon={distanceLabelIcon}
            />
          )}

        </MapContainer>
        <div className="flex items-center justify-center gap-4 mt-4">
          <SearchableSelect
            routes={routes}
            selectedRoute={selectedRoute}
            handleRouteChange={handleRouteChange}
            clearShape={clearShape}
          />
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center justify-center text-primary text-sm h-8 normal-case bg-gray-300" onClick={handleDirection}>
            <span className={`${direction === 0 ? 'text-white' : 'text-black'}`}>
              Tur
            </span>
            /
            <span className={`${direction === 1 ? 'text-white' : 'text-black'}`}>
              Retur
            </span>
          </Button>
        </div>

        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center justify-center text-gray-100 text-sm h-8 normal-case bg-green-700"
          onClick={fetchScootersPosition}>
          Scooter
        </Button>
      </div>
    </div >
  );
}

export default Home;