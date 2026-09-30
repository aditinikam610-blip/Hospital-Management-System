import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getUnprescribedAppointmentsForDoctor, addPrescription } from "../../utils/dataHelpers";

function AddPrescription() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const eligible = getUnprescribedAppointmentsForDoctor(profile.doctor_id);

  const [appointmentId, setAppointmentId] = useState(searchParams.get("appointmentId") || "");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setError("");
    if (!appointmentId) return setError("Select an appointment.");
    if (!diagnosis.trim()) return setError("Enter a diagnosis.");
    if (!medicines.trim()) return setError("Enter medicines.");

    addPrescription({
      diagnosis: diagnosis.trim(),
      medicines: medicines.trim(),
      appointment_id: Number(appointmentId),
    });
    setSuccess(true);
    setTimeout(() => navigate("/doctor/appointments"), 1200);
  };

  return (
    <Card title="Add Prescription">
      {success ? (
        <p className="rounded-card bg-status-success-bg px-3 py-2 text-sm text-status-success">
          Prescription saved successfully. Redirecting…
        </p>
      ) : eligible.length === 0 && !appointmentId ? (
        <p className="text-sm text-text-muted">
          No completed appointments are currently awaiting a prescription.
        </p>
      ) : (
        <div className="max-w-lg space-y-4">
          {error && (
            <p className="rounded-card bg-status-danger-bg px-3 py-2 text-sm text-status-danger">{error}</p>
          )}

          <Select
            label="Appointment"
            required
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            options={eligible.map((a) => ({
              value: String(a.appointment_id),
              label: `${a.patient?.name} — ${format(parseISO(a.date), "dd MMM yyyy")}`,
            }))}
          />

          <div>
            <label className="text-sm font-medium text-text">
              Diagnosis <span className="text-status-danger">*</span>
            </label>
            <input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Viral Fever"
              className="mt-1 w-full rounded-card border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text">
              Medicines <span className="text-status-danger">*</span>
            </label>
            <textarea
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              rows={4}
              placeholder="e.g. Paracetamol 500mg - twice daily for 5 days"
              className="mt-1 w-full rounded-card border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>Save Prescription</Button>
            <Button variant="ghost" onClick={() => navigate("/doctor/appointments")}>Cancel</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default AddPrescription;