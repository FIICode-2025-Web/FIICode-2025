
import { busIcon, tramIcon} from "../utils/icons";
import axios from "axios";

export const handleWheelchairAccessible = (wheelchair_accessible) => {
    if (wheelchair_accessible === "WHEELCHAIR_ACCESSIBLE") {
        return "Da";
    } else {
        return "Nu";
    }
};

export const handleBikeAccessible = (bike_accessible) => {
    if (bike_accessible === "BIKE_ACCESSIBLE") {
        return "Da";
    } else {
        return "Nu";
    }
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


export const fetchShape = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`http://127.0.0.1:8003/api/v1/tranzy/shapes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const shapeCoordinates = response.data.map((point) => [point.shape_pt_lat, point.shape_pt_lon]);
        setShape(shapeCoordinates);
    } catch (error) {
        console.error("Error fetching shape data:", error);
    }
};

export const fetchDistanceBetweenTwoPoints = async (point_A_lat, point_A_long, point_B_lat, point_B_long) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.post(
            "http://127.0.0.1:8003/api/v1/tranzy/route_between_two_points",
            {
                latitude_A: point_A_lat,
                longitude_A: point_A_long,
                latitude_B: point_B_lat,
                longitude_B: point_B_long
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching live scooters positions:", error);
    }
};

export const fetchStations = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get("http://127.0.0.1:8003/api/v1/tranzy/stops", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const uniqueStops = response.data.filter(
            (stop, index, self) =>
                index === self.findIndex((s) => s.stop_name === stop.stop_name)
        );
        setStations(uniqueStops);

    } catch (error) {
        console.error("Error fetching stops:", error);
    }
};

export const handleVehicleIcon = (vehicle_type) => {
    if (vehicle_type === 0) {
        return tramIcon;
    } else {
        return busIcon;
    }
}

export const getTimestampBetweenPositions = (timestamp) => {
    var startTime = new Date(timestamp);
    var endTime = new Date();
    var difference = (endTime.getTime() - startTime.getTime()) / 1000;
    return difference.toFixed(0);
}