import { useState, useEffect } from "react";
import axios from "axios";
import { getDistance } from "./helpers";

export const usePublicTransportData = () => {
  const [stops, setStops] = useState([]);
  const [stations, setStations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [shape, setShape] = useState([]);
  const [shapeId, setShapeId] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [direction, setDirection] = useState(0);
  const proximityThreshold = 1.5;
  
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

    const fetchStations = async () => {
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

    fetchRoutes();
    fetchStations();
  }, []);

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

  const fetchStopsForRouteShortName = async (routeShortName) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8003/api/v1/tranzy/stops/route/stop-times/${routeShortName}/${direction}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStops(response.data);
    } catch (error) {
      console.error("Error fetching stops for route short name:", error);
    }
  };

  const fetchLiveVehiclesPositions = async (selectedRouteId) => {
    setVehicles([]);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8003/api/v1/tranzy/vehicles/route/route-short-name/${selectedRouteId}/${direction}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching live vehicles positions:", error);
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

  const clearShape = () => {
    setShape([]);
    setVehicles([]);
  };

  return {
    stops,
    stations,
    routes,
    shape,
    shapeId,
    vehicles,
    fetchShapeByRoute,
    fetchStopsForRouteShortName,
    fetchLiveVehiclesPositions,
    getStopsInShape,
    direction,
    setDirection,
    clearShape
  };
};
