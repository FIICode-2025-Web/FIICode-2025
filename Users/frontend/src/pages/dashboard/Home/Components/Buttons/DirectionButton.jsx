import React from 'react'

const DirectionButton = ({ direction, handleDirection }) => {
    return (
        <button
            className="w-80 flex items-center rounded-md justify-center text-primary text-md h-10 normal-case bg-primary hover:bg-secondary" onClick={handleDirection}>
            <span className={`${direction === 0 ? 'text-white' : 'text-black'}`}>
                Tur
            </span>
            --
            <span className={`${direction === 1 ? 'text-white' : 'text-black'}`}>
                Retur
            </span>
        </button>
    )
}

export default DirectionButton