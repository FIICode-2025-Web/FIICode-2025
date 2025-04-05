import DashboardNavbar from "@/layouts/DashboardNavbar";
import { TableContainer } from "@mui/material";
import React from "react";
import RequestsTable from "./Components/RequestsTable";

export default function Requests() {
    return (
        <div className="bg-main-reversed h-screen">
            <DashboardNavbar />
            <div className="p-12">
                <RequestsTable />
            </div>
        </div>
    );
}