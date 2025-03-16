import { useState } from "react";

const SearchableSelect = ({ routes, selectedRoute, handleRouteChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter routes based on search input
  const filteredRoutes = routes.filter(route =>
    route.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-80 my-10">
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search a route..."
      />

      {/* Dropdown Options */}
      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map(route => (
              <li
                key={route.route_short_name}
                onClick={() => {
                  handleRouteChange({ target: { value: route.route_short_name } });
                  setSearchTerm(route.label);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              >
                {route.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
