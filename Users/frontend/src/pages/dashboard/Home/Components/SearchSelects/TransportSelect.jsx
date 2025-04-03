import { useState, useRef, useEffect } from "react";
import { XCircle } from "lucide-react";

const TransportSelect = ({ handleCategoryChange, clearAllData }) => {
    const [selectedOption, setSelectedOption] = useState("");
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

    const options = ["Transport Public", "Ridesharing"];

    return (
        <div className="relative w-80" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={selectedOption}
                    onFocus={() => setShowDropdown(true)}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 cursor-pointer"
                    placeholder="Selectează opțiunea"
                />
                {selectedOption && (
                    <button
                        onClick={() => {
                            setSelectedOption("");
                            handleCategoryChange("");
                            clearAllData();
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <XCircle size={20} />
                    </button>
                )}
            </div>
            {showDropdown && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => {
                                setSelectedOption(option);
                                handleCategoryChange(option);
                                setShowDropdown(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TransportSelect;