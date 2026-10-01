const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment
} = require("../controllers/appointmentController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================
// CREATE APPOINTMENT
// ============================
// Patient only
router.post(
  "/",
  protect,
  authorize("patient"),
  createAppointment
);


// ============================
// GET MY APPOINTMENTS
// ============================
// Patient only
router.get(
  "/my",
  protect,
  authorize("patient"),
  getMyAppointments
);
// ============================
// GET DOCTOR APPOINTMENTS
// ============================
router.get(
  "/doctor/my",
  protect,
  authorize("doctor"),
  getDoctorAppointments
);


// ============================
// UPDATE APPOINTMENT STATUS
// ============================
router.put(
  "/:id/status",
  protect,
  authorize("doctor"),
  updateAppointmentStatus
);

router.put(
  "/:id/cancel",
  protect,
  authorize("patient"),
  cancelAppointment
);

// ============================
// GET SINGLE APPOINTMENT
// ============================
// Patient, Doctor and Admin
router.get(
  "/:id",
  protect,
  authorize("patient", "doctor", "admin"),
  getAppointment
);


module.exports = router;