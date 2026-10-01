import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function PatientDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPatientDetails = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await api.get("/appointments/doctor/my");

        const appointments = response.data.appointments || [];

        // Find appointments belonging to this patient
        const patientAppointments = appointments.filter((appointment) => {
          const appointmentPatient =
            appointment.patient_id || appointment.patient;

          if (!appointmentPatient) return false;

          const patientId =
            appointmentPatient._id ||
            appointmentPatient.patient_id;

          return patientId?.toString() === id?.toString();
        });

        if (patientAppointments.length === 0) {
          setError(true);
          return;
        }

        // Get patient information from the appointment
        const firstAppointment = patientAppointments[0];

        const patientData =
          firstAppointment.patient_id ||
          firstAppointment.patient;

        if (!patientData) {
          setError(true);
          return;
        }

        setPatient({
          patient_id:
            patientData._id ||
            patientData.patient_id,

          name: patientData.name || "-",
          age: patientData.age ?? "-",
          gender: patientData.gender || "-",
          phone_no: patientData.phone_no || "-",
          address: patientData.address || "-",
        });

        setAppointmentHistory(patientAppointments);
      } catch (err) {
        console.error(
          "Failed to load patient details:",
          err.response?.data || err.message
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.doctor_id && id) {
      loadPatientDetails();
    }
  }, [id, profile]);

  if (loading) {
    return (
      <Card title="Patient Details">
        <div className="py-10 text-center text-text-muted">
          Loading patient details...
        </div>
      </Card>
    );
  }

  if (error || !patient) {
    return (
      <ErrorState
        title="Patient not found"
        onRetry={() => navigate("/doctor/patients")}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* PATIENT PROFILE */}
      <Card title="Patient Profile">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {[
            ["Patient ID", String(patient.patient_id).slice(-6)],
            ["Name", patient.name],
            ["Age", patient.age],
            ["Gender", patient.gender],
            ["Phone Number", patient.phone_no],
            ["Address", patient.address],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-text-muted">
                {label}
              </dt>

              <dd className="text-sm font-medium text-text">
                {value}
              </dd>
            </div>
          ))}

        </dl>
      </Card>


      {/* APPOINTMENT HISTORY */}
      <Card title="Appointment History (with you)">
        {appointmentHistory.length === 0 ? (
          <EmptyState title="No appointment history" />
        ) : (
          <Table
            rows={appointmentHistory}
            rowKey={(row) => row._id || row.appointment_id}
            columns={[
              {
                key: "date",
                header: "Date",
                render: (row) => {
                  const date =
                    row.date ||
                    row.appointment_date;

                  if (!date) return "-";

                  try {
                    return format(
                      parseISO(date),
                      "dd MMM yyyy"
                    );
                  } catch {
                    return date;
                  }
                },
              },

              {
                key: "time",
                header: "Time",
                render: (row) =>
                  row.time ||
                  row.appointment_time ||
                  "-",
              },

              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <StatusBadge
                    status={row.status}
                  />
                ),
              },

              {
                key: "prescription",
                header: "Prescription",
                render: (row) => {
                  const appointmentId =
                    row._id ||
                    row.appointment_id;

                  if (row.status === "Completed") {
                    return (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          navigate(
                            `/doctor/prescriptions/add?appointmentId=${appointmentId}`
                          )
                        }
                      >
                        Add Prescription
                      </Button>
                    );
                  }

                  return (
                    <span className="text-xs text-text-muted">
                      —
                    </span>
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