import React from 'react'
import MainComponent from '../Home/Components/MainComponent'
import DashboardNavbar from '@/layouts/DashboardNavbar'

export function Home() {
  return (
    <>
        <DashboardNavbar/>
        <MainComponent/>
    </>
    
  )
}

export default Home