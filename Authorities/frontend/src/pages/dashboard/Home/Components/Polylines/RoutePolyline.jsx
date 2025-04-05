import { Polyline } from "react-leaflet";

const RoutePolyline = ({ route }) => {
  const converted = route.map(coord => [coord[1], coord[0]]);
  return <Polyline positions={converted} pathOptions={{ color: 'red', dashArray: '8 8' }} />;
};

export default RoutePolyline;
