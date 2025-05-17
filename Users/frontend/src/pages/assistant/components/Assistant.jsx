import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Megaphone } from "lucide-react";
import { renderToString } from "react-dom/server";
import routesData from "../data/data.js";

const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ro-RO";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
};

const RouteCard = ({ route }) => {
    const dep = new Date(route.departure_time).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
    const arr = new Date(route.arrival_time).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });

    const textToSpeak = `Plecare la ${dep}, sosire la ${arr}, durată ${route.duration_min} minute, distanță ${route.distance_km.toFixed(1)} kilometri, cost ${route.cost_ron} RON, AQI maxim ${route.max_aqi}, zgomot ${route.max_noise_db} decibeli.`;

    return (
        <div className="relative flex flex-col bg-gray-700 text-white rounded-xl p-4 shadow-2xl w-full sm:max-w-[calc(50%-0.5rem)] md:max-w-[200px]">
            <h3 className="text-base font-semibold mb-1 capitalize">{route.type}</h3>
            <p className="text-xs mb-1"><strong>➡️ Plecare:</strong> {dep}</p>
            <p className="text-xs mb-1"><strong>📍 Sosire:</strong> {arr}</p>
            <p className="text-xs mb-1"><strong>⏰ Durată:</strong> {route.duration_min} min</p>
            <p className="text-xs mb-1"><strong>📏 Distanță:</strong> {route.distance_km.toFixed(1)} km</p>
            <p className="text-xs mb-1"><strong>💸 Cost:</strong> {route.cost_ron} RON</p>
            <p className="text-xs mb-1"><strong>💨 AQI max:</strong> {route.max_aqi}</p>
            <p className="text-xs mb-2"><strong>🔊 Zgomot:</strong> {route.max_noise_db} dB</p>
            <p className="italic text-[14px] leading-tight text-bold">{route.notes}</p>
            <button
                onClick={() => speak(textToSpeak)}
                className="absolute top-1 right-1 text-white hover:text-green-400"
                aria-label="Redă ruta"
            >
                <Megaphone className="w-4 h-4" />
            </button>
        </div>
    );
};

const RouteCards = ({ routes }) => (
    <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
        {routes.map((r, i) => <RouteCard key={i} route={r} />)}
    </div>
);

const RouteSummary = ({ data }) => {
    const { events, routes } = data;
    const dateLabel = new Date(events[0].time).toLocaleDateString("ro-RO");

    return (
        <div className="prose prose-invert w-full max-w-full lg:max-w-[40rem]">
            <h2>📅 Planificarea ta pentru {dateLabel}</h2>
            {events.slice(0, -1).map((from, idx) => {
                const to = events[idx + 1];
                const segRoutes = routes.filter(r => r.from_index === idx && r.to_index === idx + 1);
                return (
                    <div key={idx} className="mb-8">
                        <p className="font-semibold mb-1">➡️ {from.location} ➜ {to.location}</p>
                        <RouteCards routes={segRoutes} />
                    </div>
                );
            })}
        </div>
    );
};

const Assistant = () => {
    const [history, setHistory] = useState([
        { from: "assistant", text: "Salut! Eu voi fi asistentul tau pentru a-ți găsi ruta potrivită. Spune-mi planul tău!" }
    ]);
    const [input, setInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const ref = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }, [history]);

    const startRecognition = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Browserul tău nu suportă recunoaștere vocală.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "ro-RO";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Eroare recunoaștere vocală:", event.error);
            setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const pushTypewriter = (jsxContent) => {
        const html = renderToString(jsxContent);
        let index = 0;

        const id = setInterval(() => {
            index += 20;
            setHistory(h => {
                const last = h[h.length - 1];
                if (last && last.temp) {
                    last.html = html.slice(0, index);
                    return [...h.slice(0, -1), { ...last }];
                }
                return h;
            });

            if (index >= html.length) {
                clearInterval(id);
                setHistory(h => [...h.slice(0, -1), { from: "assistant", jsx: jsxContent }]);
            }
        }, 20);
    };

    const send = async () => {
        if (!input.trim()) return;

        setHistory(h => [...h, { from: "user", text: input }]);
        setInput("");
        setHistory(h => [...h, { from: "assistant", loading: true }]);
        const token = localStorage.getItem("token");

        try {
            const res = await axios.post("http://127.0.0.1:8003/api/v1/vector/route-tasks", { text: input }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const jsx = <RouteSummary data={res.data} />;
            setHistory(h => [...h.slice(0, -1), { from: "assistant", temp: true, html: "" }]);
            pushTypewriter(jsx);

        } catch (err) {
            console.error(err);
            setHistory(h => [...h.slice(0, -1), { from: "assistant", text: "A apărut o eroare la procesare." }]);
        }
    };

    return (
        <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-xl flex flex-col h-[85vh] w-full max-w-full sm:max-w-[95%] mx-auto min-h-0">
            <div ref={ref} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
                {history.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`px-4 py-2 rounded-2xl text-sm max-w-[90%] relative ${m.from === "user" ? "bg-green-600" : "bg-gray-700"} text-white`}>
                            {m.loading && <span className="animate-pulse">...</span>}
                            {m.temp && <span dangerouslySetInnerHTML={{ __html: m.html }} />}
                            {m.jsx ? (
                                m.jsx
                            ) : (!m.loading && !m.temp && m.from === "assistant") ? (
                                <>
                                    <ReactMarkdown>{m.text}</ReactMarkdown>
                                    <button
                                        onClick={() => speak(m.text)}
                                        className="absolute top-2 right-0 text-white hover:text-green-400"
                                        aria-label="Redă cu voce"
                                    >
                                        <Megaphone className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (m.from === "user" && m.text)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                    onClick={startRecognition}
                    className={`p-2 rounded-xl transition ${isRecording ? "bg-red-600" : "bg-gray-600"} text-white`}
                    aria-label="Înregistrează vocea"
                >
                    🎙️
                </button>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Scrie un mesaj..."
                    className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none w-full"
                />
                <button onClick={send} className="bg-green-600 p-2 rounded-xl hover:bg-green-700 transition" aria-label="Trimite">
                    <PaperPlaneIcon className="text-white" />
                </button>
            </div>
        </div>
    );
};

export default Assistant;
