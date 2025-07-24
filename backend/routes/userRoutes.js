const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Access granted to protected profile route",
    user: req.user,
  });
});

module.exports = router;
