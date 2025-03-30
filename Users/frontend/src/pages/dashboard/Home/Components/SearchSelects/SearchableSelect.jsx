import { useState, useEffect, useRef } from "react";
import { XCircle } from "lucide-react";

const SearchableSelect = ({ routes, selectedRoute, handleRouteChange, clearShape }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredRoutes = routes.filter(route =>
    route.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-80" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
          placeholder="Caută o rută"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setShowDropdown(false);
              clearShape();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <XCircle size={20} />
          </button>
        )}
      </div>
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
            <li className="px-4 py-2 text-gray-500">Niciun rezultat.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
