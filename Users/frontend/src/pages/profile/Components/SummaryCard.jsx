import React from 'react'
import { Card, Typography } from "@material-tailwind/react";

const SummaryCard = ({ userData }) => {
    return (

        <Card className="bg-primary md:p-4 h-48 md:h-52 lg:h-64 w-28 md:w-40 w-42 lg:w-44 rounded-2xl shadow-md flex flex-col items-center justify-center">
            <Typography variant="h5" className="text-white text-center font-semibold">
                Rezumat
            </Typography>
            <div className="text-sm text-gray-300 flex flex-col text-center">
                <p>Total bani cheltuiți: <span className="text-white font font-large">{Object.values(userData).reduce((sum, current) => sum + current.total_cost, 0)} RON</span></p>
                <p>Timp total de călătorie: <span className="text-white font-large">{Object.values(userData).reduce((sum, current) => sum + current.duration_hours, 0).toFixed(2)} ore</span></p>
            </div>
        </Card>
    )
}

export default SummaryCard