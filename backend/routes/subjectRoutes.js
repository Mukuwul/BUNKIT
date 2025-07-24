const express = require("express");
const router = express.Router();
const {
  createSubject,
  getSubjects,
  updateAttendance,
  updateSubjectName,
  deleteSubject,
} = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSubject);
router.get("/", protect, getSubjects);
router.put("/:id", protect, updateAttendance);
router.put("/:id/name", protect, updateSubjectName);
router.delete("/:id", protect, deleteSubject);

module.exports = router;
