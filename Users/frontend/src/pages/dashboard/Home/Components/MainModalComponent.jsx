import { useState } from "react";
import "../../../../../public/css/backgrounds.css";
import SearchableSelect from "./SearchSelects/SearchableSelect";
import DirectionButton from "./Buttons/DirectionButton";
import TransportSelect from "./SearchSelects/TransportSelect";

const ImageDisplay = ({ selectedCategory, toggleScooters, toggleCars, routes, selectedRoute, handleRouteChange, clearShape, isOptionSelected, direction, handleDirection, onClear}) => {
    return (
        <>
            {selectedCategory === "Transport Public" && (
                <div className="flex items-center justify-center gap-4 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md">
                    <SearchableSelect
                        routes={routes}
                        selectedRoute={selectedRoute}
                        handleRouteChange={handleRouteChange}
                        clearShape={clearShape}
                        onClear={onClear}
                    />
                    {isOptionSelected && (
                        <DirectionButton direction={direction} handleDirection={handleDirection} />
                    )}
                    <div className="grid grid-cols-2 gap-12 mx-2">
                        <div className="rounded-sm p-3 outline outline-2 outline-gray-500 opacity-60 hover:opacity-90 hover:outline-green-500">
                            <div className="w-6 h-6 img-bus hover:cursor-pointer"></div>
                        </div>
                        <div className="rounded-sm p-3 outline outline-2 outline-gray-500 opacity-60 hover:opacity-90 hover:outline-green-500">
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

const MainModalComponent = ({toggleScooters, toggleCars, routes, selectedRoute, handleRouteChange, isOptionSelected, clearShape, direction, handleDirection, onClear }) => {
    const [selectedCategory, setSelectedCategory] = useState("");

    return (
        <div className="flex items-center justify-center gap-4 mr-6 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md p-12">
            <span className="text-[2.5rem] font-semibold my-6 text-gray-300">
                Caută ruta dorită
            </span>
            <TransportSelect handleCategoryChange={setSelectedCategory} clearAllData={onClear}/>
            <ImageDisplay selectedCategory={selectedCategory} toggleCars={toggleCars} toggleScooters={toggleScooters} routes={routes}
                selectedRoute={selectedRoute}
                handleRouteChange={handleRouteChange}
                clearShape={clearShape} isOptionSelected={isOptionSelected} direction={direction} handleDirection={handleDirection} onClear={onClear}/>
        </div>
    );
};

export default MainModalComponent;