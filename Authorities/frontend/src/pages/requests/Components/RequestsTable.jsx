import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { EyeIcon, CheckCircleIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const dummyRequests = [
  {
    user: "john.doe@example.com",
    title: "Pothole on Main Street",
    message: "There’s a pothole on Main Street near 3rd Ave.",
    route: "Main Street - 3rd Ave",
  },
  {
    user: "jane.smith@example.com",
    title: "Traffic Light Issue",
    message: "Traffic light not working at Elm & Pine.",
    route: "Elm Street - Pine Blvd",
  },
  {
    user: "mark.johnson@example.com",
    title: "Flooded Road",
    message: "Road flooded after heavy rain on 5th Ave.",
    route: "5th Avenue - River Rd",
  },
  {
    user: "alice.williams@example.com",
    title: "Street Light Flickering",
    message: "Street light flickering near Oak & 2nd.",
    route: "Oak Street - 2nd Avenue",
  },
  {
    user: "bob.martin@example.com",
    title: "Broken Stop Sign",
    message: "Stop sign is broken on Maple & Birch.",
    route: "Maple Ave - Birch Rd",
  },
  {
    user: "carla.reed@example.com",
    title: "Graffiti on Wall",
    message: "Graffiti on public building wall.",
    route: "7th Street - Downtown",
  },
  {
    user: "daniel.fox@example.com",
    title: "Blocked Sidewalk",
    message: "Sidewalk blocked by fallen tree.",
    route: "Lincoln Blvd - 10th Ave",
  },
  {
    user: "emily.king@example.com",
    title: "Leaking Hydrant",
    message: "Hydrant leaking near Baker St.",
    route: "Baker Street - Garden Ln",
  },
  {
    user: "frank.bishop@example.com",
    title: "Abandoned Car",
    message: "Abandoned car parked for weeks.",
    route: "12th Ave - Oak Street",
  },
  {
    user: "grace.woods@example.com",
    title: "Animal on Road",
    message: "Stray dog running into traffic.",
    route: "Pine Rd - Cedar Loop",
  },
];

export default function RequestsTable() {
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleView = (req) => {
    setSelectedRequest(req);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRequest(null);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Typography variant={isSmallScreen ? "h5" : "h4"} className="mb-4 text-primary">
        Gestionează rapoartele de trafic
      </Typography>
      <TableContainer
        component={Paper}
        className="rounded-xl shadow-md mt-6"
        sx={{
          maxHeight: 600,
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead className="bg-primary">
            <TableRow className="bg-green-100">
              <TableCell className="font-semibold text-green-800">Utilizator</TableCell>
              <TableCell className="font-semibold text-green-800">Titlul raportului</TableCell>
              <TableCell className="font-semibold text-green-800">Ruta</TableCell>
              <TableCell className="font-semibold text-green-800">Acțiuni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyRequests.map((req, index) => (
              <TableRow key={index} hover>
                <TableCell>{req.user}</TableCell>
                <TableCell>{req.title}</TableCell>
                <TableCell>{req.route}</TableCell>
                <TableCell className="lg:space-x-2">
                  <Button
                    variant="outlined"
                    color="success"
                    size={isSmallScreen ? "small" : "medium"}
                    className="normal-case text-sm"
                    onClick={() => handleView(req)}
                    startIcon={<EyeIcon className="h-4 w-4" />}
                  >
                    Vizualizează
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    size={isSmallScreen ? "small" : "medium"}
                    className="normal-case text-sm"
                    startIcon={<CheckCircleIcon className="h-4 w-4" />}
                  >
                    Marchează ca rezolvat
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    size={isSmallScreen ? "small" : "medium"}
                    className="normal-case text-sm"
                    startIcon={<WrenchIcon className="h-4 w-4" />}
                  >
                    Gestionează
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="text-green-700">
          {selectedRequest?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="text-gray-800">
            {selectedRequest?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="success">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
