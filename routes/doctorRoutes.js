const express = require("express");

const {
createDoctor,
getDoctorProfile,
getAllDoctors,
getDoctor,
updateDoctor
} = require("../controllers/doctorController");

const {
protect,
authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE DOCTOR
// Only admin can create through this route
router.post(
"/",
protect,
authorize("admin"),
createDoctor
);

// GET LOGGED-IN DOCTOR PROFILE
// IMPORTANT: This must come before /:id
router.get(
"/profile",
protect,
authorize("doctor"),
getDoctorProfile
);

// GET ALL DOCTORS
router.get(
"/",
protect,
authorize("patient", "doctor", "admin"),
getAllDoctors
);

// GET SINGLE DOCTOR
router.get(
"/:id",
protect,
authorize("patient", "doctor", "admin"),
getDoctor
);

// UPDATE LOGGED-IN DOCTOR PROFILE
router.put(
"/profile",
protect,
authorize("doctor"),
updateDoctor
);

module.exports = router;
