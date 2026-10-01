const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Account = require("../models/Account");


// ============================
// REGISTER
// ============================
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required"
      });
    }

    // Check if account already exists
    const existingAccount = await Account.findOne({ email });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Account already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account
    const account = await Account.create({
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: "Account registered successfully",
      account: {
        id: account._id,
        email: account.email,
        role: account.role
      }
    });

  } catch (error) {
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

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find account
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password
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

    // Generate JWT
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

