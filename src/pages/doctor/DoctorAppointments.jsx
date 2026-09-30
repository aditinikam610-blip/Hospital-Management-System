import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getAppointmentsByDoctor, enrichAppointment, updateAppointmentStatus } from "../../utils/dataHelpers";

function DoctorAppointments() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const [confirmAction, setConfirmAction] = useState(null); // { appointment, action: 'Accepted' | 'Rejected' }

  const appointments = getAppointmentsByDoctor(profile.doctor_id).map(enrichAppointment);

  const handleConfirm = () => {
    updateAppointmentStatus(confirmAction.appointment.appointment_id, confirmAction.action);
    setConfirmAction(null);
    setVersion((v) => v + 1);
  };

  return (
    <Card title="Appointments">
      {appointments.length === 0 ? (
        <EmptyState title="No appointments found" />
      ) : (
        <Table
          rows={appointments}
          rowKey="appointment_id"
          columns={[
            { key: "patient", header: "Patient", render: (r) => r.patient?.name },
            { key: "date", header: "Date", render: (r) => format(parseISO(r.date), "dd MMM yyyy") },
            { key: "time", header: "Time" },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/doctor/patients/${r.patient_id}`)}
                  >
                    View Patient
                  </Button>
                  {r.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => setConfirmAction({ appointment: r, action: "Accepted" })}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setConfirmAction({ appointment: r, action: "Rejected" })}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.action === "Accepted" ? "Accept appointment?" : "Reject appointment?"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmAction(null)}>Go back</Button>
            <Button
              variant={confirmAction?.action === "Rejected" ? "danger" : "primary"}
              onClick={handleConfirm}
            >
              {confirmAction?.action === "Accepted" ? "Accept" : "Reject"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          {confirmAction?.action === "Accepted" ? "Accept" : "Reject"} the appointment with{" "}
          {confirmAction?.appointment.patient?.name} on{" "}
          {confirmAction && format(parseISO(confirmAction.appointment.date), "dd MMM yyyy")}?
        </p>
      </Modal>
    </Card>
  );
}

export default DoctorAppointments;