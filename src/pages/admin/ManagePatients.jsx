import { useEffect, useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    phone_no: "",
  });

  // =========================
  // FETCH PATIENTS
  // =========================
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/patients");

      if (response.data.success) {
        setPatients(response.data.patients || []);
      }
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const filtered = patients.filter((patient) => {
    const name =
      patient.name ||
      patient.full_name ||
      "";

    return name
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const openEdit = (patient) => {
    setEditing(patient);

    setForm({
      name: patient.name || patient.full_name || "",
      age: patient.age ?? "",
      gender: patient.gender || "",
      address: patient.address || "",
      phone_no: patient.phone_no || "",
    });
  };

  // =========================
  // EDIT PATIENT
  // =========================
  const handleUpdate = async () => {
    try {
      const response = await api.put(
        `/admin/patients/${editing._id}`,
        {
          name: form.name,
          age: Number(form.age),
          gender: form.gender,
          address: form.address,
          phone_no: form.phone_no,
        }
      );

      if (response.data.success) {
        alert("Patient updated successfully");

        setEditing(null);
        await fetchPatients();
      }
    } catch (error) {
      console.error("Failed to update patient:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update patient"
      );
    }
  };

  // =========================
  // DELETE PATIENT
  // =========================
  const handleDelete = async () => {
    try {
      const response = await api.delete(
        `/admin/patients/${deleting._id}`
      );

      if (response.data.success) {
        alert("Patient deleted successfully");

        setDeleting(null);
        await fetchPatients();
      }
    } catch (error) {
      console.error("Failed to delete patient:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete patient"
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <Card title="Manage Patients">
        <p className="text-sm text-text-muted">
          Loading patients...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Manage Patients">

      {/* ================= SEARCH ================= */}
      <div className="mb-4 relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />

        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="pl-9"
        />
      </div>

      {/* ================= TABLE ================= */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="No patients are currently available."
        />
      ) : (
        <Table
          rows={filtered}
          rowKey="_id"
          columns={[
            {
              key: "_id",
              header: "ID",
            },

            {
              key: "name",
              header: "Patient",
              render: (r) =>
                r.name ||
                r.full_name ||
                "-",
            },

            {
              key: "age",
              header: "Age",
              render: (r) =>
                r.age ?? "-",
            },

            {
              key: "gender",
              header: "Gender",
              render: (r) =>
                r.gender || "-",
            },

            {
              key: "phone_no",
              header: "Contact",
              render: (r) =>
                r.phone_no || "-",
            },

            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div className="flex gap-2">

                  {/* VIEW */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setViewing(r)
                    }
                  >
                    View
                  </Button>

                  {/* EDIT */}
                  <Button
                    size="sm"
                    onClick={() =>
                      openEdit(r)
                    }
                  >
                    <Pencil size={14} />
                  </Button>

                  {/* DELETE */}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      setDeleting(r)
                    }
                  >
                    <Trash2 size={14} />
                  </Button>

                </div>
              ),
            },
          ]}
        />
      )}

      {/* ================= VIEW PATIENT ================= */}
      <Modal
        open={!!viewing}
        onClose={() =>
          setViewing(null)
        }
        title="Patient Details"
      >
        {viewing && (
          <div className="space-y-2 text-sm">

            <p>
              <span className="text-text-muted">
                Name:
              </span>{" "}
              {viewing.name ||
                viewing.full_name ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Age:
              </span>{" "}
              {viewing.age ?? "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Gender:
              </span>{" "}
              {viewing.gender || "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Address:
              </span>{" "}
              {viewing.address || "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Phone:
              </span>{" "}
              {viewing.phone_no || "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Account ID:
              </span>{" "}
              {viewing.account_id || "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Patient ID:
              </span>{" "}
              {viewing._id || "-"}
            </p>

          </div>
        )}
      </Modal>

      {/* ================= EDIT PATIENT ================= */}
      <Modal
        open={!!editing}
        onClose={() =>
          setEditing(null)
        }
        title="Edit Patient"
      >
        {editing && (
          <div className="space-y-4">

            <Input
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <Input
              label="Age"
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: e.target.value,
                })
              }
            />

            <Input
              label="Gender"
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value,
                })
              }
            />

            <Input
              label="Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />

            <Input
              label="Phone"
              value={form.phone_no}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone_no: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2 pt-2">

              <Button
                variant="secondary"
                onClick={() =>
                  setEditing(null)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleUpdate}
              >
                Save Changes
              </Button>

            </div>

          </div>
        )}
      </Modal>

      {/* ================= DELETE CONFIRMATION ================= */}
      <Modal
        open={!!deleting}
        onClose={() =>
          setDeleting(null)
        }
        title="Delete Patient"
      >
        {deleting && (
          <div className="space-y-4">

            <p className="text-sm">
              Are you sure you want to delete{" "}
              <strong>
                {deleting.name ||
                  deleting.full_name}
              </strong>
              ?
            </p>

            <p className="text-sm text-red-500">
              This will permanently delete the
              patient and related records.
            </p>

            <div className="flex justify-end gap-2">

              <Button
                variant="secondary"
                onClick={() =>
                  setDeleting(null)
                }
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleDelete}
              >
                Delete
              </Button>

            </div>

          </div>
        )}
      </Modal>

    </Card>
  );
}

export default ManagePatients;