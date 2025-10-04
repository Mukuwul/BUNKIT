import { useState } from "react";
import ConfirmDialog from './ui/ConfirmDialog';
import { showToast } from '../utils/toast';
import LoadingSpinner from './ui/LoadingSpinner';

function SubjectCard({ subject, onUpdateAttendance, onUpdateName, onDelete }) {
  const { subjectName, total, present, minimumPercentage = 75 } = subject;
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(subjectName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState({ present: false, absent: false });
  const [nameError, setNameError] = useState('');

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

  // Validate subject name
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Subject name cannot be empty';
    }
    if (name.trim().length < 2) {
      return 'Subject name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Subject name must be less than 50 characters';
    }
    return '';
  };

  const handleMarkAttendance = async (isPresent) => {
    const attendanceType = isPresent ? 'present' : 'absent';
    
    try {
      setAttendanceLoading(prev => ({ ...prev, [attendanceType]: true }));
      
      const success = await onUpdateAttendance(subject._id, {
        total: total + 1,
        present: isPresent ? present + 1 : present,
      });

      if (success) {
        showToast.success(
          isPresent 
            ? `Marked present for ${subjectName}` 
            : `Marked absent for ${subjectName}`
        );
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      showToast.error('Failed to update attendance. Please try again.');
    } finally {
      setAttendanceLoading(prev => ({ ...prev, [attendanceType]: false }));
    }
  };

  const handleNameUpdate = async () => {
    const trimmedName = newName.trim();
    
    // Check if name hasn't changed
    if (trimmedName === subjectName) {
      setIsEditing(false);
      setNameError('');
      return;
    }

    // Validate name
    const error = validateName(trimmedName);
    if (error) {
      setNameError(error);
      return;
    }

    try {
      setLoading(true);
      setNameError('');
      
      const success = await onUpdateName(subject._id, trimmedName);
      
      if (success) {
        setIsEditing(false);
        showToast.success(`Subject renamed to "${trimmedName}"`);
      } else {
        setNewName(subjectName);
        showToast.error('Failed to update subject name');
      }
    } catch (error) {
      console.error('Error updating subject name:', error);
      setNewName(subjectName);
      showToast.error('Failed to update subject name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const success = await onDelete(subject._id);
      if (success) {
        showToast.success(`"${subjectName}" deleted successfully`);
      } else {
        showToast.error('Failed to delete subject. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      showToast.error('Failed to delete subject. Please try again.');
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNewName(value);
    
    // Clear error when user starts typing
    if (nameError) {
      setNameError('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName(subjectName);
    setNameError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleNameUpdate();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <>
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
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={handleNameChange}
                      onKeyDown={handleKeyPress}
                      className={`flex-1 px-3 py-2 border-2 rounded-xl text-lg font-semibold focus:outline-none transition-colors ${
                        nameError 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-blue-300 focus:border-blue-500'
                      }`}
                      disabled={loading}
                      placeholder="Enter subject name"
                      maxLength={50}
                    />
                    <button
                      onClick={handleNameUpdate}
                      disabled={loading || !!nameError}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : "✓"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors shadow-lg disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                  {nameError && (
                    <p className="text-red-500 text-sm ml-3">{nameError}</p>
                  )}
                  <p className="text-gray-500 text-xs ml-3">
                    Press Enter to save, Escape to cancel
                  </p>
                </div>
              ) : (
                <h2
                  className="text-xl font-bold cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2"
                  onClick={() => !loading && setIsEditing(true)}
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
                  disabled={loading}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                  title="Delete subject"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>

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
              disabled={loading || isEditing || attendanceLoading.present || attendanceLoading.absent}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {attendanceLoading.present ? (
                <LoadingSpinner size="sm" />
              ) : (
                "✅ Present"
              )}
            </button>
            <button
              onClick={() => handleMarkAttendance(false)}
              disabled={loading || isEditing || attendanceLoading.present || attendanceLoading.absent}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {attendanceLoading.absent ? (
                <LoadingSpinner size="sm" />
              ) : (
                "❌ Absent"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ConfirmDialog for deletion */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete "${subjectName}"? This action cannot be undone and all attendance data will be lost.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}

export default SubjectCard;
