import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchLeaderboard();
  }, [user]);

  const getRankEmoji = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🏆 Bunk Race Leaderboard</h1>
          <p className="text-blue-100">
            Who's the master of strategic bunking?
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p>Loading rankings...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl">
            <div className="text-6xl mb-4">🏁</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No rankings yet!
            </h3>
            <p className="text-gray-600">
              Add subjects and mark attendance to join the race.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((userData, index) => (
              <div
                key={userData._id}
                className={`p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white"
                    : index === 1
                    ? "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-white"
                    : index === 2
                    ? "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white"
                    : "bg-white/95 backdrop-blur-sm text-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`text-4xl font-bold ${
                        index < 3 ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {getRankEmoji(index)}
                    </div>
                    <div>
                      <p
                        className={`text-xl font-bold ${
                          index < 3 ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {userData.name}
                        {userData._id === user._id && (
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              index < 3
                                ? "bg-white/20 text-white"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            You
                          </span>
                        )}
                      </p>
                      <p
                        className={`text-sm ${
                          index < 3 ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {userData.totalSubjects} subjects tracked
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-3xl font-bold ${
                        index < 3 ? "text-white" : "text-red-600"
                      }`}
                    >
                      {userData.totalBunked}
                    </p>
                    <p
                      className={`text-sm ${
                        index < 3 ? "text-white/80" : "text-gray-600"
                      }`}
                    >
                      classes bunked
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
