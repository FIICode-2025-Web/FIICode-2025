import DashboardNavbar from "@/layouts/DashboardNavbar";
import { TableContainer } from "@mui/material";
import React from "react";
import { FeedbackTable } from "./Components/FeedbackTable";

export default function Feedback() {
    return (
        <div className="bg-main-reversed h-screen">
            <DashboardNavbar />
            <div className="p-12">
                <FeedbackTable />
            </div>
        </div>
    );
}