import { CircleMarker, Popup } from "react-leaflet";

const StopsMarkers = ({ stops }) => {
    return stops.map((stop) => (
        <CircleMarker
            key={stop.stop_id}
            center={[stop.stop_lat, stop.stop_lon]}
            radius={6}
            fillColor="blue"
            fillOpacity={0.8}
        >
            <Popup>{stop.stop_name}</Popup>
        </CircleMarker>
    ));
};

export default StopsMarkers;
