import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Typography } from "@material-tailwind/react";
import SearchableSelect from "@/pages/dashboard/Home/Components/SearchSelects/SearchableSelect";
import axios from "axios";

export function ViewReportDialog({ open, onClose, report }) {
  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-green-700">{report.title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" className="text-gray-600 mb-2 italic">
          Rută: {report.route}
        </Typography>
        <Typography variant="body1" className="text-gray-800 whitespace-pre-wrap">
          {report.message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="success">
          Închide
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const handleAddReport = async (
  newTitle, 
  newMessage, 
  newRoute, 
  setReports, 
  setOpenAdd, 
  setNewTitle, 
  setNewMessage, 
  setNewRoute
) => {
  if (!newTitle || !newMessage || !newRoute) {
    alert("Please fill in all fields");
    return;
  }

  const newReport = {
    title: newTitle,
    message: newMessage,
    route: newRoute,
    isReviewed: false,
    datePosted: new Date().toISOString(),
  };

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post('http://127.0.0.1:8002/api/v1/report/', newReport,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setReports(prev => [response.data, ...prev]);
    setOpenAdd(false);
    setNewTitle("");
    setNewMessage("");
    setNewRoute("");
  } catch (error) {
    console.error("Error adding report:", error);
    alert("There was an error while submitting the report.");
  }
};

export function AddReportDialog({
  open,
  onClose,
  newTitle,
  setNewTitle,
  newMessage,
  setNewMessage,
  newRoute,
  setNewRoute,
  routes,
  setReports,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-green-700">Adaugă Raport</DialogTitle>
      <DialogContent className="space-y-4 pt-2">
        <TextField
          fullWidth
          label="Titlu"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <SearchableSelect
          routes={routes}
          selectedRoute={newRoute}
          handleRouteChange={(e) => setNewRoute(e.target.value)}
          clearShape={() => {}}
          onClear={() => setNewRoute("")}
        />
        <TextField
          fullWidth
          label="Mesaj"
          multiline
          rows={5}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anulează</Button>
        <Button
          color="success"
          variant="contained"
          onClick={() => handleAddReport(newTitle, newMessage, newRoute, setReports, onClose, setNewTitle, setNewMessage, setNewRoute)}
        >
          Salvează
        </Button>
      </DialogActions>
    </Dialog>
  );
}