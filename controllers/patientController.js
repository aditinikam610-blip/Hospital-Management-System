const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");

// ============================
// CREATE PATIENT PROFILE
// ============================
const createProfile = async (req, res) => {
  try {
    const { name, age, gender, address, phone_no } = req.body;

    // Check required fields
    if (!name || age === undefined || !gender || !phone_no) {
      return res.status(400).json({
        success: false,
        message: "Name, age, gender and phone number are required"
      });
    }

    // Check if profile already exists
    const existingPatient = await Patient.findOne({
      account_id: req.user.id
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient profile already exists"
      });
    }

    // Create patient profile
    const patient = await Patient.create({
      name,
      age,
      gender,
      address,
      phone_no,
      account_id: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Patient profile created successfully",
      patient
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create patient profile"
    });
  }
};

// ============================
// GET PATIENT PROFILE
// ============================
const getProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      account_id: req.user.id
    }).populate("account_id", "email role");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found"
      });
    }

    res.status(200).json({
      success: true,
      patient
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get patient profile"
    });
  }
};


// ============================
// UPDATE PATIENT PROFILE
// ============================
const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, address, phone_no } = req.body;

    const patient = await Patient.findOneAndUpdate(
      { account_id: req.user.id },
      {
        name,
        age,
        gender,
        address,
        phone_no
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      patient
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};


// ============================
// GET PATIENT APPOINTMENTS
// ============================
const getAppointments = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      account_id: req.user.id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found"
      });
    }

    const appointments = await Appointment.find({
      patient_id: patient._id
    }).populate(
      "doctor_id",
      "name specialization department phone_no"
    );

    res.status(200).json({
      success: true,
      appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get appointments"
    });
  }
};


// ============================
// GET PATIENT PRESCRIPTIONS
// ============================
const getPrescriptions = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      account_id: req.user.id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found"
      });
    }

    const appointments = await Appointment.find({
      patient_id: patient._id
    }).select("_id");

    const appointmentIds = appointments.map(
      appointment => appointment._id
    );

    const prescriptions = await Prescription.find({
      appointment_id: { $in: appointmentIds }
    }).populate(
      "appointment_id",
      "date time status"
    );

    res.status(200).json({
      success: true,
      prescriptions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get prescriptions"
    });
  }
};


module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  getAppointments,
  getPrescriptions
};