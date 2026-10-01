const express = require("express");

const {
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
  getAllPayments,
  getDashboard,
  createDoctorAccount,
  updateDoctor,
  deleteDoctor,
  updatePatient,
  deletePatient
} = require("../controllers/adminController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================
// PATIENTS
// ============================

router.get(
  "/patients",
  protect,
  authorize("admin"),
  getAllPatients
);

router.put(
  "/patients/:id",
  protect,
  authorize("admin"),
  updatePatient
);

router.delete(
  "/patients/:id",
  protect,
  authorize("admin"),
  deletePatient
);


// ============================
// DOCTORS
// ============================

router.get(
  "/doctors",
  protect,
  authorize("admin"),
  getAllDoctors
);

router.put(
  "/doctors/:id",
  protect,
  authorize("admin"),
  updateDoctor
);

router.delete(
  "/doctors/:id",
  protect,
  authorize("admin"),
  deleteDoctor
);


// ============================
// APPOINTMENTS
// ============================

router.get(
  "/appointments",
  protect,
  authorize("admin"),
  getAllAppointments
);


// ============================
// PAYMENTS
// ============================

router.get(
  "/payments",
  protect,
  authorize("admin"),
  getAllPayments
);


// ============================
// DASHBOARD
// ============================

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboard
);


// ============================
// CREATE DOCTOR
// ============================

router.post(
  "/doctors",
  protect,
  authorize("admin"),
  createDoctorAccount
);

module.exports = router;