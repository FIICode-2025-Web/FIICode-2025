import React from 'react'
import { Card, Typography } from "@material-tailwind/react";

const SummaryCard = ({ userData }) => {
    return (
        <Card className="bg-[#385f4c] p-6 h-50 md:w-[500px] rounded-2xl shadow-md space-y-4">
            <Typography variant="h5" className="text-white font-semibold">
                Rezumat
            </Typography>
            <div className="text-sm text-gray-400 flex justify-center items-center">
                <p>Total bani cheltuiți: <span className="text-white font font-medium">{Object.values(userData).reduce((sum, current) => sum + current.total_cost, 0)} RON</span></p>
                <p className="mx-4">|</p>
                <p>Timp total de călătorie: <span className="text-white font-medium">{Object.values(userData).reduce((sum, current) => sum + current.duration_hours, 0)} ore</span></p>
            </div>
        </Card>
    )
}

export default SummaryCard