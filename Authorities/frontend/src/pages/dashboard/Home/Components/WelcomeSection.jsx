import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import logo from '../../../../img/logo-vaya.png'

export function WelcomeSection() {
  return (
    <div className="bg-main-reversed h-[47rem]">
      <div className="flex">
        <div className="flex justify-center ml-48 mt-64 flex-col italic w-screen opacity-90">
          <div> 
            <img src={logo} alt="logo" className="w-[28rem]"/>
          </div>
          <div className="text-[1.9rem] my-6 text-gray-300">
          Călătorește rapid, simplu, eficient!
          </div>
        </div>
      </div>
    </div >
  );
}

export default WelcomeSection;