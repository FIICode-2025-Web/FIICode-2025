import { Routes, Route } from "react-router-dom";
import routes from "@/routes";

export function Dashboard() {

  return (
    <div className="min-h-screen bg-white">
      <div>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/Dashboard.jsx";