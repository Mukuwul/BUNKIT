const Subject = require("../models/Subject");

const createSubject = async (req, res) => {
  try {
    const { subjectName, minimumPercentage = 75 } = req.body;

    const existing = await Subject.findOne({
      user: req.user._id,
      subjectName,
    });
    if (existing) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const subject = await Subject.create({
      subjectName,
      total: 0,
      present: 0,
      minimumPercentage,
      user: req.user._id,
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create subject" });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { total, present } = req.body;

    const subject = await Subject.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (total !== undefined) subject.total = total;
    if (present !== undefined) subject.present = present;

    await subject.save();
    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update attendance" });
  }
};

const updateSubjectName = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName } = req.body;

    const subject = await Subject.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const existing = await Subject.findOne({
      user: req.user._id,
      subjectName,
      _id: { $ne: id },
    });

    if (existing) {
      return res.status(400).json({ message: "Subject name already exists" });
    }

    subject.subjectName = subjectName;
    await subject.save();

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update subject name" });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete subject" });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  updateAttendance,
  updateSubjectName,
  deleteSubject,
};
