import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import {
  getPatientById,
  getAppointmentsForDoctorAndPatient,
  getPrescriptionsForAppointment,
} from "../../utils/dataHelpers";

function PatientDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const patient = getPatientById(Number(id));

  if (!patient) {
    return (
      <ErrorState
        title="Patient not found"
        onRetry={() => navigate("/doctor/patients")}
      />
    );
  }

  // Only this doctor's appointment history with the patient is shown —
  // a doctor shouldn't see a patient's visits to other doctors.
  const appointmentHistory = getAppointmentsForDoctorAndPatient(profile.doctor_id, patient.patient_id);

  return (
    <div className="space-y-6">
      <Card title="Patient Profile">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["Patient ID", patient.patient_id],
            ["Name", patient.name],
            ["Age", patient.age],
            ["Gender", patient.gender],
            ["Phone Number", patient.phone_no],
            ["Address", patient.address],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-text-muted">{label}</dt>
              <dd className="text-sm font-medium text-text">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title="Appointment History (with you)">
        {appointmentHistory.length === 0 ? (
          <EmptyState title="No appointment history" />
        ) : (
          <Table
            rows={appointmentHistory}
            rowKey="appointment_id"
            columns={[
              { key: "date", header: "Date", render: (r) => format(parseISO(r.date), "dd MMM yyyy") },
              { key: "time", header: "Time" },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
              {
                key: "prescription",
                header: "Prescription",
                render: (r) => {
                  const prescriptions = getPrescriptionsForAppointment(r.appointment_id);
                  return prescriptions.length > 0 ? (
                    <span className="text-xs text-status-success">Issued</span>
                  ) : r.status === "Completed" ? (
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/doctor/prescriptions/add?appointmentId=${r.appointment_id}`)}>
                      Add Prescription
                    </Button>
                  ) : (
                    <span className="text-xs text-text-muted">—</span>
                  );
                },
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}

export default PatientDetails;