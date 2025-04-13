import { useEffect, useState } from "react";
import axios from "axios";
import { BusFront } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function SuggestedRoutes() {
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://127.0.0.1:8003/api/v1/ride-history/suggested", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuggestions(response.data);
            } catch (err) {
                console.error("Failed to fetch suggestions", err);
            }
        };

        fetchSuggestions();
    }, []);

    if (!suggestions.length) return null;

    return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mt-6 space-y-4">
            <h3 className="text-xl font-bold text-white mb-2">🚀 Sugestii pentru traseele tale</h3>
            <div className="grid gap-4 md:grid-cols-2">
                {suggestions.map((s, idx) => (
                    <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-4 hover:bg-gray-700 transition">
                        <div className="bg-green-600 p-3 rounded-lg text-white shadow-md">
                            <BusFront className="w-6 h-6" />
                        </div>
                        <div className="text-sm text-gray-300">
                            <p className="text-white font-semibold text-base">
                                Traseul <span className="text-green-400">{s.route_short_name}</span>
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                În ultimele 30 de zile ai folosit acest traseu de <span className="text-white font-medium">{s.times_used}</span> ori.
                            </p>
                            <p className="mt-2 text-green-500 italic cursor-pointer" onClick={() => navigate("/dashboard/home")}>Vrei să-l refaci azi?</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}