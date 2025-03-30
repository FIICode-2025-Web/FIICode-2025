import React from 'react'
import { Button } from "@material-tailwind/react";

const DirectionButton = ({ direction, handleDirection }) => {
    return (
        <Button
            variant="text"
            color="blue-gray"
            className="flex items-center justify-center text-primary text-sm h-8 normal-case bg-gray-300" onClick={handleDirection}>
            <span className={`${direction === 0 ? 'text-white' : 'text-black'}`}>
                Tur
            </span>
            / 
            <span className={`${direction === 1 ? 'text-white' : 'text-black'}`}>
                Retur
            </span>
        </Button>
    )
}

export default DirectionButton