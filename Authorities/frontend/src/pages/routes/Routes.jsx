import DashboardNavbar from "@/layouts/DashboardNavbar";
import { React, useState, useEffect } from "react";
import RoutesTable from "./Components/RoutesTable";
import axios from "axios";

export default function Routes() {
    const [routes, setRoutes] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("token");
    
        const fetchRoutes = async () => {
          try {
            const response = await axios.get("http://127.0.0.1:8003/api/v1/tranzy/routes", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const routesData = response.data.map((route) => ({
              ...route,
              label: `${route.route_short_name} - ${route.route_long_name}`,
            }));
            setRoutes(routesData);
          } catch (error) {
            console.error("Error fetching routes:", error);
          }
        };
        fetchRoutes();
      }, []);

    return (
        <div className="bg-main-reversed h-screen">
            <DashboardNavbar />
            <div className="p-12">
                <RoutesTable routes={routes} />
            </div>
        </div>
    );
}