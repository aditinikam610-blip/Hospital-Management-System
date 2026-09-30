import { useState } from "react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { updateDoctorProfile } from "../../utils/dataHelpers";

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.specialization.trim()) errors.specialization = "Specialization is required.";
  if (!form.department.trim()) errors.department = "Department is required.";
  if (!/^\d{10}$/.test(form.phone_no)) errors.phone_no = "Enter a valid 10-digit phone number.";
  return errors;
}

const DEPARTMENTS = ["Cardiology", "Neurology", "Dermatology", "Orthopedics", "Pediatrics"];

function DoctorProfile() {
  const { profile, account } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    updateDoctorProfile(profile.doctor_id, {
      name: form.name,
      specialization: form.specialization,
      department: form.department,
      phone_no: form.phone_no,
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setForm({ ...profile });
    setErrors({});
    setEditing(false);
  };

  return (
    <Card
      title="Doctor Profile"
      action={!editing && <Button size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>}
    >
      {saved && (
        <p className="mb-4 rounded-card bg-status-success-bg px-3 py-2 text-sm text-status-success">
          Profile updated successfully.
        </p>
      )}

      {!editing ? (
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["Name", profile.name],
            ["Email", account.email],
            ["Specialization", profile.specialization],
            ["Department", profile.department],
            ["Phone Number", profile.phone_no],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-text-muted">{label}</dt>
              <dd className="text-sm font-medium text-text">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="max-w-lg space-y-4">
          <Input label="Name" required value={form.name} onChange={handleChange("name")} error={errors.name} />
          <Input label="Email" value={account.email} disabled className="opacity-60" />
          <Select
            label="Department"
            required
            value={form.department}
            onChange={handleChange("department")}
            error={errors.department}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          />
          <Input
            label="Specialization"
            required
            value={form.specialization}
            onChange={handleChange("specialization")}
            error={errors.specialization}
          />
          <Input label="Phone Number" required value={form.phone_no} onChange={handleChange("phone_no")} error={errors.phone_no} />

          <div className="flex gap-2">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default DoctorProfile;