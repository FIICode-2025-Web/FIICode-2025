import DashboardNavbar from '@/layouts/DashboardNavbar'
import React from 'react'
import Assistant from './components/Assistant'
import "../../../public/css/backgrounds.css";


const AssistantPage = () => {
    return (
        <>
            <DashboardNavbar />
            <div className="flex bg-main backdrop-blur-xl text-white min-h-screen">
                {/* Sidebar Istoric */}
                <aside className="w-64 border-r border-gray-700 p-4 hidden md:flex flex-col bg-gray-800">
                    <h2 className="text-xl font-bold mb-4">Istoric</h2>
                    <ul className="space-y-2 overflow-auto flex-1">
                        <li className="p-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 cursor-pointer bg-gray-700">
                            Conversație cu primăria
                        </li>
                        <li className="p-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 cursor-pointer">
                            Reclamație gunoi sector 3
                        </li>
                        <li className="p-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 cursor-pointer">
                            Informații taxe și impozite
                        </li>
                        <li className="p-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 cursor-pointer">
                            Programare audiență
                        </li>
                    </ul>
                </aside>

                {/* Chat principal */}
                <main className="flex-1 flex flex-col items-center p-4 md:p-8">
                    <div className="w-full max-w-4xl">
                        <Assistant />
                    </div>
                </main>
            </div>
        </>
    )
}

export default AssistantPage
