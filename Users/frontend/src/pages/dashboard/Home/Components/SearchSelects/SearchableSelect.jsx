import { useState, useEffect, useRef } from "react";
import { XCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const SearchableSelect = ({ routes, selectedRoute, handleRouteChange, clearShape, onClear, filteredType }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [favoritesRoutes, setFavoritesRoutes] = useState([])


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

  const filteredRoutes = routes
    .filter(route =>
      route.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(route =>
      filteredType === null ? true : route.route_type === filteredType
    );

  useEffect(() => {
    fetchFavoritesRoutes();
  }, []);

  const fetchFavoritesRoutes = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://127.0.0.1:8003/api/v1/tranzy/favorite-routes", {
      headers: { Authorization: `Bearer ${token}` },
    })
    setFavoritesRoutes(response.data);
  }

  const handleAddFavorite = async (route_id) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`http://127.0.0.1:8003/api/v1/tranzy/favorite-routes?route_id=${route_id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.status === 200) {
      setFavoritesRoutes(prev => [...prev, { route_id }]);
      toast.success("Ruta a fost adaugată cu succes la favorite!");
    }
    else {
      toast.error("A apărut o eroare la adăgurarea rutei la favorite!");
    }
  }

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
              onClear();
              // setFilteredType(null); 
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <XCircle size={20} />
          </button>
        )}
      </div>


      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
          {filteredRoutes.map(route => {
            const isFavorite = favoritesRoutes.some(fav => fav.route_id === route.route_id);
            return (
              <li
                key={route.route_short_name}
                onClick={() => {
                  if (route.disabled) return;
                  handleRouteChange({ target: { value: route.route_short_name, route_id: route.route_id } });
                  setSearchTerm(route.label);
                  setShowDropdown(false);
                }}
                className={`px-4 py-2 cursor-pointer ${route.disabled
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "hover:bg-blue-100"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span>{route.label}</span>
                  {!isFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFavorite(route.route_id);
                      }}
                      className="text-red-500 hover:text-red-600 ml-2"
                      title="Adaugă la favorite"
                    >
                      ❤️
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
