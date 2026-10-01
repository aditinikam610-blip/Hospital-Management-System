const express = require("express");

const {
  createDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor
} = require("../controllers/doctorController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================
// CREATE DOCTOR
// ============================
// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createDoctor
);


// ============================
// GET ALL DOCTORS
// ============================
// Patients, doctors and admins can view doctors
router.get(
  "/",
  protect,
  authorize("patient", "doctor", "admin"),
  getAllDoctors
);


// ============================
// GET SINGLE DOCTOR
// ============================
router.get(
  "/:id",
  protect,
  authorize("patient", "doctor", "admin"),
  getDoctor
);


// ============================
// UPDATE OWN DOCTOR PROFILE
// ============================
router.put(
  "/profile",
  protect,
  authorize("doctor"),
  updateDoctor
);


module.exports = router;