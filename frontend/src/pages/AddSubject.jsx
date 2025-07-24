import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AddSubject() {
  const [subjectName, setSubjectName] = useState("");
  const [minimumPercentage, setMinimumPercentage] = useState(75);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/subjects",
        { subjectName, minimumPercentage },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSubjectName("");
      setMinimumPercentage(75);
      setMessage("✅ Subject added successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong.";
      setMessage("❌ " + errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">📚</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Add New Subject
          </h2>
          <p className="text-gray-600">Create a subject to track attendance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Attendance Required (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={minimumPercentage}
              onChange={(e) => setMinimumPercentage(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="
              w-full py-3
              bg-gradient-to-tr from-indigo-500 via-purple-700 to-indigo-700
              text-white text-base font-semibold rounded-lg
              transition-all duration-200
              shadow-lg
              hover:from-indigo-600 hover:via-purple-800 hover:to-indigo-800
              hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
              active:scale-95
              tracking-wide
            "
          >
            Add Subject
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl text-center ${
              message.includes("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddSubject;
