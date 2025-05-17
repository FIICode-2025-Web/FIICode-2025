import React from 'react'
import DashboardNavbar from "@/layouts/DashboardNavbar";
import RecordNoise from './components/RecordNoise';
import PollutionMainComponent from '../dashboard/Home/Components/PollutionMainComponent';

const PollutionSection = () => {
  return (
        <div>
          <DashboardNavbar />
          <PollutionMainComponent/>
        </div>
  )
}

export default PollutionSection