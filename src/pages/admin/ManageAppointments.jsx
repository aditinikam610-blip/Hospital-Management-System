import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

const STATUS_OPTIONS = [
  "Pending",
  "Accepted",
  "Rejected",
  "Cancelled",
  "Completed",
];

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [viewing, setViewing] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch appointments and doctors from MongoDB
  const fetchData = async () => {
    try {
      const [appointmentResponse, doctorResponse] =
        await Promise.all([
          api.get("/admin/appointments"),
          api.get("/admin/doctors"),
        ]);

      if (appointmentResponse.data.success) {
        setAppointments(
          appointmentResponse.data.appointments || []
        );
      }

      if (doctorResponse.data.success) {
        setDoctors(
          doctorResponse.data.doctors || []
        );
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
    fetchData();
  }, []);

  // Filter appointments
  const filteredAppointments = appointments.filter(
    (appointment) => {
      const patientName =
        appointment.patient_id?.name ||
        appointment.patient_id?.full_name ||
        appointment.patient?.name ||
        "";

      const doctorName =
        appointment.doctor_id?.name ||
        appointment.doctor_id?.full_name ||
        appointment.doctor?.name ||
        "";

      const matchesSearch =
        patientName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        doctorName
          .toLowerCase()
          .includes(search.toLowerCase());

      const appointmentDoctorId =
        appointment.doctor_id?._id ||
        appointment.doctor_id ||
        appointment.doctor?.doctor_id;

      const matchesDoctor =
        !doctorFilter ||
        String(appointmentDoctorId) ===
          String(doctorFilter);

      const matchesStatus =
        !statusFilter ||
        appointment.status === statusFilter;

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesStatus
      );
    }
  );

  // Update appointment status
  const handleUpdateStatus = async () => {
    if (!editingStatus || !newStatus) return;

    try {
      await api.put(
  `/appointments/admin/${editingStatus._id}/status`,
        {
          status: newStatus,
        }
      );

      setEditingStatus(null);

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error(
        "Failed to update appointment status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update appointment status."
      );
    }
  };

  if (loading) {
    return (
      <Card title="Manage Appointments">
        <p className="text-sm text-text-muted">
          Loading appointments...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Manage Appointments">
      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          placeholder="Search patient or doctor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          placeholder="All doctors"
          value={doctorFilter}
          onChange={(e) =>
            setDoctorFilter(e.target.value)
          }
          options={doctors.map((doctor) => ({
            value: String(
              doctor._id || doctor.doctor_id
            ),
            label:
              doctor.name ||
              doctor.full_name ||
              "Doctor",
          }))}
        />

        <Select
          placeholder="All statuses"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          options={STATUS_OPTIONS.map((status) => ({
            value: status,
            label: status,
          }))}
        />
      </div>

      {/* Appointments */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="No appointments match the selected filters."
        />
      ) : (
        <Table
          rows={filteredAppointments}
          rowKey="_id"
          columns={[
            {
              key: "_id",
              header: "ID",
            },

            {
              key: "patient_id",
              header: "Patient",
              render: (r) =>
                r.patient_id?.name ||
                r.patient_id?.full_name ||
                r.patient?.name ||
                "-",
            },

            {
              key: "doctor_id",
              header: "Doctor",
              render: (r) =>
                r.doctor_id?.name ||
                r.doctor_id?.full_name ||
                r.doctor?.name ||
                "-",
            },

            {
              key: "date",
              header: "Date",
              render: (r) =>
                r.date
                  ? format(
                      parseISO(r.date),
                      "dd MMM yyyy"
                    )
                  : "-",
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
                      setViewing(r)
                    }
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingStatus(r);
                      setNewStatus(
                        r.status
                      );
                    }}
                  >
                    Update Status
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* View Appointment */}
      <Modal
        open={!!viewing}
        onClose={() =>
          setViewing(null)
        }
        title="Appointment Details"
      >
        {viewing && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-text-muted">
                Patient:
              </span>{" "}
              {viewing.patient_id?.name ||
                viewing.patient_id?.full_name ||
                viewing.patient?.name ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Doctor:
              </span>{" "}
              {viewing.doctor_id?.name ||
                viewing.doctor_id?.full_name ||
                viewing.doctor?.name ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Department:
              </span>{" "}
              {viewing.doctor_id?.department ||
                viewing.doctor?.department ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Date:
              </span>{" "}
              {viewing.date
                ? format(
                    parseISO(viewing.date),
                    "dd MMM yyyy"
                  )
                : "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Time:
              </span>{" "}
              {viewing.time || "-"}
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

      {/* Update Status */}
      <Modal
        open={!!editingStatus}
        onClose={() =>
          setEditingStatus(null)
        }
        title="Update Appointment Status"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() =>
                setEditingStatus(null)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdateStatus}
            >
              Save
            </Button>
          </>
        }
      >
        <Select
          label="Status"
          value={newStatus}
          onChange={(e) =>
            setNewStatus(e.target.value)
          }
          options={STATUS_OPTIONS.map(
            (status) => ({
              value: status,
              label: status,
            })
          )}
        />
      </Modal>
    </Card>
  );
}

export default ManageAppointments;