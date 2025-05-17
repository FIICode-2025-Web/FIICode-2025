import React from 'react'
import DashboardNavbar from "@/layouts/DashboardNavbar";
import PollutionMainComponent from '../dashboard/Home/Components/PollutionMainComponent';
import ImageAnalyzerSection from './components/ImageAnalyzerSection';
import TrafficOverview from './components/TrafficOverview';

const PollutionSection = () => {
  return (
    <div>
      <DashboardNavbar />
      <PollutionMainComponent />
      <TrafficOverview />
      <ImageAnalyzerSection />
    </div>
  )
}

export default PollutionSection