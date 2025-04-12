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
  Menu,
  MenuItem
} from "@mui/material";
import { EyeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function FeedbackTable() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openFilter = Boolean(anchorEl);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickFilter = (event) => setAnchorEl(event.currentTarget);
  const handleCloseFilter = () => setAnchorEl(null);

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeedback(null);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://127.0.0.1:8001/api/v1/feedback/", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const enrichedReports = await Promise.all(
          response.data.map(async (feedback) => {
            const userDetails = await fetchUserDetails(feedback.user_id);
            return {
              ...feedback,
              user_email: userDetails?.email || "N/A"
            };
          })
        );
        setFeedbackList(enrichedReports);
        setFilteredList(enrichedReports);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      }
    };
    fetchFeedback();
  }, []);

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
      return null;
    }
  };

  const handleReviewFeedback = async (feedback_id) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8001/api/v1/feedback/feedback_id?feedback_id=${feedback_id}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.status === 200) {
        toast.success("Feedback-ul a fost marcat ca văzut!");
        const updated = feedbackList.map((f) =>
          f.id === feedback_id ? { ...f, isReviewed: true } : f
        );
        setFeedbackList(updated);
        setFilteredList(updated);
      }
    } catch (error) {
      toast.error("Eroare la marcare feedback!");
    }
  };

  const applyFilter = (filterType) => {
    let sorted = [...feedbackList];
    if (filterType === "user") {
      sorted.sort((a, b) => a.user_email.localeCompare(b.user_email));
    } else if (filterType === "date") {
      sorted.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    } else if (filterType === "resolved") {
      sorted.sort((a, b) => b.isReviewed - a.isReviewed);
    } else if (filterType === "unresolved") {
      sorted.sort((a, b) => a.isReviewed - b.isReviewed);
    }
    setFilteredList(sorted);
    handleCloseFilter();
  };

  return (
    <>
      <div className="flex items-center justify-between mt-4 mb-2">
        <Typography variant={isSmallScreen ? "h5" : "h4"} className="mb-4 text-primary">
          Feedback utilizatori
        </Typography>
        <div>
          <Button
            variant="contained"
            color="success"
            onClick={handleClickFilter}
            aria-controls={openFilter ? 'basic-menu' : undefined}
            aria-haspopup="true"
          >
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

      <TableContainer
        component={Paper}
        className="rounded-xl shadow-md mt-6"
        sx={{ maxHeight: 600, overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="bg-green-100">
              <TableCell className="font-semibold text-green-800">Utilizator</TableCell>
              <TableCell className="font-semibold text-green-800">Titlul feedback-ului</TableCell>
              <TableCell className="font-semibold text-green-800">Acțiuni</TableCell>
              <TableCell className="font-semibold text-green-800">Primit la</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.map((feedback) => (
              <TableRow key={feedback.id} hover>
                <TableCell>{feedback.user_email}</TableCell>
                <TableCell>{feedback.title}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    size={isSmallScreen ? "small" : "medium"}
                    className="normal-case text-sm"
                    onClick={() => handleView(feedback)}
                    startIcon={<EyeIcon className="h-4 w-4" />}
                  >
                    Vizualizează
                  </Button>
                  {!feedback.isReviewed ? (
                    <Button
                      variant="outlined"
                      color="success"
                      size={isSmallScreen ? "small" : "medium"}
                      className="normal-case text-sm ml-2"
                      onClick={() => handleReviewFeedback(feedback.id)}
                      startIcon={<CheckCircleIcon className="h-4 w-4" />}
                    >
                      Marchează ca văzut
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      size={isSmallScreen ? "small" : "medium"}
                      className="normal-case text-s ml-2"
                      startIcon={<CheckCircleIcon className="h-4 w-4" />}
                    >
                      Rezolvat
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(feedback.datePosted).toLocaleString("ro-RO", {
                    dateStyle: "short",
                    timeStyle: "short"
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="text-green-700">
          {selectedFeedback?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="text-gray-800">
            {selectedFeedback?.message}
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
