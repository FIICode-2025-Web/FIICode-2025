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
  useTheme,
  CircularProgress
} from "@mui/material";
import { EyeIcon, CheckCircleIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function RequestsTable() {
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reportsList, setReportsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


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

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://127.0.0.1:8001/api/v1/report/", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const enrichedReports = await Promise.all(
          response.data.map(async (report) => {
            const userDetails = await fetchUserDetails(report.user_id);
            return {
              ...report,
              user_email: userDetails?.email || "N/A"
            };
          })
        );

        setReportsList(enrichedReports);
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
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.status === 200) {
        toast.success("Raportul a fost marcat ca rezolvat!");
        setReportsList((prev) =>
          prev.map((r) =>
            r.id === review_id ? { ...r, isReviewed: true } : r
          )
        );
      }
    } catch (error) {
      toast.error("Eroare la marcare raport!");
    }
  };
  

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8001/api/v1/authorities/user/${userId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      return null;
    }
  }

  return (
    <>
      <Typography variant={isSmallScreen ? "h5" : "h4"} className="mb-4 text-primary">
        Gestionează rapoartele de trafic
      </Typography>

      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress color="success" />
        </div>
      ) : (
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
              {reportsList?.map((req, index) => (
                <TableRow key={index} hover>
                  <TableCell className="xs:text-xs">{req.user_email}</TableCell>
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
                      Verifică
                    </Button>
                    {!req.isReviewed ? (
                      <Button
                        variant="outlined"
                        color="success"
                        size={isSmallScreen ? "small" : "medium"}
                        className="normal-case text-sm"
                        startIcon={<CheckCircleIcon className="h-4 w-4" />}
                        onClick={() => handleReviewReport(req.id)}
                      >
                        Confirmă
                      </Button>) :
                      <Button
                        variant="contained"
                        color="success"
                        size={isSmallScreen ? "small" : "medium"}
                        className="normal-case text-s"
                        startIcon={<CheckCircleIcon className="h-4 w-4" />}
                      >
                        Rezolvat
                      </Button>}
                    <Button
                      variant="outlined"
                      color="success"
                      size={isSmallScreen ? "small" : "medium"}
                      className="normal-case text-sm"
                      startIcon={<WrenchIcon className="h-4 w-4" />}
                      onClick={() => navigate("/authorities/dashboard/routes")}
                    >
                      Gestionează
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="text-green-700">
          {selectedRequest?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" className="text-gray-600 mb-2 italic">
            Rută: {selectedRequest?.route}
          </Typography>
          <Typography variant="body1" className="text-gray-800 whitespace-pre-wrap">
            {selectedRequest?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="success">
            Închide
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
