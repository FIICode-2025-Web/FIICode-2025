import { useEffect, useState } from "react";
import { Marker, Popup, Circle, Polyline } from "react-leaflet";
import MapWrapper from "./MapWrapper";
import UserMarker from "../Markers/UserMarker";
import axios from "axios";

const getColorForAQI = (aqi) => {
  if (aqi <= 7) return "green";
  if (aqi <= 20) return "yellow";
  return "red";
};

const PollutionMapContent = ({
  position,
  userLocation,
  defaultIcon,
  selectedCategory,
}) => {
  const [pollutionData, setPollutionData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPollutionData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8003/api/v1/air_pollution/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setPollutionData(response.data);
      } catch (error) {
        console.error("Error fetching pollution data:", error);
      }
    };

    fetchPollutionData();
  }, []);

  return (
    <MapWrapper center={position}>
      {userLocation.length > 0 && (
        <UserMarker userLocation={userLocation} icon={defaultIcon} />
      )}

      {selectedCategory === "Poluarea aerului" &&
        pollutionData.map((zone) => {
          const color = getColorForAQI(zone.aqi);
          const position = [zone.location.lat, zone.location.lon];
          return (
            <>
              <Circle
                key={zone.zone_id}
                center={position}
                radius={350}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.4,
                }}
              >
                <Popup>
                  <strong>{zone.zone_name}</strong>
                  <br />
                  AQI: {zone.aqi}
                </Popup>
              </Circle>
            </>
          );
        })}
    </MapWrapper>
  );
};

export default PollutionMapContent;
