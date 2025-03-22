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
                    <div className="flex flex-col space-y-0 leading-tight text-sm">
                        <p className="m-0 p-0 text-center font-bold"># Parc: {vehicle.label}</p>
                        <p className="m-0 p-0">♿: {handleWheelchairAccessible(vehicle.wheelchair_accessible)}</p>
                        <p className="m-0 p-0">🚲: {handleBikeAccessible(vehicle.bike_accessible)}</p>
                        <p className="m-0 p-0">Viteza: {vehicle.speed} km/h</p>
                        <p>De acum: {getTimestampBetweenPositions(vehicle.timestamp)} secunde</p>
                    </div>
                </Popup>
            </Marker>
        ))
    )
}

export default VehicleMarkers