import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

export function FooterSection() {
  return (
    <div className="bg-black">
      <div className="flex text-center">
        <div className="flex justify-center m-48 flex-col italic w-screen opacity-90 text-gray-300">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam minima unde quisquam neque eveniet deserunt, hic ut! Accusantium laboriosam impedit dolorem assumenda adipisci omnis maiores. Voluptatibus harum quis possimus eius.
        </div>
      </div>
    </div >
  );
}

export default FooterSection;