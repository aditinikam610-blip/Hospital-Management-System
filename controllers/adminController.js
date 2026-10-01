const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");

// GET ALL PATIENTS
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("account_id", "email role");

    res.status(200).json({
      success: true,
      patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get patients"
    });
  }
};

// GET ALL DOCTORS
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("account_id", "email role");

    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get doctors"
    });
  }
};

// GET ALL APPOINTMENTS
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate(
        "patient_id",
        "name age gender phone_no"
      )
      .populate(
        "doctor_id",
        "name specialization department phone_no"
      )
      .sort({ date: 1 });

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

// GET ALL PAYMENTS
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate(
        "appointment_id",
        "date time status patient_id doctor_id"
      );

    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get payments"
    });
  }
};

// ADMIN DASHBOARD SUMMARY
const getDashboard = async (req, res) => {
  try {
    const patientCount = await Patient.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    const appointmentCount = await Appointment.countDocuments();
    const paymentCount = await Payment.countDocuments();

    res.status(200).json({
      success: true,
      dashboard: {
        totalPatients: patientCount,
        totalDoctors: doctorCount,
        totalAppointments: appointmentCount,
        totalPayments: paymentCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard data"
    });
  }
};

module.exports = {
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
  getAllPayments,
  getDashboard
};