import { Marker, Popup } from "react-leaflet";

const CarMarkers = ({ cars, carIcon, onPopupClose }) => {
  return cars.map((car) => (
    <Marker
      key={car.id}
      position={[car.latitude, car.longitude]}
      icon={carIcon}
      eventHandlers={{
        popupclose: () => {
          onPopupClose();
        },
      }}
    >
      <Popup>
        <div className="flex flex-col items-start text-sm p-2 space-y-1 leading-snug text-gray-800">
          <h3 className="text-base font-semibold text-center w-full text-primary">Ridesharing</h3>
          <p>👨‍✈️ Șofer: <span className="font-medium">{car.driver_name}</span></p>
          <p>🚗 Model: <span className="font-medium">{car.car_model}</span></p>
          <p>🔢 Număr: <span className="font-medium">{car.plate_number}</span></p>
          <p>💺 Scaune: <span className="font-medium">{car.seats}</span></p>
          <p>🔋 Electric: <span className="font-medium">{car.is_electric ? "Da" : "Nu"}</span></p>
          <p>⭐ Recenzie: <span className="font-medium">{car.rating}</span></p>

          {car.selected && (
            <p className="mt-2 w-full text-green-700 font-semibold text-center">🚗 Mașina vine către tine!</p>
          )}
        </div>
      </Popup>
    </Marker>
  ));
};

export default CarMarkers;
