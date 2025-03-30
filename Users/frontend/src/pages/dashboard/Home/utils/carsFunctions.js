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

export const toggleCars = async (showCars, setCars, setShowCars, fetchCarsPosition) => {
  if (showCars) {
    setCars([]);
  } else {
    fetchCarsPosition(setCars);
  }
  setShowCars(!showCars);
};
