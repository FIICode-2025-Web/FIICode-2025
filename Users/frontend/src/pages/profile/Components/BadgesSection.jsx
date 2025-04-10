import { Card, Typography } from "@material-tailwind/react";
import ecofriendly from "../../../img/badges/ecofriendly.png";
import public_transport_fan from "../../../img/badges/public_transport_fan.png";
import scooter_lover from "../../../img/badges/scooter_lover.png";
import ridesharing from "../../../img/badges/ridesharing.png";
import all_round_traveler from "../../../img/badges/all_round_traveler.png";
import streak_master from "../../../img/badges/streak_master.png";
import early_bird from "../../../img/badges/early_bird.png";
import night_rider from "../../../img/badges/night_rider.png";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default function BadgesSection() {
  return (
    <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
      <Typography variant="h5" className="text-white font-semibold">
        Medalii
      </Typography>
      <div className="flex flex-wrap gap-3">
        <Tooltip title="Delete">
          <img src={ecofriendly} alt="Eco Badge 1" className="w-20 h-20" />
        </Tooltip>
        <Tooltip title="Delete">
          <img src={scooter_lover} alt="Eco Badge 1" className="w-20 h-20" />
        </Tooltip>
        <Tooltip title="Delete">
          <img src={public_transport_fan} alt="Eco Badge 1" className="w-20 h-20" />
        </Tooltip>
        <Tooltip title="Delete">
          <img src={ridesharing} alt="Eco Badge 1" className="w-20 h-20" />
        </Tooltip>
        <Tooltip title="Delete">
          <img src={all_round_traveler} alt="Eco Badge 1" className="w-20 h-20" />
        </Tooltip>
        <Tooltip title="Delete">
          <img src={streak_master} alt="Eco Badge 1" className="w-20 h-20" />
        </Tooltip>
        <Tooltip title="Delete">
          <img src={early_bird} alt="Eco Badge 1" className="w-20 h-20" />
        </Tooltip>
        <Tooltip title="Delete">
          <img src={night_rider} alt="Eco Badge 1" className="w-20 h-20" />
        </Tooltip>
      </div>
    </Card>
  );
}
