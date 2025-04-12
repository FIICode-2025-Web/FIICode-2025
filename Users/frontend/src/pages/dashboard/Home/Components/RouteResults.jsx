import { useState, useEffect, useMemo } from "react";

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

  const distanceKm = distanceBetween / 1000;

  const scooterRoute = mockRouteData("scooter", distanceKm);
  const ridesharingRoute = mockRouteData("ridesharing", distanceKm);

  const allRoutes = useMemo(() => [
    ...routes.map(route => ({
      ...route,
      type: "public_transport",
      distance: distanceBetween.toFixed(1),
      duration: calculateDuration(distanceKm, 25),
      price: 2.5,
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
    } else if (filter === "price") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filter === "time") {
      filtered.sort((a, b) => a.duration - b.duration);
    }

    return filtered;
  }, [allRoutes, filter, selectedCategory]);

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
      </div>

      <ul
        className="space-y-3 max-h-[22rem] overflow-y-auto pr-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`ul::-webkit-scrollbar { display: none; }`}</style>

        {filteredRoutes.map((route, index) => (
          <li
            key={route.trip_id || `${route.type}-${index}`}
            className="flex items-center gap-4 border border-gray-800 rounded-lg p-3 hover:bg-gray-800"
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
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteResults;
