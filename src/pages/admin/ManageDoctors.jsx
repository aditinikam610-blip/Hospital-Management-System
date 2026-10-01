import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const [viewing, setViewing] = useState(null);

  // Edit
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    department: "",
    phone_no: "",
  });

  // Delete
  const [deleting, setDeleting] = useState(null);

  // Fetch doctors from MongoDB
  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await api.get("/doctors");

      if (response.data.success) {
        setDoctors(response.data.doctors || []);
      }
    } catch (error) {
      console.error("Failed to load doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Department options
  const departmentOptions = useMemo(() => {
    return [
      ...new Set(
        doctors
          .map((doctor) => doctor.department)
          .filter(Boolean)
      ),
    ].map((department) => ({
      value: department,
      label: department,
    }));
  }, [doctors]);

  // Search and filter
  const filtered = doctors.filter((doctor) => {
    const name =
      doctor.name ||
      doctor.full_name ||
      "";

    const matchesSearch = name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDept =
      !department ||
      doctor.department === department;

    return matchesSearch && matchesDept;
  });

  // Open edit modal
  const handleEdit = (doctor) => {
    setEditing(doctor);

    setForm({
      name: doctor.name || doctor.full_name || "",
      specialization: doctor.specialization || "",
      department: doctor.department || "",
      phone_no: doctor.phone_no || "",
    });
  };

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Save edited doctor
  const handleSaveEdit = async () => {
    try {
      const response = await api.put(
        `/admin/doctors/${editing._id}`,
        {
          name: form.name,
          specialization: form.specialization,
          department: form.department,
          phone_no: form.phone_no,
        }
      );

      if (response.data.success) {
        alert("Doctor updated successfully");

        setEditing(null);

        await fetchDoctors();
      }
    } catch (error) {
      console.error("Failed to update doctor:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update doctor"
      );
    }
  };

  // Delete doctor
  const handleConfirmDelete = async () => {
    try {
      const response = await api.delete(
        `/admin/doctors/${deleting._id}`
      );

      if (response.data.success) {
        alert("Doctor deleted successfully");

        setDeleting(null);

        await fetchDoctors();
      }
    } catch (error) {
      console.error("Failed to delete doctor:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete doctor"
      );
    }
  };

  if (loading) {
    return (
      <Card title="Manage Doctors">
        <p className="text-sm text-text-muted">
          Loading doctors...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Manage Doctors">

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
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

        <Select
          placeholder="All departments"
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
          options={departmentOptions}
        />
      </div>

      {/* Doctors Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="No doctors are currently available."
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
              header: "Doctor",
              render: (r) =>
                r.name ||
                r.full_name ||
                "-",
            },

            {
              key: "specialization",
              header: "Specialization",
              render: (r) =>
                r.specialization || "-",
            },

            {
              key: "department",
              header: "Department",
              render: (r) =>
                r.department || "-",
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
                <div className="flex flex-wrap gap-2">

                  {/* View */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setViewing(r)
                    }
                  >
                    View
                  </Button>

                  {/* Edit */}
                  <Button
                    size="sm"
                    onClick={() =>
                      handleEdit(r)
                    }
                  >
                    Edit
                  </Button>

                  {/* Delete */}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      setDeleting(r)
                    }
                  >
                    Delete
                  </Button>

                </div>
              ),
            },
          ]}
        />
      )}

      {/* ================= VIEW DOCTOR ================= */}
      <Modal
        open={!!viewing}
        onClose={() =>
          setViewing(null)
        }
        title="Doctor Details"
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
                Specialization:
              </span>{" "}
              {viewing.specialization ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Department:
              </span>{" "}
              {viewing.department ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Phone:
              </span>{" "}
              {viewing.phone_no ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Account ID:
              </span>{" "}
              {viewing.account_id ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Doctor ID:
              </span>{" "}
              {viewing._id ||
                "-"}
            </p>

          </div>
        )}
      </Modal>

      {/* ================= EDIT DOCTOR ================= */}
      <Modal
        open={!!editing}
        onClose={() =>
          setEditing(null)
        }
        title="Edit Doctor"
      >
        {editing && (
          <div className="space-y-4">

            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Doctor name"
            />

            <Input
              label="Specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Specialization"
            />

            <Input
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
            />

            <Input
              label="Phone"
              name="phone_no"
              value={form.phone_no}
              onChange={handleChange}
              placeholder="Phone number"
            />

            <div className="flex justify-end gap-2">

              <Button
                variant="secondary"
                onClick={() =>
                  setEditing(null)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>

            </div>

          </div>
        )}
      </Modal>

      {/* ================= DELETE DOCTOR ================= */}
      <Modal
        open={!!deleting}
        onClose={() =>
          setDeleting(null)
        }
        title="Delete Doctor"
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

            <p className="text-sm text-text-muted">
              This will permanently remove the
              doctor and related records.
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
                onClick={handleConfirmDelete}
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

export default ManageDoctors;