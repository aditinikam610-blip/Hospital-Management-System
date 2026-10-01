const express = require("express");

const {
  createPrescription
} = require("../controllers/prescriptionController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("doctor"),
  createPrescription
);

module.exports = router;