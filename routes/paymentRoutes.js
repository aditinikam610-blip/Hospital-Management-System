const express = require("express");

const {
  createPayment,
  getPayment,
  getMyPayments
} = require("../controllers/paymentController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("patient"),
  createPayment
);

router.get(
  "/my",
  protect,
  authorize("patient"),
  getMyPayments
);

router.get(
  "/:id",
  protect,
  authorize("patient", "admin"),
  getPayment
);

module.exports = router;