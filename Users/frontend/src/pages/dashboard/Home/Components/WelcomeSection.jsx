import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import logo from '../../../../img/logo-vaya.png'
import SearchableStation from "./SearchSelects/SearchableStation";
import RouteResults from "./RouteResults";
import TransportSelect from "./SearchSelects/TransportSelect";

export function WelcomeSection() {
  const [stations, setStations] = useState([]);
  const [firstStop, setFirstStop] = useState(null);
  const [secondStop, setSecondStop] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); 

  useEffect(() => {
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

    fetchStations();
  }, []);

  const fetchRouteBetweenStops = async () => {
    const token = localStorage.getItem("token");

    if (!firstStop || !secondStop) return;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8003/api/v1/tranzy/routes/route-between-two-points?stop_id_A=${firstStop.stop_id}&stop_id_B=${secondStop.stop_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        }
      );
      setRouteData(response.data);
      console.log("Route Data:", response.data);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const handleClearFirstStop = () => {
    setFirstStop(null);
    setRouteData([]);
  };
  
  const handleClearSecondStop = () => {
    setSecondStop(null);
    setRouteData([]);
  };

  const onClear = () => {
    setSelectedCategory("");
  };

  useEffect(() => {
    console.log("routeData changed:", routeData);
  }, [routeData]);

  return (
    <div className="bg-main-reversed min-h-screen flex flex-col md:flex-row items-center justify-evenly p-4 md:p-24 gap-10">
      <div className="italic opacity-90 flex items-center justify-center flex-col">
        <div>
          <img src={logo} alt="logo" className="w-[14rem] md:w-[28rem]" />
        </div>
        <div className="text-[1.1rem] md:text-[1.9rem] md:my-3 md:my-6 text-gray-300">
          Călătorește rapid, simplu, eficient!
        </div>
      </div>
     
      <div className="flex justify-center h-[32rem] gap-4 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md p-8 md:p-12 mt-10 md:mt-0">
        <span className="text-[2rem] text-center font-semibold my-6 text-gray-300">
          Unde vrei sa ajungi?
        </span>

        <p className="text-[1rem] text-gray-300">Plecare:</p>
        <SearchableStation
          stations={stations}
          onSelect={setFirstStop}
          onClear={handleClearFirstStop}
        />

        <p className="text-[1rem] text-gray-300">Sosire:</p>
        <SearchableStation
          stations={stations}
          onSelect={setSecondStop}
          onClear={handleClearSecondStop}
        />
        <p className="text-[1rem] text-gray-300">Tip de transport:</p>
        <TransportSelect 
          handleCategoryChange={setSelectedCategory} 
          clearAllData={onClear}
        />
        <button
          onClick={fetchRouteBetweenStops}
          className="bg-primary hover:bg-primary hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded my-6"
        >
          Cauta rute
        </button>
      </div>
      {routeData && <RouteResults routes={routeData} />}
    </div>
  );
}

export default WelcomeSection;
