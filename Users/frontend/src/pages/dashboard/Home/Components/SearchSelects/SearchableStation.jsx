import { useState, useRef, useEffect } from "react";
import { XCircle } from "lucide-react";

const SearchableStation = ({ stations, onSelect, onClear }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filteredStations = stations.filter((station) =>
    station.stop_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearClick = () => {
    setSearchTerm("");
    setShowDropdown(false);
    onClear(); // Notify parent to clear selection
  };

  return (
    <div className="relative w-80" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
          placeholder="Caută o stație..."
        />
        {searchTerm && (
          <button
            onClick={handleClearClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <XCircle size={20} />
          </button>
        )}
      </div>
      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
          {filteredStations.length > 0 ? (
            filteredStations.map((station) => (
              <li
                key={station.stop_id}
                onClick={() => {
                  setSearchTerm(station.stop_name);
                  setShowDropdown(false);
                  onSelect(station);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              >
                {station.stop_name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">Nicio stație găsită</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableStation;
