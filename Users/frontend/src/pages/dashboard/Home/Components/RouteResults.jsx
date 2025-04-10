import { useState, useEffect } from "react";

const RouteResults = ({ routes }) => {
  const [filter, setFilter] = useState("eco-friendly");

  useEffect(() => {
    if (routes) {
      console.log("Routes data has changed:", routes);
    }
  }, [routes]);
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    console.log("Selected filter:", e.target.value);
  };

  if (!routes || routes.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 w-[30] bg-gray-900 bg-opacity-95 shadow-md rounded-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-300">Rezultate trasee</h2>
      <div className="mb-4">
        <label htmlFor="filter" className="text-gray-300 mr-2">Filtru după:</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="bg-gray-800 text-gray-300 p-2 rounded-sm text-sm"
        >
          <option value="text-sm eco-friendly">Eco-friendly</option>
          <option value="text-sm price">Pret</option>
          <option value="text-sm time">Timp</option>
        </select>
      </div>

      {routes.length === 0 ? (
        <p className="text-gray-400">Niciun traseu găsit.</p>
      ) : (
        <ul className="space-y-3 h-[25rem] overflow-y-auto pr-2">
          {routes.map((route) => (
            <li
              key={route.trip_id}
              className="flex items-center gap-4 border border-gray-800 rounded-lg p-3 hover:bg-gray-800"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold text-sm rounded-md">
                {route.route_short_name}
              </div>
              <span className="text-gray-300">{route.route_long_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RouteResults;
