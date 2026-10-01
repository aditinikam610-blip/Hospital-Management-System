const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0
    },

    payment_date: {
      type: Date,
      default: Date.now
    },

    payment_mode: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Online"],
      required: true
    },

    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);