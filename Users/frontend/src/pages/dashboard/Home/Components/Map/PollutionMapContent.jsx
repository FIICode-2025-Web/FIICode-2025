import { useEffect, useState } from "react";
import { Circle, Popup } from "react-leaflet";
import MapWrapper from "./MapWrapper";
import UserMarker from "../Markers/UserMarker";
import axios from "axios";
import trafficSound from "./audio/traffic_loud.mp3";

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

const NoisePopup = ({ zone }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioId = `audio-${zone.zone_id}`;

  const toggleAudio = () => {
    const audio = document.getElementById(audioId);
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <>
      <strong>Noise Zone #{zone.zone_id}</strong>
      <br />
      Avg dB: {zone.avg_decibel}
      <br />
      Max dB: {zone.max_decibel}
      <br />
      Recorded: {new Date(zone.timestamp).toLocaleString()}
      <br />
      <audio id={audioId} src={trafficSound} />
      <button
        onClick={toggleAudio}
        className="w-80 flex items-center rounded-md justify-center text-white text-md h-10 normal-case bg-primary hover:bg-secondary mt-2"
      >
        {isPlaying ? "⏹️ Stop Audio" : "▶️ Play Sample Noise"}
      </button>
    </>
  );
};
const PollutionMapContent = ({
  position,
  userLocation,
  defaultIcon,
  selectedCategory,
}) => {
  const [airData, setAirData] = useState([]);
  const [noiseData, setNoiseData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAirPollutionData = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8003/api/v1/air_pollution/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAirData(data);
      } catch (err) {
        console.error("Error fetching air pollution data:", err);
      }
    };

    const fetchNoisePollutionData = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8003/api/v1/noise/zones",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setNoiseData(data);
      } catch (err) {
        console.error("Error fetching noise pollution data:", err);
      }
    };

    fetchAirPollutionData();
    fetchNoisePollutionData();
  }, [token]);

  return (
    <MapWrapper center={position}>
      {userLocation.length > 0 && (
        <UserMarker userLocation={userLocation} icon={defaultIcon} />
      )}

      {selectedCategory === "Poluarea aerului" &&
        airData.map((zone) => {
          const color = getColorForAQI(zone.aqi);
          const pos = [zone.location.lat, zone.location.lon];

          return (
            <Circle
              key={`air-${zone.zone_id}`}
              center={pos}
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
          );
        })}

      {selectedCategory === "Poluarea fonică" &&
        noiseData.map((zone) => {
          const color = getColorForDecibel(zone.avg_decibel);
          const pos = [zone.center_lat, zone.center_lon];

          return (
            <Circle
              key={`noise-${zone.zone_id}`}
              center={pos}
              radius={350}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.4,
              }}
            >
              <Popup>
                <NoisePopup zone={zone} />
              </Popup>
            </Circle>
          );
        })}
    </MapWrapper>
  );
};

export default PollutionMapContent;
