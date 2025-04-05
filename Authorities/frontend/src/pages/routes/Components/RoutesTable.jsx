import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField } from "@mui/material";

const RoutesTable = ({ routes }) => {
    const [activeRoutes, setActiveRoutes] = useState(
        routes.reduce((acc, route) => {
            acc[route.route_short_name] = route.isActive || false;
            return acc;
        }, {})
    );
    
    const [searchQuery, setSearchQuery] = useState("");

    const handleCheckboxChange = (routeNumber) => {
        setActiveRoutes((prev) => ({
            ...prev,
            [routeNumber]: !prev[routeNumber],
        }));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRoutes = routes.filter((route) =>
        route.route_short_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                className="my-4 bg-primary"
                sx={{ backgroundColor: 'white', marginTop: '2rem', width: '17rem' }} // Set background color to white
            />

            <TableContainer
                component={Paper}
                className="rounded-xl shadow-md mt-6"
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
                                <TableCell>{route.label}</TableCell>
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
