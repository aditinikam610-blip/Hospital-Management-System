
const Doctor = require("../models/Doctor");

// ============================
// CREATE DOCTOR PROFILE
// ============================
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      department,
      phone_no,
      account_id
    } = req.body;

    if (
      !name ||
      !specialization ||
      !department ||
      !phone_no ||
      !account_id
    ) {
      return res.status(400).json({
        success: false,
        message: "All doctor details are required"
      });
    }

    const existingDoctor = await Doctor.findOne({
      account_id
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile already exists"
      });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      department,
      phone_no,
      account_id
    });

    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      doctor
    });
  } catch (error) {
    console.error("Create Doctor Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create doctor profile",
      error: error.message
    });
  }
};


// ============================
// GET LOGGED-IN DOCTOR PROFILE
// ============================
const getDoctorProfile = async (req, res) => {
  try {
    // Check JWT user information
    console.log("Doctor Profile - req.user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User information not found in token"
      });
    }

    const doctor = await Doctor.findOne({
      account_id: req.user.id
    }).populate("account_id", "email role");

    console.log("Doctor Profile Found:", doctor);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    res.status(200).json({
      success: true,
      doctor: {
        doctor_id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        department: doctor.department,
        phone_no: doctor.phone_no,
        account_id: doctor.account_id
      }
    });
  } catch (error) {
    console.error("Get Doctor Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get doctor profile",
      error: error.message
    });
  }
};


// ============================
// GET ALL DOCTORS
// ============================
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("account_id", "email role");

    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error("Get All Doctors Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get doctors",
      error: error.message
    });
  }
};


// ============================
// GET SINGLE DOCTOR
// ============================
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("account_id", "email role");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error("Get Doctor Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get doctor",
      error: error.message
    });
  }
};


// ============================
// UPDATE DOCTOR PROFILE
// ============================
const updateDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      department,
      phone_no
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User information not found in token"
      });
    }

    const doctor = await Doctor.findOneAndUpdate(
      {
        account_id: req.user.id
      },
      {
        name,
        specialization,
        department,
        phone_no
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor
    });
  } catch (error) {
    console.error("Update Doctor Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update doctor profile",
      error: error.message
    });
  }
};


module.exports = {
  createDoctor,
  getDoctorProfile,
  getAllDoctors,
  getDoctor,
  updateDoctor
};
