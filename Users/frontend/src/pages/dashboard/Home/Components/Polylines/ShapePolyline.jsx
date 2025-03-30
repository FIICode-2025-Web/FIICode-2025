import { Polyline } from "react-leaflet";

const ShapePolyline = ({ shape }) => {
  return <Polyline positions={shape} color="blue" />;
};

export default ShapePolyline;
