import { Routes, Route, Navigate } from "react-router-dom";
import { Auth, Dashboard } from "./layouts";
import LoginRequired from "./context/LoginRequired";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
       {/* <Route element={<LoginRequired/>}>
          <Route path="/dashboard/*" element={<Dashboard/>}/>
        </Route> */}
        <Route path="/dashboard/*" element={<Dashboard/>}/>
        <Route path="/auth/*" element={<Auth/>}/>
        <Route path="/404" element={<NotFound />}/>
        <Route path="*" element={<Navigate to="/auth/sign-in" replace/>}/>
    </Routes>
  );
}

export default App;
