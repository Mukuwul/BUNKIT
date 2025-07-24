import { useState } from "react";

function SubjectCard({ subject, onUpdateAttendance, onUpdateName, onDelete }) {
  const { subjectName, total, present, minimumPercentage = 75 } = subject;
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(subjectName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  // Bunk calculation logic
  const requiredPresent = Math.ceil((minimumPercentage / 100) * total);
  const canBunk = Math.max(0, present - requiredPresent);

  const calculateClassesNeeded = () => {
    if (total === 0 || percentage >= minimumPercentage) return 0;
    const numerator = minimumPercentage * total - 100 * present;
    const denominator = 100 - minimumPercentage;
    return denominator > 0 ? Math.ceil(numerator / denominator) : 0;
  };

  const classesNeeded = calculateClassesNeeded();

  const getStatusColor = () => {
    if (total === 0) return "text-gray-500";
    if (percentage >= minimumPercentage) return "text-green-600";
    if (percentage >= minimumPercentage - 10) return "text-yellow-600";
    return "text-red-600";
  };

  const handleMarkAttendance = async (isPresent) => {
    setLoading(true);
    await onUpdateAttendance(subject._id, {
      total: total + 1,
      present: isPresent ? present + 1 : present,
    });
    setLoading(false);
  };

  const handleNameUpdate = async () => {
    if (newName.trim() === subjectName) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    const success = await onUpdateName(subject._id, newName.trim());
    if (success) {
      setIsEditing(false);
    } else {
      setNewName(subjectName);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const success = await onDelete(subject._id);
    if (!success) {
      setShowDeleteConfirm(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      {/* Colored Header Bar */}
      <div
        className={`h-2 ${
          percentage >= minimumPercentage
            ? "bg-gradient-to-r from-green-400 to-green-600"
            : percentage >= minimumPercentage - 10
            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
            : "bg-gradient-to-r from-red-400 to-red-600"
        }`}
      ></div>

      <div className="p-6">
        {/* Header with edit/delete */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 mr-2">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-xl text-lg font-semibold focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={loading}
                  onKeyPress={(e) => e.key === "Enter" && handleNameUpdate()}
                />
                <button
                  onClick={handleNameUpdate}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(subjectName);
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors shadow-lg"
                >
                  ✕
                </button>
              </div>
            ) : (
              <h2
                className="text-xl font-bold cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2"
                onClick={() => setIsEditing(true)}
                title="Click to edit name"
              >
                <span className="text-2xl">📚</span>
                {subjectName}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold rounded-full">
              Target: {minimumPercentage}%
            </span>
            {!isEditing && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                title="Delete subject"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl">
            <p className="text-red-800 mb-3 font-medium">
              ⚠️ Delete "{subjectName}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg flex-1"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors shadow-lg flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats with better visual hierarchy */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Present:</span>
            <span className="font-bold text-lg">
              {present} / {total}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                percentage >= minimumPercentage
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : percentage >= minimumPercentage - 10
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                  : "bg-gradient-to-r from-red-400 to-red-600"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Attendance:</span>
            <span className={`font-bold text-xl ${getStatusColor()}`}>
              {percentage}%
            </span>
          </div>

          {/* Status message */}
          {total > 0 && (
            <div
              className={`p-4 rounded-xl text-center font-medium ${
                percentage >= minimumPercentage
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {percentage >= minimumPercentage ? (
                canBunk > 0 ? (
                  <div>
                    <div className="text-2xl mb-1">😎</div>
                    <div>
                      Can bunk: <span className="font-bold">{canBunk}</span>{" "}
                      classes
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl mb-1">🎯</div>
                    <div>Perfect attendance!</div>
                  </div>
                )
              ) : classesNeeded > 0 ? (
                <div>
                  <div className="text-2xl mb-1">⚠️</div>
                  <div>
                    Attend next{" "}
                    <span className="font-bold">{classesNeeded}</span> classes
                    to reach {minimumPercentage}%
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl mb-1">🎯</div>
                  <div>Right on target!</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Beautiful attendance buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleMarkAttendance(true)}
            disabled={loading || showDeleteConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "..." : "✅ Present"}
          </button>
          <button
            onClick={() => handleMarkAttendance(false)}
            disabled={loading || showDeleteConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "..." : "❌ Absent"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubjectCard;
