
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";

import { CANCELLABLE_STATUSES } from "../../constants/appointmentConfig";
import api from "../../services/api";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewing, setViewing] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  // ============================
  // LOAD REAL APPOINTMENTS
  // ============================
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/appointments/my"
      );

      if (response.data.success) {
        const formattedAppointments =
          response.data.appointments.map(
            (appointment) => ({
              appointment_id: appointment._id,
              date: appointment.date,
              time: appointment.time,
              status: appointment.status,

              doctor: appointment.doctor_id,
            })
          );

        setAppointments(formattedAppointments);
      }
    } catch (error) {
      console.error(
        "Failed to load appointments:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ============================
  // CANCEL APPOINTMENT
  // ============================
  const handleCancel = async () => {
    if (!cancelling) return;

    try {
      await api.put(
        `/appointments/${cancelling.appointment_id}/cancel`
      );

      setCancelling(null);

      // Reload from MongoDB
      await fetchAppointments();
    } catch (error) {
      console.error(
        "Failed to cancel appointment:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to cancel appointment."
      );
    }
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <Card title="My Appointments">
        <p className="text-sm text-text-muted">
          Loading appointments...
        </p>
      </Card>
    );
  }

  return (
    <Card title="My Appointments">

      {/* NO APPOINTMENTS */}
      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="Book your first appointment to see it here."
        />
      ) : (
        <Table
          rows={appointments}
          rowKey="appointment_id"
          columns={[
            {
              key: "appointment_id",
              header: "ID",
              render: (r) =>
                r.appointment_id
                  ?.toString()
                  .slice(-6),
            },

            {
              key: "doctor",
              header: "Doctor",
              render: (r) =>
                r.doctor?.name || "N/A",
            },

            {
              key: "department",
              header: "Department",
              render: (r) =>
                r.doctor?.department || "N/A",
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
                <div className="flex gap-2">

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setViewing(r)
                    }
                  >
                    View
                  </Button>

                  {CANCELLABLE_STATUSES.includes(
                    r.status
                  ) && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        setCancelling(r)
                      }
                    >
                      Cancel
                    </Button>
                  )}

                </div>
              ),
            },
          ]}
        />
      )}

      {/* ============================
          VIEW APPOINTMENT
      ============================ */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Appointment Details"
      >
        {viewing && (
          <div className="space-y-2 text-sm">

            <p>
              <span className="text-text-muted">
                Doctor:
              </span>{" "}
              {viewing.doctor?.name}
            </p>

            <p>
              <span className="text-text-muted">
                Department:
              </span>{" "}
              {viewing.doctor?.department}
            </p>

            <p>
              <span className="text-text-muted">
                Specialization:
              </span>{" "}
              {viewing.doctor?.specialization}
            </p>

            <p>
              <span className="text-text-muted">
                Date:
              </span>{" "}
              {format(
                parseISO(viewing.date),
                "dd MMM yyyy"
              )}
            </p>

            <p>
              <span className="text-text-muted">
                Time:
              </span>{" "}
              {viewing.time}
            </p>

            <p className="flex items-center gap-2">
              <span className="text-text-muted">
                Status:
              </span>

              <StatusBadge
                status={viewing.status}
              />
            </p>

          </div>
        )}
      </Modal>

      {/* ============================
          CANCEL CONFIRMATION
      ============================ */}
      <Modal
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        title="Cancel appointment?"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() =>
                setCancelling(null)
              }
            >
              Keep appointment
            </Button>

            <Button
              variant="danger"
              onClick={handleCancel}
            >
              Cancel appointment
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          This will cancel your appointment with{" "}
          {cancelling?.doctor?.name} on{" "}
          {cancelling &&
            format(
              parseISO(cancelling.date),
              "dd MMM yyyy"
            )}
          .
        </p>
      </Modal>

    </Card>
  );
}

export default MyAppointments;
