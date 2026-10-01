
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Account = require("../models/Account");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// ============================
// REGISTER
// ============================
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      address,
      phone_no,
      role,
      specialization,
      department
    } = req.body;

    const userRole = role || "patient";

    // Common validation
    if (!name || !email || !password || !phone_no) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and phone number are required"
      });
    }

    // Patient validation
    if (userRole === "patient") {
      if (age === undefined || !gender) {
        return res.status(400).json({
          success: false,
          message:
            "Age and gender are required for patient registration"
        });
      }
    }

    // Doctor validation
    if (userRole === "doctor") {
      if (!specialization || !department) {
        return res.status(400).json({
          success: false,
          message:
            "Specialization and department are required for doctor registration"
        });
      }
    }

    // Only patient and doctor registration allowed
    if (!["patient", "doctor"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration role"
      });
    }

    // Check existing account
    const existingAccount = await Account.findOne({
      email: email.toLowerCase()
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Account with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account
    const account = await Account.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole
    });

    // ============================
    // CREATE PATIENT
    // ============================
    if (userRole === "patient") {
      const patient = await Patient.create({
        name,
        age,
        gender,
        address,
        phone_no,
        account_id: account._id
      });

      return res.status(201).json({
        success: true,
        message: "Patient registered successfully",

        account: {
          id: account._id,
          email: account.email,
          role: account.role
        },

        patient: {
          id: patient._id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          address: patient.address,
          phone_no: patient.phone_no
        }
      });
    }

    // ============================
    // CREATE DOCTOR
    // ============================
    if (userRole === "doctor") {
      const doctor = await Doctor.create({
        name,
        specialization,
        department,
        phone_no,
        account_id: account._id
      });

      return res.status(201).json({
        success: true,
        message: "Doctor registered successfully",

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
    }

  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};

// ============================
// LOGIN
// ============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const account = await Account.findOne({
      email: email.toLowerCase()
    });

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      account.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: account._id,
        role: account.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: account._id,
        email: account.email,
        role: account.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};

module.exports = {
  register,
  login
};
