import { useState } from "react";
import "../../../../../public/css/backgrounds.css";
import SearchableSelect from "./SearchSelects/SearchableSelect";
import DirectionButton from "./Buttons/DirectionButton";
import TransportSelect from "./SearchSelects/TransportSelect";
import axios from "axios";

const ImageDisplay = ({ selectedCategory, toggleScooters, toggleCars, routes, selectedRoute, handleRouteChange,
    clearShape, isOptionSelected, direction, handleDirection, onClear, filteredType, setFilteredType,
    handleSaveRoute, routeSaved }) => {
    return (
        <>
            {selectedCategory === "Transport Public" && (
                <div className="flex items-center justify-center md:gap-4 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md">
                    
                    <SearchableSelect
                        routes={routes}
                        selectedRoute={selectedRoute}
                        handleRouteChange={handleRouteChange}
                        clearShape={clearShape}
                        onClear={onClear}
                        filteredType={filteredType}
                    />
                     {isOptionSelected && selectedRoute && (
                <DirectionButton direction={direction} handleDirection={handleDirection} />
            )}
                    {selectedRoute && (
                        <button
                            onClick={handleSaveRoute}
                            className={`mb-2 px-4 py-2 w-80 rounded-md font-semibold ${routeSaved ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-secondary"
                                }`}
                        >
                            {routeSaved ? "Ruta salvată" : "Alege ruta"}
                        </button>
                    )} 
                   
                    <div className="grid grid-cols-2 md:gap-12 md:mx-2">
                        <div
                            className={`rounded-sm p-3 outline outline-2 ${filteredType === 3 ? "outline-green-500 opacity-90" : "outline-gray-500 opacity-60 hover:opacity-90 hover:outline-green-500"
                                }`}
                            onClick={() => setFilteredType(filteredType === 3 ? null : 3)}
                        >
                            <div className="w-6 h-6 img-bus hover:cursor-pointer"></div>
                        </div>
                        <div
                            className={`rounded-sm p-3 outline outline-2 ${filteredType === 0 ? "outline-green-500 opacity-90" : "outline-gray-500 opacity-60 hover:opacity-90 hover:outline-green-500"
                                }`}
                            onClick={() => setFilteredType(filteredType === 0 ? null : 0)} 
                        >
                            <div className="w-6 h-6 img-tram hover:cursor-pointer"></div>
                        </div>
                    </div>                 
                </div>
            )}
            
            {selectedCategory === "Ridesharing" && (
                <div className="grid grid-cols-2 gap-12 mx-2">
                    <div className="rounded-sm p-3 outline outline-2 outline-gray-500 opacity-60 hover:opacity-90 hover:outline-green-500">
                        <div className="w-6 h-6 img-scooter hover:cursor-pointer" onClick={toggleScooters}></div>
                    </div>
                    <div className="rounded-sm p-3 outline outline-2 outline-gray-500 opacity-60 hover:opacity-90 hover:outline-green-500">
                        <div className="w-6 h-6 img-ridesharing hover:cursor-pointer" onClick={toggleCars}></div>
                    </div>
                </div>
            )}
        </>
    );
};

const MainModalComponent = ({ toggleScooters, toggleCars, routes, selectedRoute, handleRouteChange, isOptionSelected, clearShape, direction, handleDirection, onClear }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredType, setFilteredType] = useState(null);
    const [routeSaved, setRouteSaved] = useState(false);
    const handleSaveRoute = async () => {
        if (!selectedRoute) return;

        const now = new Date();
        const averageSpeed = 42;
        const randomKmTravelled = parseFloat((Math.random() * (15 - 1) + 1).toFixed(2));
        const durationInMinutes = parseFloat(((randomKmTravelled / averageSpeed) * 60).toFixed(2));
    
        const payload = {
            type: "public_transport",
            km_travelled: randomKmTravelled,
            duration: durationInMinutes,
            cost: 4,
            start_time: now.toISOString(),
            end_time: now.toISOString()
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
        } catch (err) {
            console.error("Saving public transport route failed:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[10rem] md:min-h-fit md:h-[35rem] mt-4 gap-4 md:mr-6 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md p-8 md:p-12 mb-12 md:mb-0">
            <span className="text-[1.6rem] md:text-[2.5rem] font-semibold mt-6 text-gray-300">
                Caută ruta dorită
            </span>
            
            <TransportSelect handleCategoryChange={setSelectedCategory} clearAllData={onClear} />
            
            <ImageDisplay selectedCategory={selectedCategory} toggleCars={toggleCars} toggleScooters={toggleScooters} routes={routes}
                selectedRoute={selectedRoute}
                handleRouteChange={handleRouteChange}
                clearShape={clearShape} isOptionSelected={isOptionSelected}
                direction={direction} handleDirection={handleDirection} onClear={onClear}
                filteredType={filteredType} setFilteredType={setFilteredType} handleSaveRoute={handleSaveRoute} routeSaved={routeSaved}/>

        </div>
    );
};

export default MainModalComponent;