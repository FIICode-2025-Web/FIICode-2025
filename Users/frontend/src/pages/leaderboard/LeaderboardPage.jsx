import DashboardNavbar from '@/layouts/DashboardNavbar'
import React from 'react'
import LeaderboardMainComponent from './components/LeaderboardMainComponent'

const LeaderboardPage = () => {
    return (
        <div>
            <DashboardNavbar />
            <div className="p-8 md:p-24 text-white space-y-8 bg-gray-900 min-h-screen">
                <LeaderboardMainComponent />
            </div>
        </div>
    )
}

export default LeaderboardPage