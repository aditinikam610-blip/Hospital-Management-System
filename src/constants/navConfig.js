import {
  LayoutDashboard,
  User,
  Stethoscope,
  CalendarPlus,
  CalendarCheck,
  FileText,
  CreditCard,
  History,
  Users,
} from "lucide-react";

// Navigation configuration for each role
export const NAV_CONFIG = {
  patient: [
    {
      label: "Dashboard",
      path: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      path: "/patient/profile",
      icon: User,
    },
    {
      label: "Doctors",
      path: "/patient/doctors",
      icon: Stethoscope,
    },
    {
      label: "Book Appointment",
      path: "/patient/book-appointment",
      icon: CalendarPlus,
    },
    {
      label: "My Appointments",
      path: "/patient/appointments",
      icon: CalendarCheck,
    },
    {
      label: "Prescriptions",
      path: "/patient/prescriptions",
      icon: FileText,
    },
    {
      label: "Payments",
      path: "/patient/payments",
      icon: CreditCard,
    },
    {
      label: "Payment History",
      path: "/patient/payment-history",
      icon: History,
    },
  ],

  doctor: [
    {
      label: "Dashboard",
      path: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      path: "/doctor/profile",
      icon: User,
    },
    {
      label: "Appointments",
      path: "/doctor/appointments",
      icon: CalendarCheck,
    },
    {
      label: "Patients",
      path: "/doctor/patients",
      icon: Users,
    },
    {
      label: "Prescriptions",
      path: "/doctor/prescriptions/add",
      icon: FileText,
    },
  ],

  admin: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Doctors",
      path: "/admin/doctors",
      icon: Stethoscope,
    },
    {
      label: "Manage Patients",
      path: "/admin/patients",
      icon: Users,
    },
    {
      label: "Manage Appointments",
      path: "/admin/appointments",
      icon: CalendarCheck,
    },
    {
      label: "Manage Payments",
      path: "/admin/payments",
      icon: CreditCard,
    },
    {
      label: "Manage Prescriptions",
      path: "/admin/prescriptions",
      icon: FileText,
    },
  ],
};

export const ROLE_LABELS = {
  patient: "Patient",
  doctor: "Doctor",
  admin: "Admin",
};