import React from 'react'
import DashboardNavbar from "@/layouts/DashboardNavbar";
import RecordNoise from './components/RecordNoise';

const PollutionSection = () => {
  return (
        <>
          <DashboardNavbar />
          <div className="p-8 md:p-24 text-white space-y-8 bg-gray-900 min-h-screen">
            <RecordNoise />
          </div>
        </>
  )
}

export default PollutionSection