import { doctors } from "../data/mock/doctors";
import { patients } from "../data/mock/patients";
import { appointments } from "../data/mock/appointments";
import { payments } from "../data/mock/payments";
import { prescriptions } from "../data/mock/prescriptions";
import { accounts } from "../data/mock/accounts";

export const getDoctorById = (id) => doctors.find((d) => d.doctor_id === id);
export const getPatientById = (id) => patients.find((p) => p.patient_id === id);
export const getAccountById = (id) => accounts.find((a) => a.account_id === id);
export const getAppointmentById = (id) => appointments.find((a) => a.appointment_id === id);

export const getAppointmentsByPatient = (patientId) =>
  appointments.filter((a) => a.patient_id === patientId);

export const getAppointmentsByDoctor = (doctorId) =>
  appointments.filter((a) => a.doctor_id === doctorId);

// Attaches doctor info to an appointment for DISPLAY only —
// the appointment table itself only stores doctor_id.
export const enrichAppointment = (appt) => ({
  ...appt,
  doctor: getDoctorById(appt.doctor_id),
  patient: getPatientById(appt.patient_id),
});

export const getPrescriptionsByPatient = (patientId) => {
  const patientApptIds = getAppointmentsByPatient(patientId).map((a) => a.appointment_id);
  return prescriptions
    .filter((p) => patientApptIds.includes(p.appointment_id))
    .map((p) => ({ ...p, appointment: enrichAppointment(getAppointmentById(p.appointment_id)) }));
};

export const getPaymentsByPatient = (patientId) => {
  const patientApptIds = getAppointmentsByPatient(patientId).map((a) => a.appointment_id);
  return payments
    .filter((p) => patientApptIds.includes(p.appointment_id))
    .map((p) => ({ ...p, appointment: enrichAppointment(getAppointmentById(p.appointment_id)) }));
};

export const getPaymentForAppointment = (appointmentId) =>
  payments.find((p) => p.appointment_id === appointmentId);

// --- Mutations (mock-only; Stage 8 replaces these with real API calls) ---

const nextId = (array, key) =>
  array.length ? Math.max(...array.map((item) => item[key])) + 1 : 1;

export const addAppointment = ({ date, time, status, patient_id, doctor_id }) => {
  const appointment_id = nextId(appointments, "appointment_id");
  const newAppt = { appointment_id, date, time, status, patient_id, doctor_id };
  appointments.push(newAppt);
  return newAppt;
};

export const updateAppointmentStatus = (appointmentId, status) => {
  const appt = getAppointmentById(appointmentId);
  if (appt) appt.status = status;
  return appt;
};

export const addPayment = ({ amount, payment_date, payment_mode, appointment_id }) => {
  const payment_id = nextId(payments, "payment_id");
  const newPayment = { payment_id, amount, payment_date, payment_mode, appointment_id };
  payments.push(newPayment);
  return newPayment;
};

export const updatePatientProfile = (patientId, updates) => {
  const patient = getPatientById(patientId);
  if (patient) Object.assign(patient, updates);
  return patient;
};

// --- Doctor-side helpers ---

export const getDoctorByAccountId = (accountId) =>
  doctors.find((d) => d.account_id === accountId);

// Distinct patients who have at least one appointment with this doctor —
// derived purely from the appointment table, no separate relation invented.
export const getPatientsForDoctor = (doctorId) => {
  const patientIds = [
    ...new Set(getAppointmentsByDoctor(doctorId).map((a) => a.patient_id)),
  ];
  return patientIds.map((id) => getPatientById(id)).filter(Boolean);
};

export const getAppointmentsForDoctorAndPatient = (doctorId, patientId) =>
  appointments
    .filter((a) => a.doctor_id === doctorId && a.patient_id === patientId)
    .map(enrichAppointment);

export const getPrescriptionsForAppointment = (appointmentId) =>
  prescriptions.filter((p) => p.appointment_id === appointmentId);

// Completed appointments for this doctor that don't have a prescription yet —
// the natural set to offer in the Add Prescription form.
export const getUnprescribedAppointmentsForDoctor = (doctorId) => {
  const prescribedApptIds = new Set(prescriptions.map((p) => p.appointment_id));
  return getAppointmentsByDoctor(doctorId)
    .filter((a) => a.status === "Completed" && !prescribedApptIds.has(a.appointment_id))
    .map(enrichAppointment);
};

export const addPrescription = ({ diagnosis, medicines, appointment_id }) => {
  const prescription_id = nextId(prescriptions, "prescription_id");
  const newPrescription = { prescription_id, diagnosis, medicines, appointment_id };
  prescriptions.push(newPrescription);
  return newPrescription;
};

export const updateDoctorProfile = (doctorId, updates) => {
  const doctor = getDoctorById(doctorId);
  if (doctor) Object.assign(doctor, updates);
  return doctor;
};

// --- Admin-side helpers ---

export const getAllAppointmentsEnriched = () => appointments.map(enrichAppointment);

export const getAllPaymentsEnriched = () =>
  payments.map((p) => ({ ...p, appointment: enrichAppointment(getAppointmentById(p.appointment_id)) }));

export const getAllPrescriptionsEnriched = () =>
  prescriptions.map((p) => ({ ...p, appointment: enrichAppointment(getAppointmentById(p.appointment_id)) }));

export const getDashboardStats = () => {
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const todaysCount = appointments.filter(
    (a) => a.date === new Date().toISOString().split("T")[0]
  ).length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return { totalPatients, totalDoctors, todaysCount, pendingCount, completedCount, totalRevenue };
};

// Appointment counts by status — feeds the appointment-statistics chart
export const getAppointmentStatusBreakdown = () => {
  const counts = {};
  appointments.forEach((a) => {
    counts[a.status] = (counts[a.status] || 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
};

// Doctor count by department — feeds the department-distribution chart
export const getDepartmentBreakdown = () => {
  const counts = {};
  doctors.forEach((d) => {
    counts[d.department] = (counts[d.department] || 0) + 1;
  });
  return Object.entries(counts).map(([department, count]) => ({ department, count }));
};

// Revenue grouped by month (from actual payment_date values, not invented data)
export const getMonthlyRevenue = () => {
  const totals = {};
  payments.forEach((p) => {
    const monthKey = p.payment_date.slice(0, 7); // "YYYY-MM"
    totals[monthKey] = (totals[monthKey] || 0) + Number(p.amount);
  });
  return Object.entries(totals)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, total]) => ({ month, total }));
};

export const deleteDoctor = (doctorId) => {
  const index = doctors.findIndex((d) => d.doctor_id === doctorId);
  if (index !== -1) doctors.splice(index, 1);
};

export const deletePatient = (patientId) => {
  const index = patients.findIndex((p) => p.patient_id === patientId);
  if (index !== -1) patients.splice(index, 1);
};

export const updateDoctorRecord = (doctorId, updates) => {
  const doctor = getDoctorById(doctorId);
  if (doctor) Object.assign(doctor, updates);
  return doctor;
};

export const updatePatientRecord = (patientId, updates) => {
  const patient = getPatientById(patientId);
  if (patient) Object.assign(patient, updates);
  return patient;
};