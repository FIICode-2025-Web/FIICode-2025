import { useState } from "react";
import "../../../../../public/css/backgrounds.css";
import SearchableSelect from "./SearchSelects/SearchableSelect";
import DirectionButton from "./Buttons/DirectionButton";

const ImageDisplay = ({ routes, selectedRoute, handleRouteChange, clearShape, isOptionSelected, direction, handleDirection, onClear }) => {
    return (
        <>
            <div className="flex items-center justify-center gap-4 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md">
                <SearchableSelect
                    routes={routes}
                    selectedRoute={selectedRoute}
                    handleRouteChange={handleRouteChange}
                    clearShape={clearShape}
                    onClear={onClear}
                />
                {isOptionSelected && selectedRoute && (
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
        </>
    );
};

const MainModalComponent = ({ routes, selectedRoute, handleRouteChange, isOptionSelected, clearShape, direction, handleDirection, onClear }) => {
    return (
        <div className="flex items-center justify-center gap-4 md:mr-6 flex-col bg-gray-900 bg-opacity-95 rounded-md shadow-md md:mb-0 mb-12 p-6 md:p-12">
            <span className="text-[2.5rem] font-semibold my-6 text-gray-300">
                Caută ruta dorită
            </span>
            <ImageDisplay routes={routes}
                selectedRoute={selectedRoute}
                handleRouteChange={handleRouteChange}
                clearShape={clearShape} isOptionSelected={isOptionSelected} direction={direction} handleDirection={handleDirection} onClear={onClear} />
        </div>
    );
};

export default MainModalComponent;