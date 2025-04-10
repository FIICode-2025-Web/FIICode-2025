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
import { EyeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";

export function FeedbackTable() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        setFeedbackList(response.data);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <>
      <Typography variant={isSmallScreen ? "h5" : "h4"} className="mb-4 text-primary">
        Feedback utilizatori
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
              <TableCell className="font-semibold text-green-800">Titlul feedback-ului</TableCell>
              <TableCell className="font-semibold text-green-800">Acțiuni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbackList.map((feedback) => (
              <TableRow key={feedback.id} hover>
                <TableCell>{feedback.user}</TableCell>
                <TableCell>{feedback.title}</TableCell>
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
                  <Button
                    variant="outlined"
                    color="success"
                    size={isSmallScreen ? "small" : "medium"}
                    className="normal-case text-sm"
                    startIcon={<CheckCircleIcon className="h-4 w-4" />}
                  >
                    Marchează ca văzut
                  </Button>
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
