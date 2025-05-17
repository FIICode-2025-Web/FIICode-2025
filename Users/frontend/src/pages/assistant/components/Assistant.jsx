import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import routesData from "../data/data.js";                      // 👉 JSON-ul

// ───────────────────────── Card pentru o singură rută
const RouteCard = ({ route }) => {
  const dep = new Date(route.departure_time).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
  const arr = new Date(route.arrival_time).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col bg-gray-700 text-white rounded-xl p-4 shadow-2xl w-full sm:max-w-[110px] lg:max-w-[200px]">
      <h3 className="text-base font-semibold mb-1 capitalize">{route.type}</h3>
      <p className="text-xs mb-1"><strong>➡️ Plecare:</strong> {dep}</p>
      <p className="text-xs mb-1"><strong>📍 Sosire:</strong> {arr}</p>
      <p className="text-xs mb-1"><strong>⏰ Durată:</strong> {route.duration_min} min</p>
      <p className="text-xs mb-1"><strong>📏 Distanță:</strong> {route.distance_km.toFixed(1)} km</p>
      <p className="text-xs mb-1"><strong>💸 Cost:</strong> {route.cost_ron} RON</p>
      <p className="text-xs mb-1"><strong>💨 AQI max:</strong> {route.max_aqi}</p>
      <p className="text-xs mb-2"><strong>🔊 Zgomot:</strong> {route.max_noise_db} dB</p>
      <p className="italic text-[14px] leading-tight text-bold">{route.notes}</p>
    </div>
  );
};

// ───────────────────────── Grup de carduri pentru un segment
const RouteCards = ({ routes }) => (
  <div className="flex flex-wrap gap-4 mt-3 justify-center lg:justify-start">
    {routes.map((r, i) => <RouteCard key={i} route={r} />)}
  </div>
);

// ───────────────────────── Rezumat + carduri (JSX pur, păstrăm aspectul)
const RouteSummary = ({ data }) => {
  const { events, routes } = data;
  const dateLabel = new Date(events[0].time).toLocaleDateString("ro-RO");

  return (
    <div className="prose prose-invert w-[40rem]">
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

// ───────────────────────── Componenta principală Assistant
const Assistant = () => {
  const [history, setHistory] = useState([
    { from: "assistant", text: "Salut! Eu voi fi asistentul tau pentru a-ți găsi ruta potrivită. Spune-mi planul tău!" }
  ]);
  const [input, setInput] = useState("");
  const ref = useRef(null);

  // auto-scroll
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [history]);

  // helper pentru efect typewriter (doar pe text simplu)
  const pushTypewriter = jsxContent => {
    const html = renderToString(jsxContent);          // transformăm în string HTML static
    let index = 0;
    const id = setInterval(() => {
      index += 20;                                    // „tastează” 20 de caractere per tick
      setHistory(h => {
        const last = h[h.length - 1];
        if (last && last.temp) {                      // actualizează mesajul temp
          last.html = html.slice(0, index);
          return [...h.slice(0, -1), { ...last }];
        }
        return h;
      });
      if (index >= html.length) {
        clearInterval(id);
        setHistory(h => [...h.slice(0, -1), { from: "assistant", jsx: jsxContent }]); // înlocuiește cu JSX final
      }
    }, 20);
  };

  const send = () => {
    if (!input.trim()) return;

    // 1. adaugă mesaj user
    setHistory(h => [...h, { from: "user", text: input }]);
    setInput("");

    // 2. adaugă „loading” placeholder (3 secunde)
    setHistory(h => [...h, { from: "assistant", loading: true }]);

    setTimeout(() => {
      // 3. înlocuiește loading cu mesaj temp pt typewriter
      setHistory(h => [...h.slice(0, -1), { from: "assistant", temp: true, html: "" }]);

      // 4. pornește efectul typewriter care la final pune JSX real
      pushTypewriter(<RouteSummary data={routesData} />);
    }, 3000);
  };

  return (
    <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-xl flex flex-col h-[85vh]">
      <div ref={ref} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {history.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-2xl text-sm max-w-[90%] ${m.from === "user" ? "bg-green-600" : "bg-gray-700"} text-white`}>
              {m.loading && <span className="animate-pulse">...</span>}
              {m.temp && <span dangerouslySetInnerHTML={{ __html: m.html }} />}
              {m.jsx ? m.jsx : (!m.loading && !m.temp && m.from === "assistant") ? <ReactMarkdown>{m.text}</ReactMarkdown> : (m.from === "user" && m.text)}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700 flex items-center gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} placeholder="Scrie un mesaj..." className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none" />
        <button onClick={send} className="bg-green-600 p-2 rounded-xl hover:bg-green-700 transition" aria-label="Trimite"><PaperPlaneIcon className="text-white"/></button>
      </div>
    </div>
  );
};

// ------------- helper: react-dom/server pentru renderToString (SSR util)
import { renderToString } from "react-dom/server";
export default Assistant;
