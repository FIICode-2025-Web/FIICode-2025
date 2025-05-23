import { Routes, Route } from "react-router-dom";
import routes from "@/routes";

export function Auth() {
  return (
    <div className="relative min-h-screen bg-surface-darkest w-full">
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "authorities/auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
