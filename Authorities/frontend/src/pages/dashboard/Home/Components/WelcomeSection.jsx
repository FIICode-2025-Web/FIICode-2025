import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import logo from '../../../../img/logo-vaya.png'

export function WelcomeSection() {
  return (
    <div className="bg-main-reversed h-[20rem] md:h-[47rem] min-h-[10rem] md:min-h-fit">
      <div className="flex items-center justify-center">
        <div className="flex md:items-start items-center md:mt-[12rem] mt-[5rem] justify-center md:ml-48 md:mt-64 flex-col italic w-screen opacity-90">
          <div> 
            <img src={logo} alt="logo" className="w-[18rem] md:w-[24rem]"/>
          </div>
          <div className="text-[1.2rem] md:text-[1.7rem] my-6 text-gray-300">
          Călătorește rapid, simplu, eficient!
          </div>
        </div>
      </div>
    </div >
  );
}

export default WelcomeSection;