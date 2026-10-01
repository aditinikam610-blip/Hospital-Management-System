import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleLayout from "../components/layout/RoleLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// PATIENT
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientProfile from "../pages/patient/PatientProfile";
import Doctors from "../pages/patient/Doctors";
import DoctorDetails from "../pages/patient/DoctorDetails";
import BookAppointment from "../pages/patient/BookAppointment";
import MyAppointments from "../pages/patient/MyAppointments";
import Prescriptions from "../pages/patient/Prescriptions";
import Payments from "../pages/patient/Payments";
import PaymentHistory from "../pages/patient/PaymentHistory";

// DOCTOR
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import Patients from "../pages/doctor/Patients";
import PatientDetails from "../pages/doctor/PatientDetails";
import AddPrescription from "../pages/doctor/AddPrescription";

// ADMIN
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageDoctors from "../pages/admin/ManageDoctors";
import ManagePatients from "../pages/admin/ManagePatients";
import ManageAppointments from "../pages/admin/ManageAppointments";
import ManagePayments from "../pages/admin/ManagePayments";
import ManagePrescriptions from "../pages/admin/ManagePrescriptions";

function AppRoutes() {
return ( <Routes>


  {/* ============================
      PUBLIC ROUTES
  ============================ */}
  <Route
    path="/"
    element={<Navigate to="/login" replace />}
  />

  <Route
    path="/login"
    element={<Login />}
  />

  <Route
    path="/register"
    element={<Register />}
  />


  {/* ============================
      PATIENT ROUTES
  ============================ */}
  <Route
    element={
      <ProtectedRoute allowedRoles={["patient"]} />
    }
  >
    <Route element={<RoleLayout />}>

      <Route
        path="/patient/dashboard"
        element={<PatientDashboard />}
      />

      <Route
        path="/patient/profile"
        element={<PatientProfile />}
      />

      <Route
        path="/patient/doctors"
        element={<Doctors />}
      />

      <Route
        path="/patient/doctors/:id"
        element={<DoctorDetails />}
      />

      <Route
        path="/patient/book-appointment"
        element={<BookAppointment />}
      />

      <Route
        path="/patient/appointments"
        element={<MyAppointments />}
      />

      <Route
        path="/patient/prescriptions"
        element={<Prescriptions />}
      />

      <Route
        path="/patient/payments"
        element={<Payments />}
      />

      <Route
        path="/patient/payment-history"
        element={<PaymentHistory />}
      />

    </Route>
  </Route>


  {/* ============================
      DOCTOR ROUTES
  ============================ */}
  <Route
    element={
      <ProtectedRoute allowedRoles={["doctor"]} />
    }
  >
    <Route element={<RoleLayout />}>

      <Route
        path="/doctor/dashboard"
        element={<DoctorDashboard />}
      />

      <Route
        path="/doctor/profile"
        element={<DoctorProfile />}
      />

      <Route
        path="/doctor/appointments"
        element={<DoctorAppointments />}
      />

      <Route
        path="/doctor/patients"
        element={<Patients />}
      />

      <Route
        path="/doctor/patients/:id"
        element={<PatientDetails />}
      />

      <Route
        path="/doctor/prescriptions/add"
        element={<AddPrescription />}
      />

    </Route>
  </Route>


  {/* ============================
      ADMIN ROUTES
  ============================ */}
  <Route
    element={
      <ProtectedRoute allowedRoles={["admin"]} />
    }
  >
    <Route element={<RoleLayout />}>

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/doctors"
        element={<ManageDoctors />}
      />

      <Route
        path="/admin/patients"
        element={<ManagePatients />}
      />

      <Route
        path="/admin/appointments"
        element={<ManageAppointments />}
      />

      <Route
        path="/admin/payments"
        element={<ManagePayments />}
      />

      <Route
        path="/admin/prescriptions"
        element={<ManagePrescriptions />}
      />

    </Route>
  </Route>


  {/* ============================
      UNKNOWN ROUTE
  ============================ */}
  <Route
    path="*"
    element={<Navigate to="/login" replace />}
  />

</Routes>

);
}

export default AppRoutes;
