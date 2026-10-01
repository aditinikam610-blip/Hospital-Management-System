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
        message:
          "Prescription can be created only for an accepted appointment"
      });
    }

    const existingPrescription = await Prescription.findOne({
      appointment_id
    });

    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message:
          "Prescription already exists for this appointment"
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
    console.error("Create prescription error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create prescription"
    });
  }
};


// GET ALL PRESCRIPTIONS - ADMIN
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate({
        path: "appointment_id",
        populate: [
          {
            path: "patient_id",
            select: "name age gender phone_no address account_id"
          },
          {
            path: "doctor_id",
            select:
              "name full_name specialization department phone_no account_id"
          }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    console.error("Get all prescriptions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions"
    });
  }
};


module.exports = {
  createPrescription,
  getAllPrescriptions
};