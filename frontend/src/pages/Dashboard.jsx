import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import SubjectCard from "../components/SubjectCard";
import StatsCard from "../components/StatsCard";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subjects", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async (subjectId, attendanceData) => {
    try {
      await axios.put(
        `http://localhost:5000/api/subjects/${subjectId}`,
        attendanceData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      await fetchSubjects();
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert("Failed to update attendance. Please try again.");
    }
  };

  const handleUpdateName = async (subjectId, newName) => {
    try {
      await axios.put(
        `http://localhost:5000/api/subjects/${subjectId}/name`,
        { subjectName: newName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      await fetchSubjects();
      return true;
    } catch (err) {
      console.error("Error updating subject name:", err);
      alert(err.response?.data?.message || "Failed to update subject name.");
      return false;
    }
  };

  const handleDelete = async (subjectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      await fetchSubjects();
      return true;
    } catch (err) {
      console.error("Error deleting subject:", err);
      alert("Failed to delete subject. Please try again.");
      return false;
    }
  };

  const calculateStats = () => {
    if (!subjects || subjects.length === 0)
      return {
        totalClasses: 0,
        totalBunked: 0,
        avgAttendance: 0,
        riskySubjects: 0,
      };

    try {
      const totalClasses = subjects.reduce((sum, s) => sum + (s.total || 0), 0);
      const totalPresent = subjects.reduce(
        (sum, s) => sum + (s.present || 0),
        0
      );
      const totalBunked = totalClasses - totalPresent;
      const avgAttendance =
        totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

      const riskySubjects = subjects.filter((s) => {
        if (!s || typeof s.total !== "number" || typeof s.present !== "number")
          return false;
        const percentage = s.total > 0 ? (s.present / s.total) * 100 : 0;
        return percentage < (s.minimumPercentage || 75);
      }).length;

      return { totalClasses, totalBunked, avgAttendance, riskySubjects };
    } catch (error) {
      console.error("Error in calculateStats:", error);
      return {
        totalClasses: 0,
        totalBunked: 0,
        avgAttendance: 0,
        riskySubjects: 0,
      };
    }
  };

  useEffect(() => {
    if (user) fetchSubjects();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="glass-effect rounded-2xl p-6 mb-8 text-white bg-white/10 backdrop-blur-md border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-blue-100">
                Track your attendance and plan your bunks wisely
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/add-subject")}
                className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                + Add Subject
              </button>
              <button
                onClick={() => navigate("/leaderboard")}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🏆 Leaderboard
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        {subjects.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
              <div className="text-3xl font-bold text-blue-600">
                {calculateStats().totalClasses}
              </div>
              <div className="text-sm font-medium text-gray-600 mt-1">
                Total Classes
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                <div className="bg-blue-500 h-2 rounded-full w-full"></div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
              <div className="text-3xl font-bold text-red-600">
                {calculateStats().totalBunked}
              </div>
              <div className="text-sm font-medium text-gray-600 mt-1">
                Classes Bunked
              </div>
              <div className="w-full bg-red-100 rounded-full h-2 mt-3">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (calculateStats().totalBunked /
                        calculateStats().totalClasses) *
                        100 || 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
              <div
                className={`text-3xl font-bold ${
                  calculateStats().avgAttendance >= 75
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {calculateStats().avgAttendance}%
              </div>
              <div className="text-sm font-medium text-gray-600 mt-1">
                Avg Attendance
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full transition-all ${
                    calculateStats().avgAttendance >= 75
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                  style={{ width: `${calculateStats().avgAttendance}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
              <div
                className={`text-3xl font-bold ${
                  calculateStats().riskySubjects > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {calculateStats().riskySubjects}
              </div>
              <div className="text-sm font-medium text-gray-600 mt-1">
                Risky Subjects
              </div>
              <div className="text-2xl mt-2">
                {calculateStats().riskySubjects > 0 ? "⚠️" : "✅"}
              </div>
            </div>
          </div>
        )}

        {/* Subjects Display */}
        {loading ? (
          <div className="text-center py-8 text-white">
            <p>Loading your subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
            <p className="text-gray-500 mb-4">No subjects found.</p>
            <button
              onClick={() => navigate("/add-subject")}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Add Your First Subject
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject._id}
                subject={subject}
                onUpdateAttendance={handleUpdateAttendance}
                onUpdateName={handleUpdateName}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
