import {
    Button,
    CircularProgress,
  } from "@mui/material";
  import { EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
  import { useState, useEffect } from "react";
  import { Card, Typography } from "@material-tailwind/react";
  import { ViewReportDialog, AddReportDialog } from './ReportDialog';
  import axios from "axios";
  
  export default function ReportsSection() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openView, setOpenView] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
  
    const [openAdd, setOpenAdd] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newRoute, setNewRoute] = useState("");
    const [routes, setRoutes] = useState([]);
  
    const handleView = (report) => {
      setSelectedReport(report);
      setOpenView(true);
    };
  
    const handleCloseView = () => {
      setOpenView(false);
      setSelectedReport(null);
    };
  
    const handleAddReport = () => {
      if (!newTitle || !newMessage || !newRoute) return;
  
      const selectedLabel = routes.find(r => r.route_short_name === newRoute)?.label || newRoute;
      const newReport = {
        id: Date.now(),
        title: newTitle,
        message: newMessage,
        route: selectedLabel,
        isReviewed: false,
        datePosted: new Date().toISOString(),
      };
  
      setReports(prev => [newReport, ...prev]);
      setOpenAdd(false);
      setNewTitle("");
      setNewMessage("");
      setNewRoute("");
    };
  
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
          console.log("ROUTES:", routes);
        } catch (error) {
          console.error("Error fetching routes:", error);
        }
      };
  
      fetchRoutes();
    }, []);
  
    useEffect(() => {
      const fetchReports = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://127.0.0.1:8002/api/v1/report/", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const fetchedReports = response.data.map(report => ({
            ...report,
            route: routes.find(route => route.route_short_name === report.route)?.label || "Unknown Route",
          }));
  
          setReports(fetchedReports);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching reports:", error);
          setLoading(false);
        }
      };
  
      fetchReports();
    }, [routes]);
  
    return (
      <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <Typography variant="h5" className="text-white font-semibold">
            Rapoartele tale
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenAdd(true)}
            startIcon={<PlusIcon className="h-4 w-4" />}
            sx={{
              backgroundColor: "#4ead61",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#5bcf72",
              },
            }}
          >
            Adaugă raport
          </Button>
        </div>
  
        {loading ? (
          <div className="flex justify-center mt-10">
            <CircularProgress color="success" />
          </div>
        ) : reports.length === 0 ? (
          <Typography className="text-gray-400 text-sm">
            Nu ai rapoarte momentan.
          </Typography>
        ) : (
          <div className="max-h-[18rem] overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-gray-700 p-4 rounded-xl shadow flex flex-col space-y-2"
              >
                <div className="flex justify-between items-center">
                  <Typography className="text-white font-medium">
                    {report.title}
                  </Typography>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      report.isReviewed ? "bg-green-600" : "bg-yellow-600"
                    } text-white`}
                  >
                    {report.isReviewed ? "Rezolvat" : "Nerezolvat"}
                  </span>
                </div>
                <Typography className="text-gray-400 text-sm italic">
                  Rută: {report.route}
                </Typography>
                <Typography className="text-gray-400 text-sm">
                  {new Date(report.datePosted).toLocaleString()}
                </Typography>
                <div className="flex">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleView(report)}
                    startIcon={<EyeIcon className="h-4 w-4" />}
                    sx={{
                      color: "white",
                      borderColor: "white",
                      minWidth: 0,
                      paddingX: 1.5,
                      paddingY: 0.5,
                      "& .MuiButton-startIcon": {
                        marginRight: "6px",
                      },
                      "&:hover": {
                        borderColor: "#e5e7eb",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                    className="normal-case text-sm"
                  >
                    Vezi
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
  
        <ViewReportDialog open={openView} onClose={handleCloseView} report={selectedReport} />
        <AddReportDialog
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          newRoute={newRoute}
          setNewRoute={setNewRoute}
          routes={routes}
          handleAddReport={handleAddReport}
          setReports={setReports}
        />
      </Card>
    );
  }
  