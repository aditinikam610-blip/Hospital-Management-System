import { useState } from "react";
import { Search } from "lucide-react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { doctors } from "../../data/mock/doctors";
import { deleteDoctor, updateDoctorRecord } from "../../utils/dataHelpers";

function ManageDoctors() {
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({});

  const departmentOptions = [...new Set(doctors.map((d) => d.department))].map((d) => ({ value: d, label: d }));

  const filtered = doctors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !department || d.department === department;
    return matchesSearch && matchesDept;
  });

  const openEdit = (doctor) => {
    setForm({ ...doctor });
    setEditing(doctor);
  };

  const handleSaveEdit = () => {
    updateDoctorRecord(editing.doctor_id, {
      name: form.name,
      specialization: form.specialization,
      department: form.department,
      phone_no: form.phone_no,
    });
    setEditing(null);
    setVersion((v) => v + 1);
  };

  const handleDelete = () => {
    deleteDoctor(deleting.doctor_id);
    setDeleting(null);
    setVersion((v) => v + 1);
  };

  return (
    <Card title="Manage Doctors">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          placeholder="All departments"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={departmentOptions}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No doctors found" />
      ) : (
        <Table
          rows={filtered}
          rowKey="doctor_id"
          columns={[
            { key: "doctor_id", header: "ID" },
            { key: "name", header: "Doctor" },
            { key: "specialization", header: "Specialization" },
            { key: "department", header: "Department" },
            { key: "phone_no", header: "Contact" },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setViewing(r)}>View</Button>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleting(r)}>Delete</Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Doctor Details">
        {viewing && (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Name:</span> {viewing.name}</p>
            <p><span className="text-text-muted">Specialization:</span> {viewing.specialization}</p>
            <p><span className="text-text-muted">Department:</span> {viewing.department}</p>
            <p><span className="text-text-muted">Phone:</span> {viewing.phone_no}</p>
            <p><span className="text-text-muted">Account ID:</span> {viewing.account_id}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Doctor"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Specialization" value={form.specialization} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))} />
            <Input label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
            <Input label="Phone" value={form.phone_no} onChange={(e) => setForm((f) => ({ ...f, phone_no: e.target.value }))} />
          </div>
        )}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete doctor?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          This will permanently remove {deleting?.name} from the system. This cannot be undone.
        </p>
      </Modal>
    </Card>
  );
}

export default ManageDoctors;