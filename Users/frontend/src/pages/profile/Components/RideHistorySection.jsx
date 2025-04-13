import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Typography } from "@material-tailwind/react";
import { CircularProgress } from "@mui/material";

export default function RideHistorySection() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRideHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8003/api/v1/ride-history/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setRides(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching ride history:", error);
                setLoading(false);
            }
        };

        fetchRideHistory();
    }, []);

    return (
        <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
            <Typography variant="h5" className="text-white font-semibold">
                Istoric Călătorii
            </Typography>

            {loading ? (
                <div className="flex justify-center mt-10">
                    <CircularProgress color="success" />
                </div>
            ) : rides.length === 0 ? (
                <Typography className="text-gray-400 text-sm">
                    Nu ai călătorii înregistrate.
                </Typography>
            ) : (
                <div className="max-h-[18rem] overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {rides.map((ride) => (
                        <div
                            key={ride.id}
                            className="bg-gray-700 p-4 rounded-xl shadow space-y-1"
                        >
                            <Typography className="text-sm">
                                <span className="text-gray-400 font-medium">Tip:</span>{" "}
                                <span className="capitalize text-white">{ride.type.replace("_", " ")}</span>
                            </Typography>
                            <Typography className="text-sm">
                                <span className="text-gray-400 font-medium">Kilometri:</span>{" "}
                                <span className="text-white">{ride.km_travelled.toFixed(2)} km</span>
                            </Typography>
                            <Typography className="text-sm">
                                <span className="text-gray-400 font-medium">Durată:</span>{" "}
                                <span className="text-white">{ride.duration.toFixed(2)} min</span>
                            </Typography>
                            <Typography className="text-sm">
                                <span className="text-gray-400 font-medium">Cost:</span>{" "}
                                <span className="text-white">{ride.cost} RON</span>
                            </Typography>
                            <Typography className="text-sm">
                                <span className="text-gray-400 font-medium">Început:</span>{" "}
                                <span className="text-white">{new Date(ride.start_time).toLocaleString()}</span>
                            </Typography>
                            <Typography className="text-sm">
                                <span className="text-gray-400 font-medium">Sfârșit:</span>{" "}
                                <span className="text-white">{new Date(ride.end_time).toLocaleString()}</span>
                            </Typography>

                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
