import React from 'react'
import MainComponent from '../Home/Components/MainComponent'
import DashboardNavbar from '@/layouts/DashboardNavbar'
import WelcomeSection from './Components/WelcomeSection'
import FooterSection from './Components/FooterSection'

export function Home() {
  return (
    <>
        <DashboardNavbar/>
        <WelcomeSection/>
        <MainComponent/>
        <FooterSection/>
    </>
    
  )
}

export default Home