import axios from "axios";

export const fetchScootersPosition = async (setScooters, clearShape, clearScooters) => {
  clearShape();
  clearScooters();
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://127.0.0.1:8003/api/v1/scooter/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setScooters(response.data);
  } catch (error) {
    console.error("Error fetching live scooters positions:", error);
  }
};

export const fetchDistanceBetweenUserAndScooters = async (
  userLocation,
  scooterLatitude,
  scooterLongitude,
  fetchDistanceBetweenTwoPoints,
  setRouteUserScooter
) => {
  const distance = await fetchDistanceBetweenTwoPoints(
    userLocation[0],
    userLocation[1],
    scooterLatitude,
    scooterLongitude
  );
  setRouteUserScooter(distance);
};

export const toggleScooters = async (
  showScooters,
  setScooters,
  setCars,
  setShowScooters,
  setShowCars
) => {
  const token = localStorage.getItem("token");

  if (showScooters) {
    setScooters([]);
    setShowScooters(false);
  } else {
    try {
      const response = await axios.get("http://127.0.0.1:8003/api/v1/scooter/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScooters(response.data);
    } catch (error) {
      console.error("Error fetching live scooters positions:", error);
    }
    setCars([]);
    setShowScooters(true);
    setShowCars(false);
  }
};