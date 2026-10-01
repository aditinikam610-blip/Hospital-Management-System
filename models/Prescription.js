const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    diagnosis: {
      type: String,
      required: true,
      trim: true
    },

    medicines: {
      type: String,
      required: true,
      trim: true
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

module.exports = mongoose.model("Prescription", prescriptionSchema);