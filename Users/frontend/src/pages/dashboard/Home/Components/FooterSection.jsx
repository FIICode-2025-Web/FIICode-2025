import "leaflet/dist/leaflet.css";
import FeedbackForm from "./FeedbackForm";

export function FooterSection() {
  return (
    <div className="bg-black text-gray-300 py-12 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center flex-col gap-4">
        <FeedbackForm />
        <div className="mb-12 text-center italic opacity-90">Aplicația a fost realizată pentru a oferi o soluție digitală modernă care facilitează comunicarea eficientă între autorități și utilizatorii mijloacelor de transport din oraș. Scopul principal este de a îmbunătăți experiența călătorilor prin furnizarea de informații în timp real despre rute, posibilitatea de a semnala probleme din trafic, gestionarea notificărilor și personalizarea traseelor în funcție de preferințele utilizatorului. Astfel, aplicația contribuie la un transport public mai transparent, interactiv și adaptat nevoilor cetățenilor, oferind totodată autorităților un instrument util pentru colectarea feedback-ului și luarea unor decizii mai informate.</div>
        © 2025 Vaya. Toate drepturile rezervate.
      </div>
    </div>
  );
}

export default FooterSection;
