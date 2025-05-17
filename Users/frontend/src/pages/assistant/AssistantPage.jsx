import DashboardNavbar from '@/layouts/DashboardNavbar'

import React from 'react'
import Assistant from './components/Assistant'

const AssistantPage = () => {

    return (
        <>
            <DashboardNavbar />
            <div className="p-8 md:p-24 text-white space-y-8 bg-gray-900 min-h-screen flex flex-col items-center">
                <Assistant />
            </div>
        </>
    )
}

export default AssistantPage