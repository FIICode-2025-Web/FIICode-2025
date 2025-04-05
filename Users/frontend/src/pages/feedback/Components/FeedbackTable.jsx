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
  CircularProgress,
} from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";

export function FeedbackTable() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeedback(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchFeedback = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8002/api/v1/feedback/", {
          headers: {
            Authorization: `Bearer ${token}` ,
            Accept: "application/json",
          },
        });
        setFeedbackList(res.data);
      } catch (error) {
        console.error("Failed to fetch feedback", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <>
      <Typography variant={isSmallScreen ? "h5" : "h4"} className="mb-4 text-primary">
        Statusul feedback-urilor tale
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
            <TableHead>
              <TableRow className="bg-green-100">
                <TableCell className="font-semibold text-green-800">Titlu</TableCell>
                <TableCell className="font-semibold text-green-800">Data</TableCell>
                <TableCell className="font-semibold text-green-800">Status</TableCell>
                <TableCell className="font-semibold text-green-800">Actiuni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackList.map((feedback) => (
                <TableRow key={feedback.id} hover>
                  <TableCell>{feedback.title}</TableCell>
                  <TableCell>{new Date(feedback.datePosted).toLocaleString()}</TableCell>
                  <TableCell>{feedback.isReviewed ? "Rezolvat" : "Nerezolvat"}</TableCell>
                  <TableCell className="lg:space-x-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
