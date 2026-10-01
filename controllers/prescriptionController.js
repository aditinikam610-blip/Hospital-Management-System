const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// CREATE PRESCRIPTION
const createPrescription = async (req, res) => {
  try {
    const { diagnosis, medicines, appointment_id } = req.body;

    if (!diagnosis || !medicines || !appointment_id) {
      return res.status(400).json({
        success: false,
        message: "Diagnosis, medicines and appointment are required"
      });
    }

    const doctor = await Doctor.findOne({
      account_id: req.user.id
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointment_id,
      doctor_id: doctor._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (appointment.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Prescription can be created only for an accepted appointment"
      });
    }

    const existingPrescription = await Prescription.findOne({
      appointment_id
    });

    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message: "Prescription already exists for this appointment"
      });
    }

    const prescription = await Prescription.create({
      diagnosis,
      medicines,
      appointment_id
    });

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create prescription"
    });
  }
};

module.exports = {
  createPrescription
};