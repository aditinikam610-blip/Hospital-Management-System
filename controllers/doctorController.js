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
    res.status(500).json({
      success: false,
      message: "Failed to create doctor profile"
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
    res.status(500).json({
      success: false,
      message: "Failed to get doctors"
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
    res.status(500).json({
      success: false,
      message: "Failed to get doctor"
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
    res.status(500).json({
      success: false,
      message: "Failed to update doctor profile"
    });
  }
};


module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor
};