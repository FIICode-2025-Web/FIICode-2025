import { useEffect, useState } from "react";
import { Circle, Popup } from "react-leaflet";
import MapWrapper from "./MapWrapper";
import UserMarker from "../Markers/UserMarker";
import axios from "axios";

/* ---------- existing helper color functions ---------- */
const getColorForAQI = (aqi) => {
  if (aqi <= 7) return "green";
  if (aqi <= 20) return "yellow";
  return "red";
};

const getColorForDecibel = (dB) => {
  if (dB <= 50) return "green";
  if (dB <= 70) return "orange";
  return "red";
};

/* New helper for traffic congestion colors */
const getColorForCongestion = (level) => {
  if (level === "low") return "green";
  if (level === "high") return "red";
  return "gray"; // fallback if unknown
};

const PollutionMapContent = ({
  position,
  userLocation,
  defaultIcon,
  selectedCategory,
}) => {
  const [airData, setAirData] = useState([]);
  const [noiseData, setNoiseData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch air data
    const fetchAirPollutionData = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8003/api/v1/air_pollution/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAirData(data);
      } catch (err) {
        console.error("Error fetching air pollution data:", err);
      }
    };

    // Fetch noise data
    const fetchNoisePollutionData = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8003/api/v1/noise/zones",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNoiseData(data);
      } catch (err) {
        console.error("Error fetching noise pollution data:", err);
      }
    };

    // Fetch traffic congestion snapshots
    const fetchTrafficSnapshots = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8003/api/v1/traffic/snapshots",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrafficData(data);
      } catch (err) {
        console.error("Error fetching traffic snapshots:", err);
      }
    };

    if (selectedCategory === "Poluarea aerului") {
      fetchAirPollutionData();
    } else if (selectedCategory === "Poluarea fonică") {
      fetchNoisePollutionData();
    } else if (selectedCategory === "Aglomerație") {
      fetchTrafficSnapshots();
    }
  }, [selectedCategory, token]);

  return (
    <MapWrapper center={position}>
      {/* User location */}
      {userLocation.length > 0 && (
        <UserMarker userLocation={userLocation} icon={defaultIcon} />
      )}

      {/* Air pollution zones */}
      {selectedCategory === "Poluarea aerului" &&
        airData.map((zone) => {
          const color = getColorForAQI(zone.aqi);
          const pos = [zone.location.lat, zone.location.lon];

          return (
            <Circle
              key={`air-${zone.zone_id}`}
              center={pos}
              radius={350}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }}
            >
              <Popup>
                <strong>{zone.zone_name}</strong>
                <br />
                AQI: {zone.aqi}
              </Popup>
            </Circle>
          );
        })}

      {/* Noise pollution zones */}
      {selectedCategory === "Poluarea fonică" &&
        noiseData.map((zone) => {
          const color = getColorForDecibel(zone.avg_decibel);
          const pos = [zone.center_lat, zone.center_lon];

          return (
            <Circle
              key={`noise-${zone.zone_id}`}
              center={pos}
              radius={350}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }}
            >
              <Popup>
                {/* You can reuse your NoisePopup component here */}
                <strong>Noise Zone #{zone.zone_id}</strong>
                <br />
                Avg dB: {zone.avg_decibel}
                <br />
                Max dB: {zone.max_decibel}
                <br />
                Recorded: {new Date(zone.timestamp).toLocaleString()}
              </Popup>
            </Circle>
          );
        })}

      {/* Traffic congestion zones */}
      {selectedCategory === "Aglomerație" &&
        trafficData.map((snap) => {
          const color = getColorForCongestion(snap.veh_level);
          const pos = [snap.lat, snap.lon];

          return (
            <Circle
              key={`traffic-${snap.id}`}
              center={pos}
              radius={300}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }}
            >
              <Popup>
                <strong>Snapshot ID: {snap.id}</strong>
                <br />
                Vehicule: {snap.vehicle_count} ({snap.veh_level})
                <br />
                Pietoni: {snap.person_count} ({snap.ped_level})
                <br />
                Timestamp: {new Date(snap.timestamp).toLocaleString()}
              </Popup>
            </Circle>
          );
        })}
    </MapWrapper>
  );
};

export default PollutionMapContent;
