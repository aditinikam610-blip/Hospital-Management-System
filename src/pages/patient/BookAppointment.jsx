
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

import { TIME_SLOTS } from "../../constants/appointmentConfig";
import api from "../../services/api";

function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [doctorId, setDoctorId] = useState(
    searchParams.get("doctorId") || ""
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ============================
  // LOAD DOCTORS + APPOINTMENTS
  // ============================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [doctorResponse, appointmentResponse] =
          await Promise.all([
            api.get("/doctors"),
            api.get("/appointments/my"),
          ]);

        if (doctorResponse.data.success) {
          setDoctors(doctorResponse.data.doctors);
        }

        if (appointmentResponse.data.success) {
          setAppointments(
            appointmentResponse.data.appointments
          );
        }
      } catch (err) {
        console.error("Failed to load booking data:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load doctors. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ============================
  // FIND ALREADY BOOKED SLOTS
  // ============================
  const bookedSlots = useMemo(() => {
    if (!doctorId || !date) {
      return [];
    }

    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(
          appointment.date
        )
          .toISOString()
          .split("T")[0];

        return (
          appointment.doctor_id?._id === doctorId &&
          appointmentDate === date &&
          !["Cancelled", "Rejected"].includes(
            appointment.status
          )
        );
      })
      .map((appointment) => appointment.time);
  }, [doctorId, date, appointments]);

  // ============================
  // TODAY'S DATE
  // ============================
  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ============================
  // BOOK APPOINTMENT
  // ============================
  const handleConfirm = async () => {
    setError("");

    if (!doctorId || !date || !time) {
      setError(
        "Please select a doctor, date, and time."
      );
      return;
    }

    try {
      setBooking(true);

      const response = await api.post(
        "/appointments",
        {
          date,
          time,
          doctor_id: doctorId,
        }
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Failed to book appointment."
        );
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1200);
    } catch (err) {
      console.error(
        "Appointment booking failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <Card title="Book Appointment">
        <p className="text-sm text-text-muted">
          Loading doctors...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Book Appointment">
      {success ? (
        <p className="rounded-card bg-status-success-bg px-3 py-2 text-sm text-status-success">
          Appointment requested successfully.
          Redirecting to My Appointments…
        </p>
      ) : (
        <div className="max-w-lg space-y-4">

          {/* ERROR MESSAGE */}
          {error && (
            <p className="rounded-card bg-status-danger-bg px-3 py-2 text-sm text-status-danger">
              {error}
            </p>
          )}

          {/* DOCTOR */}
          <Select
            label="Doctor"
            required
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              setTime("");
            }}
            options={doctors.map((doctor) => ({
              value: doctor._id,
              label: `${doctor.name} — ${doctor.specialization}`,
            }))}
          />

          {/* DATE */}
          <div>
            <label className="text-sm font-medium text-text">
              Date{" "}
              <span className="text-status-danger">
                *
              </span>
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

          {/* TIME SLOTS */}
          {doctorId && date && (
            <div>
              <p className="mb-2 text-sm font-medium text-text">
                Available time slots
              </p>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">

                {TIME_SLOTS.map((slot) => {
                  const isBooked =
                    bookedSlots.includes(slot);

                  const isSelected =
                    time === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() =>
                        setTime(slot)
                      }
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

          {/* BUTTONS */}
          <div className="flex gap-2 pt-2">

            <Button
              onClick={handleConfirm}
              disabled={booking}
            >
              {booking
                ? "Booking..."
                : "Confirm Appointment"}
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                navigate("/patient/doctors")
              }
              disabled={booking}
            >
              Cancel
            </Button>

          </div>
        </div>
      )}
    </Card>
  );
}

export default BookAppointment;
