
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

function DoctorAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmAction, setConfirmAction] =
    useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/appointments/doctor/my"
      );

      if (response.data.success) {
        const formattedAppointments =
          response.data.appointments.map(
            (appointment) => ({
              appointment_id: appointment._id,
              patient_id: appointment.patient_id?._id,
              date: appointment.date,
              time: appointment.time,
              status: appointment.status,
              patient: appointment.patient_id,
            })
          );

        setAppointments(formattedAppointments);
      }
    } catch (error) {
      console.error(
        "Failed to load doctor appointments:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      await api.put(
        `/appointments/${confirmAction.appointment.appointment_id}/status`,
        {
          status: confirmAction.action,
        }
      );

      setConfirmAction(null);

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Failed to update appointment:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update appointment."
      );
    }
  };

  if (loading) {
    return (
      <Card title="Appointments">
        <p className="text-sm text-text-muted">
          Loading appointments...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Appointments">
      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="Patient appointments will appear here."
        />
      ) : (
        <Table
          rows={appointments}
          rowKey="appointment_id"
          columns={[
            {
              key: "patient",
              header: "Patient",
              render: (r) =>
                r.patient?.name || "N/A",
            },

            {
              key: "date",
              header: "Date",
              render: (r) =>
                format(
                  parseISO(r.date),
                  "dd MMM yyyy"
                ),
            },

            {
              key: "time",
              header: "Time",
            },

            {
              key: "status",
              header: "Status",
              render: (r) => (
                <StatusBadge
                  status={r.status}
                />
              ),
            },

            {
              key: "actions",
              header: "Actions",

              render: (r) => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/doctor/patients/${r.patient_id}`
                      )
                    }
                  >
                    View Patient
                  </Button>

                  {r.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          setConfirmAction({
                            appointment: r,
                            action: "Accepted",
                          })
                        }
                      >
                        Accept
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          setConfirmAction({
                            appointment: r,
                            action: "Rejected",
                          })
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {r.status === "Accepted" && (
  <>
    <Button
      size="sm"
      variant="secondary"
      onClick={() =>
        navigate(
          `/doctor/prescriptions/add?appointmentId=${r.appointment_id}`
        )
      }
    >
      Add Prescription
    </Button>

    <Button
      size="sm"
      onClick={() =>
        setConfirmAction({
          appointment: r,
          action: "Completed",
        })
      }
    >
      Complete
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
        onClose={() =>
          setConfirmAction(null)
        }
        title={
          confirmAction?.action === "Accepted"
            ? "Accept appointment?"
            : "Reject appointment?"
        }
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() =>
                setConfirmAction(null)
              }
            >
              Go back
            </Button>

            <Button
              variant={
                confirmAction?.action === "Rejected"
                  ? "danger"
                  : "primary"
              }
              onClick={handleConfirm}
            >
              {confirmAction?.action === "Accepted"
                ? "Accept"
                : "Reject"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          {confirmAction?.action === "Accepted"
            ? "Accept"
            : "Reject"}{" "}
          the appointment with{" "}
          {confirmAction?.appointment?.patient?.name}{" "}
          on{" "}
          {confirmAction &&
            format(
              parseISO(
                confirmAction.appointment.date
              ),
              "dd MMM yyyy"
            )}
          ?
        </p>
      </Modal>
    </Card>
  );
}

export default DoctorAppointments;
