import { useState, useEffect } from "react";
import "../../../../../public/css/backgrounds.css";
import SearchableSelect from "./SearchSelects/SearchableSelect";
import DirectionButton from "./Buttons/DirectionButton";
import TransportSelect from "./SearchSelects/TransportSelect";
import axios from "axios";
import { toast } from "react-toastify";
import PollutionTypeSelect from "./SearchSelects/PollutionTypeSelect";
import SearchableStation from "./SearchSelects/SearchableStation";
import TransportSelectWelcome from "./SearchSelects/TransportSelectWelcome";
import RecordNoise from "@/pages/pollution/components/RecordNoise";

const ImageDisplay = ({ selectedCategory, toggleScooters, toggleCars, routes, selectedRoute, handleRouteChange,
    clearShape, isOptionSelected, direction, handleDirection, onClear, filteredType, setFilteredType,
    handleSaveRoute, routeSaved }) => {
    return (
        <>
            {selectedCategory === "Poluarea fonică" && (
                <div className="flex items-center justify-center md:gap-4 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md">
                   
                </div>
            )}
        </>
    );
};

const PollutionMainModalComponent = ({ selectedCategory, setSelectedCategory ,toggleScooters, toggleCars, routes, selectedRoute, handleRouteChange, isOptionSelected, clearShape, direction, handleDirection, onClear, selected_route_id }) => {
    const [filteredType, setFilteredType] = useState(null);
    const [routeSaved, setRouteSaved] = useState(false);

    const [stations, setStations] = useState([]);
    const [firstStop, setFirstStop] = useState(null);
    const [secondStop, setSecondStop] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [distance, setDistance] = useState(null);
    
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

    const handleRouteRidesharing = async () => {
        const response = await fetchDistanceBetweenTwoPoints(firstStop.stop_lat, firstStop.stop_lon, secondStop.stop_lat, secondStop.stop_lon);
        if (response) {
            setDistance(response.distance_meters);
        }
    }

    const fetchRouteBetweenStops = async () => {
        const token = localStorage.getItem("token");

        if (!firstStop || !secondStop) return;
        handleRouteRidesharing();
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


    const handleSaveRoute = async () => {
        if (!selectedRoute) return;


        const now = new Date();
        const averageSpeed = 25;
        const randomKmTravelled = parseFloat((Math.random() * (10 - 1) + 1).toFixed(2));
        const durationInMinutes = parseFloat(((randomKmTravelled / averageSpeed) * 60).toFixed(2));
        const endDate = new Date(now.getTime() + durationInMinutes * 60000);

        const payload = {
            type: "public_transport",
            ride_id: selected_route_id,
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

            setRouteSaved(true);
            toast.success(`Călătorie placută! Costul biletului este de 4 lei!`);

        } catch (err) {
            console.error("Saving public transport route failed:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[10rem] md:min-h-fit md:h-[35rem] mt-4 gap-4 md:mr-6 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md p-8 md:p-12 mb-12 md:mb-0">
            <span className="text-[1.6rem] md:text-[2.5rem] font-semibold mt-6 text-gray-300">
                Harta poluării
            </span>
            <ImageDisplay selectedCategory={selectedCategory} toggleCars={toggleCars} toggleScooters={toggleScooters} routes={routes}
                selectedRoute={selectedRoute}
                handleRouteChange={handleRouteChange}
                clearShape={clearShape} isOptionSelected={isOptionSelected}
                direction={direction} handleDirection={handleDirection} onClear={onClear}
                filteredType={filteredType} setFilteredType={setFilteredType} handleSaveRoute={handleSaveRoute} routeSaved={routeSaved}
            />
            <PollutionTypeSelect handleCategoryChange={setSelectedCategory} clearAllData={onClear} />
            {selectedCategory === "Poluarea fonică" && (
            <RecordNoise/>)}
        </div>
    );
};

export default PollutionMainModalComponent;