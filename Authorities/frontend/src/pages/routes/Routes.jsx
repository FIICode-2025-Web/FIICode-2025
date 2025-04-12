import DashboardNavbar from "@/layouts/DashboardNavbar";
import { React } from "react";
import RoutesTable from "./Components/RoutesTable";

export default function Routes() {
    return (
        <div className="bg-main-reversed h-screen">
            <DashboardNavbar />
            <div className="p-12">
                <RoutesTable />
            </div>
        </div>
    );
}