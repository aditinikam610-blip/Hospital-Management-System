const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");


// ============================
// CREATE APPOINTMENT
// ============================
const createAppointment = async (req, res) => {
  try {
    const { date, time, doctor_id } = req.body;

    if (!date || !time || !doctor_id) {
      return res.status(400).json({
        success: false,
        message: "Date, time and doctor are required"
      });
    }

    // Find logged-in patient
    const patient = await Patient.findOne({
      account_id: req.user.id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found"
      });
    }

    // Check doctor exists
    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Check if doctor already has appointment
    const existingAppointment = await Appointment.findOne({
      doctor_id,
      date: new Date(date),
      time,
      status: {
        $nin: ["Cancelled", "Rejected"]
      }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Doctor is already booked for this time"
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      date: new Date(date),
      time,
      patient_id: patient._id,
      doctor_id,
      status: "Pending"
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message
    });
  }
};


// ============================
// GET PATIENT APPOINTMENTS
// ============================
const getMyAppointments = async (req, res) => {
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
    })
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


// GET SINGLE APPOINTMENT
const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate(
        "patient_id",
        "name age gender phone_no"
      )
      .populate(
        "doctor_id",
        "name specialization department phone_no"
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // ADMIN CAN VIEW ANY APPOINTMENT
    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        appointment
      });
    }

    // PATIENT CAN VIEW ONLY THEIR OWN APPOINTMENT
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({
        account_id: req.user.id
      });

      if (
        !patient ||
        appointment.patient_id._id.toString() !== patient._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }
    }

    // DOCTOR CAN VIEW ONLY THEIR APPOINTMENTS
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({
        account_id: req.user.id
      });

      if (
        !doctor ||
        appointment.doctor_id._id.toString() !== doctor._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get appointment"
    });
  }
};
// ============================
// GET DOCTOR APPOINTMENTS
// ============================
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      account_id: req.user.id
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const appointments = await Appointment.find({
      doctor_id: doctor._id
    })
      .populate(
        "patient_id",
        "name age gender phone_no"
      )
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get doctor appointments"
    });
  }
};


// ============================
// UPDATE APPOINTMENT STATUS
// ============================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Accepted",
      "Rejected",
      "Completed"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status"
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
      _id: req.params.id,
      doctor_id: doctor._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status"
    });
  }
};

// ============================
// ADMIN UPDATE APPOINTMENT STATUS
// ============================
const adminUpdateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Rejected",
      "Cancelled",
      "Completed"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status"
      });
    }

    const appointment = await Appointment.findById(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      appointment
    });

  } catch (error) {
    console.error(
      "Admin update appointment error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update appointment status"
    });
  }
};

// CANCEL APPOINTMENT
const cancelAppointment = async (req, res) => {
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

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient_id: patient._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (
      appointment.status === "Cancelled" ||
      appointment.status === "Rejected" ||
      appointment.status === "Completed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Appointment cannot be cancelled"
      });
    }

    appointment.status = "Cancelled";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel appointment"
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  adminUpdateAppointmentStatus,
  cancelAppointment
};
