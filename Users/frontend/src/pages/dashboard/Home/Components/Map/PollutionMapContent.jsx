import { useRef, useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import MapWrapper from "./MapWrapper";
import UserMarker from "../Markers/UserMarker";
import axios from "axios";

const PollutionMapContent = ({
  position,
  userLocation,
  defaultIcon,
}) => {

  return (
    <MapWrapper center={position}>
      {userLocation.length > 0 && <UserMarker userLocation={userLocation} icon={defaultIcon} />}
    </MapWrapper>
  );

};

export default PollutionMapContent;