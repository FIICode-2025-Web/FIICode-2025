import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    useTheme,
    CircularProgress,
} from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Typography } from "@material-tailwind/react";

export default function FeedbackSection() {
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
                        Authorization: `Bearer ${token}`,
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
        <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
            <Typography
                variant="h5"
                className="text-white font-semibold"
            >
                Recenzii
            </Typography>

            {loading ? (
                <div className="flex justify-center mt-10">
                    <CircularProgress color="success" />
                </div>
            ) : feedbackList.length === 0 ? (
                <Typography className="text-gray-400 text-sm">
                    Nu ai feedback-uri momentan.
                </Typography>
            ) : (
                <div className="max-h-[18rem] overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {feedbackList.map((feedback) => (
                        <div
                            key={feedback.id}
                            className="bg-gray-700 p-4 rounded-xl shadow flex flex-col space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <Typography className="text-white font-medium">
                                    {feedback.title}
                                </Typography>
                                <span
                                    className={`text-xs px-3 py-1 rounded-full font-semibold ${feedback.isReviewed ? "bg-green-600" : "bg-yellow-700"
                                        } text-white`}
                                >
                                    {feedback.isReviewed ? "Revizuit" : "Nevăzut"}
                                </span>
                            </div>
                            <Typography className="text-gray-400 text-sm">
                                {new Date(feedback.datePosted).toLocaleString()}
                            </Typography>
                            <div className="flex">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleView(feedback)}
                                    startIcon={
                                        <EyeIcon className="h-4 w-4" style={{ marginBottom: "2px" }} />
                                    }
                                    sx={{
                                        color: "white",
                                        borderColor: "white",
                                        minWidth: 0,
                                        paddingX: 1.5,
                                        paddingY: 0.5,
                                        "& .MuiButton-startIcon": {
                                            marginRight: "6px",
                                        },
                                        "&:hover": {
                                            borderColor: "#e5e7eb",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                    className="normal-case text-sm"
                                >
                                    Vezi
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle className="text-green-700">
                    {selectedFeedback?.title}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" className="text-gray-800 whitespace-pre-wrap">
                        {selectedFeedback?.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="success">
                        Închide
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
