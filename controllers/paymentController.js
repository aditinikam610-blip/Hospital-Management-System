const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");

// CREATE PAYMENT
const createPayment = async (req, res) => {
  try {
    const { amount, payment_mode, appointment_id } = req.body;

    if (!amount || !payment_mode || !appointment_id) {
      return res.status(400).json({
        success: false,
        message: "Amount, payment mode and appointment are required"
      });
    }

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
      _id: appointment_id,
      patient_id: patient._id
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
        message: "Payment allowed only for accepted appointments"
      });
    }

    const existingPayment = await Payment.findOne({
      appointment_id
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this appointment"
      });
    }

    const payment = await Payment.create({
      amount,
      payment_mode,
      appointment_id
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment"
    });
  }
};

// GET PAYMENT
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate(
        "appointment_id",
        "date time status patient_id"
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    // ADMIN CAN VIEW ANY PAYMENT
    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        payment
      });
    }

    // PATIENT CAN VIEW ONLY THEIR OWN PAYMENT
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({
        account_id: req.user.id
      });

      if (
        !patient ||
        payment.appointment_id.patient_id.toString() !==
          patient._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get payment"
    });
  }
};

// GET MY PAYMENTS
const getMyPayments = async (req, res) => {
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

    const payments = await Payment.find({
      appointment_id: { $in: appointmentIds }
    }).populate(
      "appointment_id",
      "date time status"
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


module.exports = {
  createPayment,
  getPayment,
  getMyPayments
};