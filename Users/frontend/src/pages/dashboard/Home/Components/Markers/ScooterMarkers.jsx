import { Marker, Popup } from "react-leaflet";
import { Button } from "@material-tailwind/react";

const ScooterMarkers = ({ scooters, scooterIcon, fetchDistance, onPopupClose }) => {
    return scooters.map((scooter) => (
        <Marker
            key={scooter.id}
            position={[scooter.latitude, scooter.longitude]}
            icon={scooterIcon}
            eventHandlers={
                {
                    popupclose: () => {
                        onPopupClose();
                    },
                    popupopen: () => {
                        fetchDistance(scooter.latitude, scooter.longitude);
                    }
                }
            }
        >
            <Popup>
                <div className="flex flex-col items-start text-sm p-2 space-y-1 leading-snug text-gray-800">
                    <h3 className="text-base font-semibold text-center w-full text-green-600">🛴 Trotinetă</h3>
                    <p>🔋 Baterie: <span className="font-medium">{scooter.battery_level}%</span></p>
                    <p>📏 Interval estimat: <span className="font-medium">{Math.floor(scooter.battery_level * 45 / 100)} km</span></p>
                    <p>🔓 Deblocare: <span className="font-medium">1,50 RON</span></p>
                    <p>⏱️ Tarif: <span className="font-medium">0,95 RON / minut</span></p>

                    <button
                        className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded text-sm"
                    // onClick={() => fetchDistance(scooter.latitude, scooter.longitude)}
                    >
                        Rezervă
                    </button>
                </div>
            </Popup>

        </Marker>
    ))
}

export default ScooterMarkers