import L from "leaflet";

const busImage = "/img/buses.png";
const tramImage = "/img/tram.png";

export const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const busIcon = L.divIcon({
    html: `
      <div style="background: white;padding: 3px;border-radius: 50%;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);display: flex;align-items: center;justify-content: center;width: 30px;height: 30px;">
        <img src="${busImage}" style="width: 18px; height: 18px;" />
      </div>
    `,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

export const tramIcon = L.divIcon({
  html: `
    <div style="background: white;padding: 3px;border-radius: 50%;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);display: flex;align-items: center;justify-content: center;width: 30px;height: 30px;">
      <img src="${tramImage}" style="width: 18px; height: 18px;" />
    </div>
  `,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});