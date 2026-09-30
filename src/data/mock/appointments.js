// appointment table: appointment_id, date, time, status, patient_id, doctor_id
export const appointments = [
  { appointment_id: 1, date: "2026-10-02", time: "10:30", status: "Accepted", patient_id: 1, doctor_id: 1 },
  { appointment_id: 2, date: "2026-09-15", time: "09:00", status: "Completed", patient_id: 1, doctor_id: 2 },
  { appointment_id: 3, date: "2026-09-20", time: "14:00", status: "Cancelled", patient_id: 1, doctor_id: 4 },
  { appointment_id: 4, date: "2026-09-10", time: "11:00", status: "Completed", patient_id: 1, doctor_id: 3 },
  { appointment_id: 5, date: "2026-10-05", time: "15:00", status: "Pending", patient_id: 1, doctor_id: 5 },

  // Dr. Ananya Patil (doctor_id: 1) — more appointments for Stage 6 demo
  { appointment_id: 6, date: "2026-09-27", time: "09:30", status: "Pending", patient_id: 2, doctor_id: 1 },
  { appointment_id: 7, date: "2026-09-28", time: "10:00", status: "Pending", patient_id: 3, doctor_id: 1 },
  { appointment_id: 8, date: "2026-09-18", time: "16:00", status: "Completed", patient_id: 2, doctor_id: 1 },
  { appointment_id: 9, date: "2026-09-12", time: "11:30", status: "Completed", patient_id: 3, doctor_id: 1 },
];