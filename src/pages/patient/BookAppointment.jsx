import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { doctors } from "../../data/mock/doctors";
import { appointments } from "../../data/mock/appointments";
import { addAppointment } from "../../utils/dataHelpers";
import { DEFAULT_NEW_APPOINTMENT_STATUS, TIME_SLOTS } from "../../constants/appointmentConfig";
import { useAuth } from "../../context/AuthContext";

function BookAppointment() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [doctorId, setDoctorId] = useState(searchParams.get("doctorId") || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const bookedSlots = useMemo(() => {
    if (!doctorId || !date) return [];
    return appointments
      .filter(
        (a) =>
          a.doctor_id === Number(doctorId) &&
          a.date === date &&
          !["Cancelled", "Rejected"].includes(a.status)
      )
      .map((a) => a.time);
  }, [doctorId, date]);

  const today = new Date().toISOString().split("T")[0];

  const handleConfirm = () => {
    setError("");
    if (!doctorId || !date || !time) {
      setError("Please select a doctor, date, and time.");
      return;
    }
    addAppointment({
      date,
      time,
      status: DEFAULT_NEW_APPOINTMENT_STATUS,
      patient_id: profile.patient_id,
      doctor_id: Number(doctorId),
    });
    setSuccess(true);
    setTimeout(() => navigate("/patient/appointments"), 1200);
  };

  return (
    <Card title="Book Appointment">
      {success ? (
        <p className="rounded-card bg-status-success-bg px-3 py-2 text-sm text-status-success">
          Appointment requested successfully. Redirecting to My Appointments…
        </p>
      ) : (
        <div className="max-w-lg space-y-4">
          {error && (
            <p className="rounded-card bg-status-danger-bg px-3 py-2 text-sm text-status-danger">{error}</p>
          )}

          <Select
            label="Doctor"
            required
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              setTime("");
            }}
            options={doctors.map((d) => ({
              value: String(d.doctor_id),
              label: `${d.name} — ${d.specialization}`,
            }))}
          />

          <div>
            <label className="text-sm font-medium text-text">
              Date <span className="text-status-danger">*</span>
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="mt-1 w-full rounded-card border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          {doctorId && date && (
            <div>
              <p className="mb-2 text-sm font-medium text-text">Available time slots</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setTime(slot)}
                      className={`rounded-card border px-2 py-1.5 text-xs font-medium transition-colors ${
                        isBooked
                          ? "cursor-not-allowed border-border bg-bg text-text-muted/50"
                          : isSelected
                          ? "border-accent bg-accent text-white"
                          : "border-border bg-surface text-text hover:border-accent"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleConfirm}>Confirm Appointment</Button>
            <Button variant="ghost" onClick={() => navigate("/patient/doctors")}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default BookAppointment;