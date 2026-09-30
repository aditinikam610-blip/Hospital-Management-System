import { useState } from "react";
import { Search } from "lucide-react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { patients } from "../../data/mock/patients";
import { deletePatient, updatePatientRecord } from "../../utils/dataHelpers";

function ManagePatients() {
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({});

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (patient) => {
    setForm({ ...patient });
    setEditing(patient);
  };

  const handleSaveEdit = () => {
    updatePatientRecord(editing.patient_id, {
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      address: form.address,
      phone_no: form.phone_no,
    });
    setEditing(null);
    setVersion((v) => v + 1);
  };

  const handleDelete = () => {
    deletePatient(deleting.patient_id);
    setDeleting(null);
    setVersion((v) => v + 1);
  };

  return (
    <Card title="Manage Patients">
      <div className="mb-4 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <Input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No patients found" />
      ) : (
        <Table
          rows={filtered}
          rowKey="patient_id"
          columns={[
            { key: "patient_id", header: "ID" },
            { key: "name", header: "Patient" },
            { key: "age", header: "Age" },
            { key: "gender", header: "Gender" },
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

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Patient Details">
        {viewing && (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Name:</span> {viewing.name}</p>
            <p><span className="text-text-muted">Age:</span> {viewing.age}</p>
            <p><span className="text-text-muted">Gender:</span> {viewing.gender}</p>
            <p><span className="text-text-muted">Address:</span> {viewing.address}</p>
            <p><span className="text-text-muted">Phone:</span> {viewing.phone_no}</p>
            <p><span className="text-text-muted">Account ID:</span> {viewing.account_id}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Patient"
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
            <div className="grid grid-cols-2 gap-4">
              <Input label="Age" type="number" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
              <Input label="Gender" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} />
            </div>
            <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            <Input label="Phone" value={form.phone_no} onChange={(e) => setForm((f) => ({ ...f, phone_no: e.target.value }))} />
          </div>
        )}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete patient?"
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

export default ManagePatients;