const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    specialization: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    phone_no: {
      type: String,
      required: true
    },

    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);