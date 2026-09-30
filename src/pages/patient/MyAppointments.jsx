import { useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getAppointmentsByPatient, enrichAppointment, updateAppointmentStatus } from "../../utils/dataHelpers";
import { CANCELLABLE_STATUSES } from "../../constants/appointmentConfig";

function MyAppointments() {
  const { profile } = useAuth();
  const [version, setVersion] = useState(0); // bump to force re-read of mock data after mutation
  const [viewing, setViewing] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const appointments = getAppointmentsByPatient(profile.patient_id).map(enrichAppointment);

  const handleCancel = () => {
    updateAppointmentStatus(cancelling.appointment_id, "Cancelled");
    setCancelling(null);
    setVersion((v) => v + 1);
  };

  return (
    <Card title="My Appointments">
      {appointments.length === 0 ? (
        <EmptyState title="No appointments found" description="Book your first appointment to see it here." />
      ) : (
        <Table
          rows={appointments}
          rowKey="appointment_id"
          columns={[
            { key: "appointment_id", header: "ID" },
            { key: "doctor", header: "Doctor", render: (r) => r.doctor?.name },
            { key: "department", header: "Department", render: (r) => r.doctor?.department },
            { key: "date", header: "Date", render: (r) => format(parseISO(r.date), "dd MMM yyyy") },
            { key: "time", header: "Time" },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setViewing(r)}>
                    View
                  </Button>
                  {CANCELLABLE_STATUSES.includes(r.status) && (
                    <Button size="sm" variant="danger" onClick={() => setCancelling(r)}>
                      Cancel
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Appointment Details">
        {viewing && (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Doctor:</span> {viewing.doctor?.name}</p>
            <p><span className="text-text-muted">Department:</span> {viewing.doctor?.department}</p>
            <p><span className="text-text-muted">Date:</span> {format(parseISO(viewing.date), "dd MMM yyyy")}</p>
            <p><span className="text-text-muted">Time:</span> {viewing.time}</p>
            <p className="flex items-center gap-2">
              <span className="text-text-muted">Status:</span> <StatusBadge status={viewing.status} />
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        title="Cancel appointment?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelling(null)}>Keep appointment</Button>
            <Button variant="danger" onClick={handleCancel}>Cancel appointment</Button>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          This will cancel your appointment with {cancelling?.doctor?.name} on{" "}
          {cancelling && format(parseISO(cancelling.date), "dd MMM yyyy")}.
        </p>
      </Modal>
    </Card>
  );
}

export default MyAppointments;