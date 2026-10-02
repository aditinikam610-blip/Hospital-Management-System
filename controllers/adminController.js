const bcrypt = require("bcryptjs");
const Account = require("../models/Account");

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Prescription = require("../models/Prescription");

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
// GET ALL PAYMENTS
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "appointment_id",
        select: "date time status patient_id doctor_id",
        populate: [
          {
            path: "patient_id",
            select: "name"
          },
          {
            path: "doctor_id",
            select: "name"
          }
        ]
      });

    console.log(
      "PAYMENTS WITH PATIENT/DOCTOR:",
      JSON.stringify(payments, null, 2)
    );

    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get payments",
      error: error.message
    });
  }
};

// ADMIN DASHBOARD SUMMARY
// ADMIN DASHBOARD SUMMARY
const getDashboard = async (req, res) => {
  try {
    const patientCount =
      await Patient.countDocuments();

    const doctorCount =
      await Doctor.countDocuments();

    const appointmentCount =
      await Appointment.countDocuments();

    const paymentCount =
      await Payment.countDocuments();

    const pendingCount =
      await Appointment.countDocuments({
        status: "Pending"
      });

    const completedCount =
      await Appointment.countDocuments({
        status: "Completed"
      });

    const acceptedCount =
      await Appointment.countDocuments({
        status: "Accepted"
      });

    const rejectedCount =
      await Appointment.countDocuments({
        status: "Rejected"
      });

    const cancelledCount =
      await Appointment.countDocuments({
        status: "Cancelled"
      });

    const payments = await Payment.find();

    const totalRevenue = payments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );

    // Today's appointments
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysCount =
      await Appointment.countDocuments({
        date: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      });

    res.status(200).json({
      success: true,

      dashboard: {
        totalPatients: patientCount,
        totalDoctors: doctorCount,
        totalAppointments: appointmentCount,
        totalPayments: paymentCount,

        pendingCount,
        acceptedCount,
        completedCount,
        rejectedCount,
        cancelledCount,

        todaysCount,
        totalRevenue
      },

      // Also return these at top level
      // so the existing frontend can easily use them.
      totalPatients: patientCount,
      totalDoctors: doctorCount,
      totalAppointments: appointmentCount,
      totalPayments: paymentCount,
      pendingCount,
      acceptedCount,
      completedCount,
      rejectedCount,
      cancelledCount,
      todaysCount,
      totalRevenue
    });

  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get dashboard data"
    });
  }
};

// CREATE DOCTOR ACCOUNT
const createDoctorAccount = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      specialization,
      department,
      phone_no
    } = req.body;

    if (
      !email ||
      !password ||
      !name ||
      !specialization ||
      !department ||
      !phone_no
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email, password, name, specialization, department and phone number are required"
      });
    }

    const existingAccount = await Account.findOne({
      email
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message:
          "Account with this email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const account = await Account.create({
      email,
      password: hashedPassword,
      role: "doctor"
    });

    const doctor = await Doctor.create({
      name,
      specialization,
      department,
      phone_no,
      account_id: account._id
    });

    res.status(201).json({
      success: true,
      message: "Doctor account created successfully",
      account: {
        id: account._id,
        email: account.email,
        role: account.role
      },
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        department: doctor.department,
        phone_no: doctor.phone_no
      }
    });

  } catch (error) {
    console.error(
      "Create Doctor Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create doctor account",
      error: error.message
    });
  }
};

// UPDATE DOCTOR - ADMIN
const updateDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      department,
      phone_no
    } = req.body;

    const doctor =
      await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    if (name !== undefined) {
      doctor.name = name;
    }

    if (specialization !== undefined) {
      doctor.specialization = specialization;
    }

    if (department !== undefined) {
      doctor.department = department;
    }

    if (phone_no !== undefined) {
      doctor.phone_no = phone_no;
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor
    });

  } catch (error) {
    console.error(
      "Update doctor error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update doctor"
    });
  }
};

// DELETE DOCTOR - ADMIN
const deleteDoctor = async (req, res) => {
  try {
    const doctor =
      await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Find appointments belonging to doctor
    const appointments =
      await Appointment.find({
        doctor_id: doctor._id
      }).select("_id");

    const appointmentIds =
      appointments.map(
        (appointment) => appointment._id
      );

    // Remove related prescriptions
    if (appointmentIds.length > 0) {
      await Prescription.deleteMany({
        appointment_id: {
          $in: appointmentIds
        }
      });

      // Remove related payments
      await Payment.deleteMany({
        appointment_id: {
          $in: appointmentIds
        }
      });

      // Remove appointments
      await Appointment.deleteMany({
        doctor_id: doctor._id
      });
    }

    // Remove doctor profile
    await Doctor.findByIdAndDelete(
      doctor._id
    );

    // Remove login account
    if (doctor.account_id) {
      await Account.findByIdAndDelete(
        doctor.account_id
      );
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully"
    });

  } catch (error) {
    console.error(
      "Delete doctor error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete doctor"
    });
  }
};

// UPDATE PATIENT - ADMIN
const updatePatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      address,
      phone_no
    } = req.body;

    const patient =
      await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    if (name !== undefined) {
      patient.name = name;
    }

    if (age !== undefined) {
      patient.age = Number(age);
    }

    if (gender !== undefined) {
      patient.gender = gender;
    }

    if (address !== undefined) {
      patient.address = address;
    }

    if (phone_no !== undefined) {
      patient.phone_no = phone_no;
    }

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient
    });

  } catch (error) {
    console.error(
      "Update patient error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update patient"
    });
  }
};

// DELETE PATIENT - ADMIN
const deletePatient = async (req, res) => {
  try {
    const patient =
      await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    // Find patient appointments
    const appointments =
      await Appointment.find({
        patient_id: patient._id
      }).select("_id");

    const appointmentIds =
      appointments.map(
        (appointment) => appointment._id
      );

    // Delete related prescriptions
    if (appointmentIds.length > 0) {
      await Prescription.deleteMany({
        appointment_id: {
          $in: appointmentIds
        }
      });

      // Delete related payments
      await Payment.deleteMany({
        appointment_id: {
          $in: appointmentIds
        }
      });

      // Delete appointments
      await Appointment.deleteMany({
        patient_id: patient._id
      });
    }

    // Delete patient profile
    await Patient.findByIdAndDelete(
      patient._id
    );

    // Delete login account
    if (patient.account_id) {
      await Account.findByIdAndDelete(
        patient.account_id
      );
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully"
    });

  } catch (error) {
    console.error(
      "Delete patient error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete patient"
    });
  }
};

module.exports = {
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
  getAllPayments,
  getDashboard,
  createDoctorAccount,

  updateDoctor,
  deleteDoctor,

  updatePatient,
  deletePatient
};