import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ImageAnalyzerSection = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [annotatedUrl, setAnnotatedUrl] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    toast.error("Nu s-a putut obține locația curentă.");
                    console.error(error);
                }
            );
        } else {
            toast.error("Geolocația nu este suportată de browser.");
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
        setAnnotatedUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error("Te rog încarcă o imagine.");
            return;
        }
        if (!userLocation) {
            toast.error("Nu s-a detectat locația ta.");
            return;
        }

        const form = new FormData();
        form.append("file", file);
        form.append("lat", userLocation.lat);
        form.append("lon", userLocation.lon);

        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://127.0.0.1:8003/api/v1/traffic/congestion",
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { snapshot, annotated_image_base64 } = res.data;

            setResult(snapshot);

            if (annotated_image_base64) {
                const imgUrl = `data:image/png;base64,${annotated_image_base64}`;
                setAnnotatedUrl(imgUrl);
            } else {
                setAnnotatedUrl(null);
            }

            toast.success("Imagine analizată cu succes!");
        } catch (error) {
            toast.error("Analiza imaginii a eșuat.");
            console.error(error);
            setAnnotatedUrl(null);
        } finally {
            setLoading(false);
        }
    };

    const translateLevel = (level) => {
        switch (level) {
            case "low":
                return "scăzut";
            case "high":
                return "ridicat";
            default:
                return level;
        }
    };

    return (
        <div className="flex flex-col items-center justify-start gap-6 bg-gray-900 bg-opacity-95 rounded-md shadow-md p-8 md:p-12 w-screen min-h-screen">
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-300 mb-6">
                Analiza traficului
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-4xl">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-gray-300 bg-gray-800 rounded p-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 transition rounded p-3 text-white font-semibold disabled:opacity-50"
                >
                    {loading ? "Analizez..." : "Analizează imaginea"}
                </button>
            </form>
            {(file || annotatedUrl) && (
                <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mt-8 justify-center items-center">
                    {file && (
                        <div className="flex flex-col items-center flex-1">
                            <h3 className="mb-2 text-lg font-semibold text-gray-300">
                                Imaginea originală
                            </h3>
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Uploaded preview"
                                className="rounded shadow max-w-full max-h-[400px] object-contain"
                            />
                        </div>
                    )}

                    {annotatedUrl && (
                        <div className="flex flex-col items-center flex-1">
                            <h3 className="mb-2 text-lg font-semibold text-gray-300">
                                Imagine procesată
                            </h3>
                            <img
                                src={annotatedUrl}
                                alt="Imagine procesată"
                                className="rounded shadow max-w-full max-h-[400px] object-contain"
                            />
                        </div>
                    )}
                </div>
            )}
            {result && (
                <div className="w-full max-w-4xl mt-8 text-gray-300 bg-gray-800 bg-opacity-50 rounded p-6 shadow-inner">
                    <h3 className="mb-4 text-xl font-semibold">Rezultate analiză</h3>
                    <ul className="space-y-2">
                        <li>Număr vehicule: {result.vehicle_count}</li>
                        <li>Număr persoane: {result.person_count}</li>
                        <li>Nivel congestie vehicule: {translateLevel(result.veh_level)}</li>
                        <li>Nivel congestie pietoni: {translateLevel(result.ped_level)}</li>
                        <li>Latitudine: {result.lat}</li>
                        <li>Longitudine: {result.lon}</li>
                        <li>
                            Data:{" "}
                            {new Date(result.timestamp).toLocaleString("ro-RO", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ImageAnalyzerSection;
