import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function FeedbackForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = { title, message };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("http://127.0.0.1:8002/api/v1/feedback/", feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Feedback trimis cu success!");
      }
      setTitle("");
      setMessage("");
    } catch (error) {
      toast.error("A apărut o eroare la trimiterea feedback-ului.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-2/3 bg-gray-900 p-6 rounded-md shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Trimite-ne părerea ta</h2>

      <div>
        <label className="block mb-1">Titlu</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>

      <div>
        <label className="block mb-1">Mesaj</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="w-full p-2 rounded bg-gray-800 text-white"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-primary hover:bg-opacity-80 text-white text-sm font-semibold py-2 px-4 rounded"
      >
        Trimite
      </button>
    </form>
  );
}

export default FeedbackForm;
