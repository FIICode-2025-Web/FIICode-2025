import axios from "axios";

export const fetchCarsPosition = async (setCars) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://127.0.0.1:8003/api/v1/ridesharing/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCars(response.data);
  } catch (error) {
    console.error("Error fetching live cars positions:", error);
  }
};

export const fetchDistanceBetweenUserAndCars = async (
  userLocation,
  carLatitude,
  carLongitude,
  fetchDistanceBetweenTwoPoints,
  setRouteUserCar,
  moveCarAlongRoute // Ensure this is used
) => {
  const distance = await fetchDistanceBetweenTwoPoints(
    userLocation[0],
    userLocation[1],
    carLatitude,
    carLongitude
  );

  setRouteUserCar(distance);

  if (distance?.route) {
    moveCarAlongRoute(distance.route);
  }
};

export const toggleCars = async (showCars, setCars, setShowCars, fetchCarsPosition) => {
  if (showCars) {
    setCars([]);
  } else {
    fetchCarsPosition(setCars);
  }
  setShowCars(!showCars);
};
