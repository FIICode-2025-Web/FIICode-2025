import { Card, Typography } from "@material-tailwind/react";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
import { useEffect, useState } from "react";
export default function BadgesSection() {
  const [badges, setBadges] = useState([])
  const [inactiveBadges, setInactiveBadges] = useState([])

  const fetchBadges = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://127.0.0.1:8002/api/v1/gamification", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const newBadges = response.data.map((badge) => badge.badge_info);
    setBadges(newBadges);

  }

  const fetchInactiveBadges = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://127.0.0.1:8002/api/v1/gamification/inactive", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const newBadges = response.data.map((badge) => badge.badge_info);
    setInactiveBadges(newBadges);

  }

  useEffect(() => {
    fetchBadges()
    fetchInactiveBadges()
  }, [])


  return (
    <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
      <Typography variant="h5" className="text-white font-semibold">
        Medalii
      </Typography>
      <div className="flex flex-wrap gap-3">
        {badges && badges.map((badge) => {
          return (
            <Tooltip title={badge.description} key={badge.id}>
              <img
                src={`/img/Badges/${badge.identification_name}.png`} alt={badge.name}
                className="w-20 h-20"
              />
            </Tooltip>
          );
        })}
        {inactiveBadges && inactiveBadges.map((badge) => {
          return (
            <Tooltip title={badge.description} key={badge.id}>
              <img
                src={`/img/Badges/${badge.identification_name}.png`} alt={badge.name}
                className="w-20 h-20 filter grayscale"
              />
            </Tooltip>
          );
        })}
      </div>
    </Card>
  );
}
