import { Routes, Route, Navigate } from "react-router-dom";
import { Auth, Dashboard } from "./layouts";
import LoginRequired from "./context/LoginRequired";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
       <Route element={<LoginRequired/>}>
          <Route path="authorities/dashboard/*" element={<Dashboard/>}/>
        </Route>
        <Route path="authorities/auth/*" element={<Auth/>}/>
        <Route path="/404" element={<NotFound />}/>
        <Route path="*" element={<Navigate to="/authorities/auth/sign-in" replace/>}/>
    </Routes>
  );
}

export default App;
