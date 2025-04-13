import React, { useState, useEffect } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@mui/material";
import axios from 'axios';

const NotificationDropdown = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [openNotification, setOpenNotification] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchNotifications();
    }, [open])


    const handleView = (notification) => {
        if (!notification.is_read) {
            handleReadNotification(notification.id)
        }
        setSelectedNotification(notification);
        setOpenNotification(true);
    };

    const handleCloseView = () => {
        setOpenNotification(false);
        setSelectedNotification(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const fetchNotifications = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8002/api/v1/notification/", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const sortedNotifications = response.data.sort(
            (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );

        setNotifications(sortedNotifications);
    }


    const handleReadNotification = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.patch(
                `http://127.0.0.1:8002/api/v1/notification/mark-as-read/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === id ? { ...notif, is_read: true } : notif
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };


    return (
        <div>
            <img className='w-5 h-5 cursor-pointer' src={`/img/bell.png`} alt="notification" onClick={handleClick} />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            width: '18rem',
                            maxHeight: '15rem',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': { display: 'none' },
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',

                        },
                    },
                }}
            >
                {notifications && notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification.id}
                            onClick={() => handleView(notification)}
                            className={`flex flex-col items-start gap-1 ${notification.is_read ? "bg-white" : "bg-gray-100"
                                } hover:bg-gray-200`}
                        >
                            <span className={`text-xs ${notification.is_read ? "font-normal" : "font-semibold"}`}>
                                {notification.message}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(notification.datePosted).toLocaleString("ro-RO", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </span>
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem className="text-sm text-gray-400 italic">Nicio notificare</MenuItem>
                )}
            </Menu>

            <Dialog open={openNotification} onClose={handleCloseView} maxWidth="sm" fullWidth>
                <DialogTitle className="text-green-700 font-bold text-lg flex items-center gap-2">
                    <img src="/img/bell.png" alt="icon" className="w-6 h-6" />
                    <span className={selectedNotification?.type === "route_problem" ? "text-red-600" : "text-green-600"}>
                        Notificare
                    </span>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6" className="text-gray-800 mb-2">
                        {selectedNotification?.message}
                    </Typography>
                    {
                        selectedNotification?.type == "badge" &&
                        <Typography variant="body2" className="text-gray-500 italic">
                            Accesează profilul pentru a o vedea.
                        </Typography>
                    }
                    <Typography variant="body2" className="text-gray-500 italic">
                        Primită la:{" "}
                        {new Date(selectedNotification?.datePosted).toLocaleString("ro-RO", {
                            dateStyle: "full",
                            timeStyle: "short",
                        })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseView} color="success" variant="outlined">
                        Închide
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NotificationDropdown