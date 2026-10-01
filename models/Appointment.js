const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Cancelled", "Completed"],
      default: "Pending"
    },

    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);