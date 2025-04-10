import "leaflet/dist/leaflet.css";
import FeedbackForm from "./FeedbackForm";

export function FooterSection() {
  return (
    <div className="bg-black text-gray-300 py-12 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center flex-col">
        <div className="mb-12 text-center italic opacity-90">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam minima unde quisquam neque eveniet deserunt, hic ut! Accusantium laboriosam impedit dolorem assumenda adipisci omnis maiores. Voluptatibus harum quis possimus eius.
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
}

export default FooterSection;
