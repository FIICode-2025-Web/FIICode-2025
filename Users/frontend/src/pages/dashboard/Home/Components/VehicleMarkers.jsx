import { Marker, Popup } from "react-leaflet";

const VehicleMarkers = ({ vehicles, handleVehicleIcon, handleWheelchairAccessible, handleBikeAccessible, getTimestampBetweenPositions }) => {
    return (
        vehicles.map((vehicle) => (
            <Marker
                key={vehicle.vehicle_id}
                position={[vehicle.latitude, vehicle.longitude]}
                icon={handleVehicleIcon(vehicle.vehicle_type)}
            >
                <Popup>
                    <div className="flex flex-col items-start text-sm p-2 space-y-1 leading-snug text-gray-800">
                        <h3 className="text-base font-semibold text-center w-full text-blue-600">🚌 #{vehicle.label}</h3>
                        <p>♿ Acces: <span className="font-medium">{handleWheelchairAccessible(vehicle.wheelchair_accessible)}</span></p>
                        <p>🚲 Bicicletă: <span className="font-medium">{handleBikeAccessible(vehicle.bike_accessible)}</span></p>
                        <p>💨 Viteză: <span className="font-medium">{vehicle.speed} km/h</span></p>
                        <p>🕒 Actualizat acum: <span className="font-medium">{getTimestampBetweenPositions(vehicle.timestamp)} secunde</span></p>
                    </div>
                </Popup>

            </Marker>
        ))
    )
}

export default VehicleMarkers