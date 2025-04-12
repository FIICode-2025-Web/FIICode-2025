import { Card, Typography } from "@material-tailwind/react";
import StatsCard from "./StatsCard";
import buses from '../../../img/buses.png'
import ridesharing from '../../../img/ridesharing.png'
import scooter from '../../../img/scooter.png'
import SummaryCard from "./SummaryCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function StatisticsSections() {
  const [userData, setUserData] = useState([])

  useEffect(() => {
    handleFetchUserData()
  }, [])
  const handleFetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8003/api/v1/tranzy/user-data", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 200) {
        console.log("User data fetched successfully:", response.data);
        setUserData(response.data);
      } else {
        console.error("Failed to fetch user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

  }
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 flex flex-row md:flex-col gap-5">
      <div className="md:flex md:flex-row gap-2 md:gap-6 grid grid-cols-2">
        {userData &&  <StatsCard icon={buses} title="Transport Public" userData={userData.public_transport} />}
        {userData &&  <StatsCard icon={ridesharing} title="Ridesharing" userData={userData.ridesharing} />}
        {userData && <StatsCard icon={scooter} title="Trotinete" userData={userData.scooter} />}
        <SummaryCard userData={userData}/>
      </div>
    </div>
  );
}
