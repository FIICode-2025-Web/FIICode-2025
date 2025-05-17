import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";
const calculateDuration = (distance, speed) => {
  const durationInHours = distance / speed;
  return Math.round(durationInHours * 60);
};

const mockRouteData = (type, distanceKm) => {
  let speed, price;
  switch (type) {
    case "public_transport":
      speed = 25;
      price = 4;
      break;
    case "scooter":
      speed = 12;
      price = (calculateDuration(distanceKm, speed) * 0.75).toFixed(2);
      break;
    case "ridesharing":
      speed = 35;
      price = (3 + distanceKm * 2.38).toFixed(2);
      break;
    default:
      speed = 20;
      price = 0;
  }

  return {
    type,
    distance: (distanceKm * 1000).toFixed(1),
    price,
    duration: calculateDuration(distanceKm, speed),
  };
};

const RouteResults = ({ routes, distanceBetween, selectedCategory }) => {
  const [filter, setFilter] = useState("time");
  const [selectedRoute, setSelectedRoute] = useState(null);

  const distanceKm = distanceBetween / 1000;

  const scooterRoute = mockRouteData("scooter", distanceKm);
  const ridesharingRoute = mockRouteData("ridesharing", distanceKm);

  function randomOutside7to20() {

    const outsideCount = 26;
    const i = Math.floor(Math.random() * outsideCount);
    return i < 6
      ? 1 + i
      : 21 + (i - 6);
  }
  function getMockPollution() {
    if (Math.random() < 0.7) {
      return Math.floor(Math.random() * (20 - 7 + 1)) + 7;
    } else {
      return randomOutside7to20();
    }
  }

  const allRoutes = useMemo(() => [
    ...routes.map(route => ({
      ...route,
      type: "public_transport",
      distance: distanceBetween.toFixed(1),
      duration: calculateDuration(distanceKm, 25),
      price: 2.5,
      pollution: getMockPollution(),
    })),
    scooterRoute,
    ridesharingRoute,
  ], [routes, distanceBetween]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredRoutes = useMemo(() => {
    let filtered = [...allRoutes];

    if (selectedCategory === "Transport Public") {
      filtered = filtered.filter(route => route.type === "public_transport");
    } else if (selectedCategory === "Ridesharing") {
      filtered = filtered.filter(route => route.type === "ridesharing" || route.type === "scooter");
    }

    if (filter === "eco-friendly") {
      filtered = filtered.filter(route => route.type !== "ridesharing");
      filtered.sort((a, b) => a.pollution - b.pollution);
    } else if (filter === "price") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filter === "time") {
      filtered.sort((a, b) => a.duration - b.duration);
    }

    return filtered;
  }, [allRoutes, filter, selectedCategory]);

  const handleSelectRoute = (routeId) => {
    setSelectedRoute(routeId);
    console.log("Selected route:", selectedRoute);

  }

  const handleChooseRoute = async () => {
    if (selectedRoute) {


      const now = new Date();
      const averageSpeed = 25;
      const randomKmTravelled = parseFloat((Math.random() * (10 - 1) + 1).toFixed(2));
      const durationInMinutes = parseFloat(((randomKmTravelled / averageSpeed) * 60).toFixed(2));
      const endDate = new Date(now.getTime() + durationInMinutes * 60000);

      const payload = {
        type: "public_transport",
        ride_id: selectedRoute,
        km_travelled: randomKmTravelled,
        duration: durationInMinutes,
        cost: 4,
        start_time: now.toISOString(),
        end_time: endDate.toISOString()
      };

      try {
        const token = localStorage.getItem("token");

        await axios.post("http://127.0.0.1:8003/api/v1/ride-history/", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        toast.success(`Călătorie placută! Costul biletului este de 4 lei!`);

      } catch (err) {
        console.error("Saving public transport route failed:", err);
      }
    }
    setSelectedRoute(null);
  };

  if (!routes || routes.length === 0) return null;

  return (
    <div className="mt-6 bg-gray-900 bg-opacity-95 shadow-md rounded-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-300">Rezultate trasee</h2>
      <div className="mb-4">
        <label htmlFor="filter" className="text-gray-300 mr-2">Filtru după:</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="bg-gray-800 text-gray-300 p-2 rounded-sm text-sm"
        >
          <option value="eco-friendly">Eco-friendly</option>
          <option value="price">Pret</option>
          <option value="time">Timp</option>
        </select>
        {selectedRoute && (
          <Button
            className="ml-4 bg-green-600 text-white px-3 py-1 rounded-md text-sm"
            onClick={() => handleChooseRoute()}
          >
            Alege ruta
          </Button>
        )}
      </div>

      <ul
        className="space-y-3 max-h-[22rem] overflow-y-auto pr-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`ul::-webkit-scrollbar { display: none; }`}</style>

        {filteredRoutes.map((route, index) => (
          <li
            key={route.trip_id || `${route.type}-${index}`}
            className={`flex items-center gap-4 border border-gray-800 rounded-lg p-3 hover:bg-gray-800 cursor-pointer
            ${selectedRoute === (route.trip_id || `${route.type}-${index}`) ? 'bg-green-800' : ''}`}
            onClick={() => {
              handleSelectRoute(route.trip_id || `${route.type}-${index}`);
            }
            }
          >
            <div className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold text-sm rounded-md uppercase">
              {route.route_short_name || route.type.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-gray-300">
                {route.route_long_name ||
                  (route.type === "scooter"
                    ? "Trotinetă electrică"
                    : route.type === "ridesharing"
                      ? "Ridesharing"
                      : "Transport public")}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center justify-center gap-1">
                  <img src="/img/distance.png" className="w-5 h-5" />
                  <span className="text-gray-400 text-sm">{route.distance} m</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <img src="/img/clock.png" className="w-5 h-5" />
                  <span className="text-gray-400 text-sm">{route.duration} min</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <img src="/img/price-tag.png" className="w-5 h-5" />
                  <span className="text-gray-400 text-sm">{route.price} RON</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <FontAwesomeIcon icon={faRadiation} className="#5bcf72 w-4 h-4 text-red-500" />
                  <span className="text-gray-400 text-sm">{route.pollution}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteResults;
