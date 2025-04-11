import { useState } from "react";
import axios from "axios";

function FeedbackForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportsData = { title, message };

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://127.0.0.1:8002/api/v1/reports/", reportsData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus("reports sent successfully!");
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error sending reports:", error);
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Send us your feedback</h2>

      <div>
        <label className="block mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="w-full p-2 rounded bg-gray-700 text-white"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-primary hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded"
      >
        Submit Report
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
  );
}

export default FeedbackForm;
