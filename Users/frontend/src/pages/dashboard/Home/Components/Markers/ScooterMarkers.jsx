import { useEffect, useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import axios from "axios";

const ScooterMarkers = ({ scooters, scooterIcon, fetchDistance, onPopupClose, setScooters }) => {

    const [activeScooterId, setActiveScooterId] = useState(null);
    const [rideStarted, setRideStarted] = useState(false);
    const [rideStartTime, setRideStartTime] = useState(null);
    const [timer, setTimer] = useState(0);
    const [rideSummary, setRideSummary] = useState(null);
    const popupRefs = useRef({});

    useEffect(() => {
        let interval;
        if (rideStarted) {
            interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [rideStarted]);

    const handleStartRide = (e, scooterId) => {
        e.stopPropagation();
        e.preventDefault();

        const selectedScooter = scooters.find(s => s.id === scooterId);
        if (!selectedScooter) return;

        setActiveScooterId(scooterId);
        setRideStarted(true);
        setRideStartTime(new Date());
        setTimer(0);
        setRideSummary(null);

        setScooters([selectedScooter]);

        setScooters([selectedScooter]);
        if (clearRoute) clearRoute();

        setTimeout(() => {
            popupRefs.current[scooterId]?.openPopup();
        }, 0);
    };


    const handleEndRide = async (e, scooterId) => {
        e.stopPropagation();
        e.preventDefault();

        const endTime = new Date();
        const duration = timer;
        const durationMinutes = Math.floor(duration / 60);
        const kmTravelled = 0.5 + (duration / 60) * 0.25;
        const cost = 1.5 + (0.95 * durationMinutes);

        const payload = {
            type: "scooter",
            ride_id: scooterId,
            km_travelled: parseFloat(kmTravelled.toFixed(2)),
            duration,
            cost: parseFloat(cost.toFixed(2)),
            start_time: rideStartTime.toISOString(),
            end_time: endTime.toISOString()
        };

        try {
            const token = localStorage.getItem("token");

            await axios.post("http://127.0.0.1:8003/api/v1/ride-history/", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            setRideStarted(false);
            setRideStartTime(null);
            setTimer(0);
            setRideSummary({
                duration,
                cost: parseFloat(cost.toFixed(2))
            });

            setTimeout(() => {
                popupRefs.current[scooterId]?.openPopup();
            }, 0);
        } catch (err) {
            console.error("Ride submission failed:", err);
        }
    };

    return scooters.map((scooter) => (
        <Marker
            key={scooter.id}
            position={[scooter.latitude, scooter.longitude]}
            icon={scooterIcon}
            ref={(ref) => {
                if (ref) popupRefs.current[scooter.id] = ref;
            }}
            eventHandlers={{
                popupclose: () => {
                    onPopupClose();
                },
                popupopen: () => {
                    fetchDistance(scooter.latitude, scooter.longitude);
                }
            }}
        >
            <Popup autoClose={false} closeOnClick={false} closeButton={false}>
                <div className="flex flex-col items-start text-sm p-2 space-y-1 leading-snug text-gray-800 w-52">
                    <div className="flex justify-between items-center w-full mb-1">
                        <h3 className="text-base font-semibold text-green-600">🛴 Trotinetă</h3>
                        <button
                            className="text-gray-500 hover:text-black text-md font-bold"
                            onClick={() => popupRefs.current[scooter.id]?.closePopup()}
                        >
                            Inchide
                        </button>
                    </div>
                    <p>🔋 Baterie: <span className="font-medium">{scooter.battery_level}%</span></p>
                    <p>📏 Estimare: <span className="font-medium">{Math.floor(scooter.battery_level * 45 / 100)} km</span></p>
                    <p>🔓 Deblocare: <span className="font-medium">1,50 RON</span></p>
                    <p>⏱️ Tarif: <span className="font-medium">0,95 RON / minut</span></p>

                    {activeScooterId === scooter.id && rideStarted ? (
                        <>
                            <p>⏱️ Timp: <span className="font-semibold">{Math.floor(timer / 60)}m {timer % 60}s</span></p>
                            <button
                                onClick={(e) => handleEndRide(e, scooter.id)}
                                className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-sm"
                            >
                                Termină cursa
                            </button>
                        </>
                    ) : rideSummary && activeScooterId === scooter.id ? (
                        <div className="mt-2 space-y-1 text-sm text-center w-full">
                            <p className="text-green-700 font-semibold">✅ Cursa finalizată</p>
                            <p>⏱️ Timp total: <span className="font-medium">{Math.floor(rideSummary.duration / 60)}m {rideSummary.duration % 60}s</span></p>
                            <p>💰 Preț total: <span className="font-medium">{rideSummary.cost.toFixed(2)} RON</span></p>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => handleStartRide(e, scooter.id)}
                            className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded text-sm"
                        >
                            Start cursa
                        </button>
                    )}
                </div>
            </Popup>
        </Marker>
    ));
};

export default ScooterMarkers;
