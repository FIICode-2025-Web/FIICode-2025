import React from 'react'
import DashboardNavbar from "@/layouts/DashboardNavbar";
import RecordNoise from './components/RecordNoise';
import PollutionMainComponent from '../dashboard/Home/Components/PollutionMainComponent';
import ImageAnalyzerSection from './components/ImageAnalyzerSection';

const PollutionSection = () => {
  return (
        <div>
          <DashboardNavbar />
          <PollutionMainComponent/>
          <ImageAnalyzerSection/>
        </div>
  )
}

export default PollutionSection