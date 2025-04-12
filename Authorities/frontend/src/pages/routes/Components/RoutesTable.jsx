import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const RoutesTable = ({ routes}) => {
    const [activeRoutes, setActiveRoutes] = useState(() =>
        routes.reduce((acc, route) => {
          acc[route.route_id] = route.disabled ?? false;
          return acc;
        }, {})
      );

    const [searchQuery, setSearchQuery] = useState("");

    const sendNotificationAboutRoute = async (routeNumber) => {
        const token = localStorage.getItem("token");
        try {
            const message = `Ruta ${routeNumber} e blocata`;
            const response = await axios.post(`http://127.0.0.1:8001/api/v1/notification/?message=${message}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                toast.success("Notificare trimisa cu succes");
            } else {
                toast.error("Trimiterea notificarii a esuat");
            }
        } catch (error) {
            let errorMessage = "Trimiterea notificarii a esuat";
            if (axios.isAxiosError(error) && error.response) {
                console.error("Server response:", error.response);
                if (error.response.data) {
                    errorMessage += ": " + error.response.data.message;
                }
            } else if (error instanceof Error) {
                errorMessage += ": " + error.message;
            }
        }
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRoutes = routes.filter((route) =>
        route.route_short_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatRouteLabel = (label) => {
        const parts = label.split("-");
        return parts.length > 1 ? parts.slice(1).join("-").trim() : label;
    };

    return (
        <>
            <Typography variant="h4" className="mb-4 text-primary">
                Rutele disponibile
            </Typography>
            <TextField
                label="Cauta dupa rută"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                className="rounded-t-md shadow-md"
                sx={{ backgroundColor: 'white', marginTop: '2rem', width: '17rem' }}
            />

            <TableContainer
                component={Paper}
                className="rounded-b-md shadow-md"
                sx={{ maxHeight: 500, overflowY: 'auto' }}
            >
                <Table stickyHeader>
                    <TableHead className="bg-primary">
                        <TableRow>
                            <TableCell className="font-semibold text-green-800">Ruta</TableCell>
                            <TableCell className="font-semibold text-green-800">Traseul</TableCell>
                            <TableCell className="font-semibold text-green-800">Activa?</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRoutes.map((route) => (
                            <TableRow key={route.route_short_name}>
                                <TableCell>{route.route_short_name}</TableCell>
                                <TableCell>{formatRouteLabel(route.label)}</TableCell>
                                <TableCell>
                                    <button
                                        onClick={async () => {
                                            const token = localStorage.getItem("token");
                                            try {
                                                const response = await axios.patch(
                                                    `http://127.0.0.1:8001/api/v1/tranzy/routes/disable/${route.route_id}`,
                                                    {},
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    }
                                                );

                                                if (response.status === 200) {
                                                    setActiveRoutes((prev) => ({
                                                        ...prev,
                                                        [route.route_id]: !prev[route.route_id],
                                                    }));
                                                    toast.success(
                                                        `Ruta ${route.route_short_name} a fost ${activeRoutes[route.route_id] ? "activată" : "dezactivată"
                                                        } cu succes`
                                                    );
                                                    sendNotificationAboutRoute(routeNumber);
                                                }
                                            } catch (error) {
                                                // toast.error("Eroare la actualizarea rutei");
                                                console.error("PATCH error:", error);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded ${activeRoutes[route.route_id] ? "bg-primary" : "bg-red-500"
                                            } text-white font-semibold hover:opacity-80 transition`}
                                    >
                                        {activeRoutes[route.route_id] ? "Activează" : "Dezactivează"}
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default RoutesTable;
