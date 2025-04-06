import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const RoutesTable = ({ routes }) => {
    const [activeRoutes, setActiveRoutes] = useState(
        routes.reduce((acc, route) => {
            acc[route.route_short_name] = route.isActive || false;
            return acc;
        }, {})
    );

    const [searchQuery, setSearchQuery] = useState("");

    const handleCheckboxChange = (routeNumber) => {
        sendNotificationAboutRoute(routeNumber);
        setActiveRoutes((prev) => ({
            ...prev,
            [routeNumber]: !prev[routeNumber],
        }));
    };

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
                sx={{ maxHeight: 650, overflowY: 'auto' }}
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
                                    <Checkbox
                                        checked={activeRoutes[route.route_short_name] || false}
                                        onChange={() => handleCheckboxChange(route.route_short_name)}
                                        color="success"
                                    />
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
