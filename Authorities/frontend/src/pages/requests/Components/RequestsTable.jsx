import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, useMediaQuery, useTheme, CircularProgress, Menu, MenuItem
} from "@mui/material";
import { EyeIcon, CheckCircleIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RequestsTable() {
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reportsList, setReportsList] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const openFilter = Boolean(anchorEl);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleClickFilter = (event) => setAnchorEl(event.currentTarget);
  const handleCloseFilter = () => setAnchorEl(null);

  const handleView = (req) => {
    setSelectedRequest(req);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRequest(null);
  };

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://127.0.0.1:8001/api/v1/report/", {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` }
        });

        const enriched = await Promise.all(
          response.data.map(async (report) => {
            const user = await fetchUserDetails(report.user_id);
            return { ...report, user_email: user?.email || "N/A" };
          })
        );

        setReportsList(enriched);
        setFilteredReports(enriched);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleReviewReport = async (review_id) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8001/api/v1/report/report_id?report_id=${review_id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.status === 200) {
        toast.success("Raportul a fost marcat ca rezolvat!");
        const updated = reportsList.map((r) =>
          r.id === review_id ? { ...r, isReviewed: true } : r
        );
        setReportsList(updated);
        setFilteredReports(updated);
      }
    } catch (error) {
      toast.error("Eroare la marcare raport!");
    }
  };


  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8001/api/v1/authorities/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return response.data;
    } catch (error) {
      return null;
    }
  };

  const applyFilter = (type) => {
    let sorted = [...reportsList];
    if (type === "user") {
      sorted.sort((a, b) => a.user_email.localeCompare(b.user_email));
    } else if (type === "date") {
      sorted.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    } else if (type === "resolved") {
      sorted.sort((a, b) => b.isReviewed - a.isReviewed);
    } else if (type === "unresolved") {
      sorted.sort((a, b) => a.isReviewed - b.isReviewed);
    }
    setFilteredReports(sorted);
    handleCloseFilter();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Typography variant={isSmallScreen ? "h5" : "h4"} className="mb-4 text-primary">
          Gestionează rapoartele de trafic
        </Typography>
        <div>
          <Button variant="contained" color="success" onClick={handleClickFilter}>
            Filtrează
          </Button>
          <Menu anchorEl={anchorEl} open={openFilter} onClose={handleCloseFilter}>
            <MenuItem onClick={() => applyFilter("user")}>Utilizator</MenuItem>
            <MenuItem onClick={() => applyFilter("date")}>Dată</MenuItem>
            <MenuItem onClick={() => applyFilter("resolved")}>Rezolvat</MenuItem>
            <MenuItem onClick={() => applyFilter("unresolved")}>Nerezolvat</MenuItem>
          </Menu>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress color="success" />
        </div>
      ) : (
        <TableContainer component={Paper} className="rounded-xl shadow-md mt-6" sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow className="bg-green-100">
                <TableCell className="font-semibold text-green-800">Utilizator</TableCell>
                <TableCell className="font-semibold text-green-800">Titlul raportului</TableCell>
                <TableCell className="font-semibold text-green-800">Ruta</TableCell>
                <TableCell className="font-semibold text-green-800">Acțiuni</TableCell>
                <TableCell className="font-semibold text-green-800">Primit la</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((req) => (
                <TableRow key={req.id} hover>
                  <TableCell>{req.user_email}</TableCell>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>{req.route}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outlined" color="success" size={isSmallScreen ? "small" : "medium"}
                      className="normal-case text-sm" onClick={() => handleView(req)}
                      startIcon={<EyeIcon className="h-4 w-4" />}
                    >
                      Verifică
                    </Button>
                    {!req.isReviewed ? (
                      <Button variant="outlined" color="success" size={isSmallScreen ? "small" : "medium"}
                        className="normal-case text-sm"
                        startIcon={<CheckCircleIcon className="h-4 w-4" />}
                        onClick={() => handleReviewReport(req.id)}
                      >
                        Confirmă
                      </Button>
                    ) : (
                      <Button variant="contained" color="success" size={isSmallScreen ? "small" : "medium"}
                        className="normal-case text-sm"
                        startIcon={<CheckCircleIcon className="h-4 w-4" />}
                      >
                        Rezolvat
                      </Button>
                    )}
                    <Button variant="outlined" color="success" size={isSmallScreen ? "small" : "medium"}
                      className="normal-case text-sm"
                      startIcon={<WrenchIcon className="h-4 w-4" />}
                      onClick={() => navigate("/authorities/dashboard/routes")}
                    >
                      Gestionează
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(req.datePosted).toLocaleString("ro-RO", {
                      dateStyle: "short",
                      timeStyle: "short"
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="text-green-700">{selectedRequest?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" className="text-gray-600 mb-2 italic">
            Rută: {selectedRequest?.route}
          </Typography>
          <Typography variant="body1" className="text-gray-800 whitespace-pre-wrap">
            {selectedRequest?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="success">Închide</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
