
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

import api from "../../services/api";

function AddPrescription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedAppointmentId =
    searchParams.get("appointmentId") || "";

  const [appointments, setAppointments] =
    useState([]);

  const [appointmentId, setAppointmentId] =
    useState(selectedAppointmentId);

  const [diagnosis, setDiagnosis] =
    useState("");

  const [medicines, setMedicines] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/appointments/doctor/my"
        );

        if (response.data.success) {
          const acceptedAppointments =
            response.data.appointments.filter(
              (appointment) =>
                appointment.status === "Accepted"
            );

          setAppointments(
            acceptedAppointments
          );
        }
      } catch (err) {
        console.error(
          "Failed to load appointments:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSave = async () => {
    setError("");

    if (!appointmentId) {
      setError("Select an appointment.");
      return;
    }

    if (!diagnosis.trim()) {
      setError("Enter a diagnosis.");
      return;
    }

    if (!medicines.trim()) {
      setError("Enter medicines.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(
        "/prescriptions",
        {
          diagnosis: diagnosis.trim(),
          medicines: medicines.trim(),
          appointment_id: appointmentId,
        }
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Failed to save prescription."
        );
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/doctor/appointments");
      }, 1200);
    } catch (err) {
      console.error(
        "Failed to save prescription:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save prescription."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card title="Add Prescription">
        <p className="text-sm text-text-muted">
          Loading appointments...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Add Prescription">
      {success ? (
        <p className="rounded-card bg-status-success-bg px-3 py-2 text-sm text-status-success">
          Prescription saved successfully.
          Redirecting…
        </p>
      ) : appointments.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-text-muted">
            No accepted appointments are currently
            awaiting a prescription.
          </p>

          <Button
            variant="ghost"
            onClick={() =>
              navigate("/doctor/appointments")
            }
          >
            Back to Appointments
          </Button>
        </div>
      ) : (
        <div className="max-w-lg space-y-4">
          {error && (
            <p className="rounded-card bg-status-danger-bg px-3 py-2 text-sm text-status-danger">
              {error}
            </p>
          )}

          <Select
            label="Appointment"
            required
            value={appointmentId}
            onChange={(e) =>
              setAppointmentId(e.target.value)
            }
            options={appointments.map(
              (appointment) => ({
                value: appointment._id,
                label: `${
                  appointment.patient_id?.name ||
                  "Unknown Patient"
                } — ${format(
                  parseISO(appointment.date),
                  "dd MMM yyyy"
                )} — ${appointment.time}`,
              })
            )}
          />

          <div>
            <label className="text-sm font-medium text-text">
              Diagnosis{" "}
              <span className="text-status-danger">
                *
              </span>
            </label>

            <input
              value={diagnosis}
              onChange={(e) =>
                setDiagnosis(e.target.value)
              }
              placeholder="e.g. Viral Fever"
              className="mt-1 w-full rounded-card border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text">
              Medicines{" "}
              <span className="text-status-danger">
                *
              </span>
            </label>

            <textarea
              value={medicines}
              onChange={(e) =>
                setMedicines(e.target.value)
              }
              rows={4}
              placeholder="e.g. Paracetamol 500mg - twice daily for 5 days"
              className="mt-1 w-full rounded-card border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Prescription"}
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                navigate("/doctor/appointments")
              }
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default AddPrescription;
