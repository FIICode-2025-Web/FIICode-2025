import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

export function FooterSection() {
  return (
    <div className="bg-black">
      <div className="flex text-center">
        <div className="flex justify-center m-12 md:m-48 flex-col italic w-screen opacity-90 text-gray-300">
          <div className="mb-12 text-center italic opacity-90">Aplicația a fost realizată pentru a oferi o soluție digitală modernă care facilitează comunicarea eficientă între autorități și utilizatorii mijloacelor de transport din oraș. Scopul principal este de a îmbunătăți experiența călătorilor prin furnizarea de informații în timp real despre rute, posibilitatea de a semnala probleme din trafic, gestionarea notificărilor și personalizarea traseelor în funcție de preferințele utilizatorului. Astfel, aplicația contribuie la un transport public mai transparent, interactiv și adaptat nevoilor cetățenilor, oferind totodată autorităților un instrument util pentru colectarea feedback-ului și luarea unor decizii mai informate.</div>
          © 2025 Vaya. Toate drepturile rezervate.</div>
      </div>
    </div >
  );
}

export default FooterSection;