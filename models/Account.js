const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Account", accountSchema);