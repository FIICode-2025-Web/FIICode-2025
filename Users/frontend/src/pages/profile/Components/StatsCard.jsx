import React from 'react'
import { Card, Typography } from "@material-tailwind/react";

const StatsCard = ({ icon, title, userData }) => {
    return (
        <Card className="bg-[#385f4c] md:p-4 h-48 md:h-52 lg:h-64 w-28 md:w-40 lg:w-44 rounded-2xl shadow-md flex flex-col items-center justify-center">
            <div className="w-6 h-6 md:w-10 md:h-10 lg:w-16 lg:h-16 flex items-center justify-center mb-4">
                <img src={icon} alt="Icon" className="max-w-full max-h-full object-contain" />
            </div>
            <p className="text-white font-semibold text-center">
                {title}
            </p>
            <div className="text-xs md:text-sm text-gray-400 text-center">
                Călătorii : <span className="text-white font-medium">{userData?.trips ?? 0}</span><br />
                Distanță: <span className="text-white font-medium">{userData?.distance_km ? userData.distance_km.toFixed(2) : "0.00"} km</span><br />
                Timp total: <span className="text-white font-medium">{userData?.duration_hours ?? 0} ore</span><br />
                Preț total: <span className="text-white font-medium">{userData?.total_cost ?? 0} RON</span>
            </div>

        </Card>

    )
}

export default StatsCard