const express = require("express");

const {
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
  getAllPayments,
  getDashboard
} = require("../controllers/adminController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/patients",
  protect,
  authorize("admin"),
  getAllPatients
);

router.get(
  "/doctors",
  protect,
  authorize("admin"),
  getAllDoctors
);

router.get(
  "/appointments",
  protect,
  authorize("admin"),
  getAllAppointments
);

router.get(
  "/payments",
  protect,
  authorize("admin"),
  getAllPayments
);

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboard
);

module.exports = router;