import { useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { doctors } from "../../data/mock/doctors";
import { patients } from "../../data/mock/patients";
import { getAllAppointmentsEnriched, updateAppointmentStatus } from "../../utils/dataHelpers";

const STATUS_OPTIONS = ["Pending", "Accepted", "Rejected", "Cancelled", "Completed"];

function ManageAppointments() {
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const appointments = getAllAppointmentsEnriched().filter((a) => {
    const matchesSearch =
      a.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor?.name.toLowerCase().includes(search.toLowerCase());
    const matchesDoctor = !doctorFilter || a.doctor_id === Number(doctorFilter);
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesDoctor && matchesStatus;
  });

  const handleUpdateStatus = () => {
    updateAppointmentStatus(editingStatus.appointment_id, newStatus);
    setEditingStatus(null);
    setVersion((v) => v + 1);
  };

  return (
    <Card title="Manage Appointments">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input placeholder="Search patient or doctor" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select
          placeholder="All doctors"
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          options={doctors.map((d) => ({ value: String(d.doctor_id), label: d.name }))}
        />
        <Select
          placeholder="All statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
        />
      </div>

      {appointments.length === 0 ? (
        <EmptyState title="No appointments found" />
      ) : (
        <Table
          rows={appointments}
          rowKey="appointment_id"
          columns={[
            { key: "appointment_id", header: "ID" },
            { key: "patient", header: "Patient", render: (r) => r.patient?.name },
            { key: "doctor", header: "Doctor", render: (r) => r.doctor?.name },
            { key: "date", header: "Date", render: (r) => format(parseISO(r.date), "dd MMM yyyy") },
            { key: "time", header: "Time" },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setViewing(r)}>View</Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingStatus(r);
                      setNewStatus(r.status);
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

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Appointment Details">
        {viewing && (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Patient:</span> {viewing.patient?.name}</p>
            <p><span className="text-text-muted">Doctor:</span> {viewing.doctor?.name} ({viewing.doctor?.department})</p>
            <p><span className="text-text-muted">Date:</span> {format(parseISO(viewing.date), "dd MMM yyyy")}</p>
            <p><span className="text-text-muted">Time:</span> {viewing.time}</p>
            <p className="flex items-center gap-2"><span className="text-text-muted">Status:</span> <StatusBadge status={viewing.status} /></p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!editingStatus}
        onClose={() => setEditingStatus(null)}
        title="Update Appointment Status"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingStatus(null)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Save</Button>
          </>
        }
      >
        <Select
          label="Status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
        />
      </Modal>
    </Card>
  );
}

export default ManageAppointments;