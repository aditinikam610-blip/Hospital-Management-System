const express = require("express");

const {
  createProfile,
  getProfile,
  updateProfile,
  getAppointments,
  getPrescriptions
} = require("../controllers/patientController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create patient profile
router.post(
  "/profile",
  protect,
  authorize("patient"),
  createProfile
);

// Get patient profile
router.get(
  "/profile",
  protect,
  authorize("patient"),
  getProfile
);


// Update patient profile
router.put(
  "/profile",
  protect,
  authorize("patient"),
  updateProfile
);


// Get patient appointments
router.get(
  "/appointments",
  protect,
  authorize("patient"),
  getAppointments
);


// Get patient prescriptions
router.get(
  "/prescriptions",
  protect,
  authorize("patient"),
  getPrescriptions
);


module.exports = router;