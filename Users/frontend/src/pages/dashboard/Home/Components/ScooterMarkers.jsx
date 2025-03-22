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
                    }
                }
            }
        >
            <Popup >
                <div className="flex flex-col space-y-0 text-sm">
                    <p className="m-0 p-0 text-center">Trotinetă</p>
                    <p className="m-0 p-0">Baterie: {scooter.battery_level}%</p>
                    <p className="m-0 p-0">Interval de: {Math.floor(scooter.battery_level * 45 / 100)} km</p>
                    <p className="m-0 p-0">1,50 Ron pentru a debloca</p>
                    <p className="m-0 p-0">0,95 Ron/minut</p>
                    <Button
                        variant="text"
                        color="blue-gray"
                        className="flex items-center justify-center text-primary text-sm h-8 normal-case bg-gray-300"
                        onClick={() => fetchDistance(scooter.latitude, scooter.longitude)}
                    >
                        Rezervă
                    </Button>
                </div>
            </Popup>
        </Marker>
    ))
}

export default ScooterMarkers