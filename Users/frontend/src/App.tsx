import { Routes, Route, Navigate } from "react-router-dom";
import { Auth, Dashboard } from "./layouts";
import LoginRequired from "./context/LoginRequired";
import NotFound from "./pages/NotFound/NotFound";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8002/api/v1/notification/ws`);


    ws.onopen = () => {
      console.log("✅ WebSocket deschis");
    };


    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type == "route_problem")
        toast.error(`${data.message}`);
      else
        toast.success(`${data.message}`);
    };


    ws.onclose = () => {
      console.warn("⚠️ WebSocket închis");
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    }
  }, []);
  return (
    <Routes>
      <Route element={<LoginRequired />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
