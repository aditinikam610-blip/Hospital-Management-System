const express = require("express");

const {
  register,
  login
} = require("../controllers/authController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected Test Route
router.get("/test", protect, (req, res) => {
  res.json({
    success: true,
    message: "JWT Authentication Working",
    user: req.user
  });
});

module.exports = router;