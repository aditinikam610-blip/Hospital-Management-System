// Backend hasn't finalized the initial-status contract yet — keep it in one
// place so it's a one-line change, not a hunt through booking logic.
export const DEFAULT_NEW_APPOINTMENT_STATUS = "Pending";

// Statuses a patient is allowed to cancel from. Adjust once the backend
// confirms its exact enum values.
export const CANCELLABLE_STATUSES = ["Pending", "Accepted"];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];