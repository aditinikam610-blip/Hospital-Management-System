import { useState } from "react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { updatePatientProfile } from "../../utils/dataHelpers";

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.age || Number(form.age) <= 0 || Number(form.age) > 120) errors.age = "Enter a valid age.";
  if (!form.gender) errors.gender = "Select a gender.";
  if (!form.address.trim()) errors.address = "Address is required.";
  if (!/^\d{10}$/.test(form.phone_no)) errors.phone_no = "Enter a valid 10-digit phone number.";
  return errors;
}

function PatientProfile() {
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

    updatePatientProfile(profile.patient_id, {
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      address: form.address,
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
      title="Patient Profile"
      action={
        !editing && (
          <Button size="sm" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )
      }
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
            ["Age", profile.age],
            ["Gender", profile.gender],
            ["Phone Number", profile.phone_no],
            ["Address", profile.address],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-text-muted">{label}</dt>
              <dd className="text-sm font-medium text-text">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="space-y-4">
          <Input label="Name" required value={form.name} onChange={handleChange("name")} error={errors.name} />
          <Input label="Email" value={account.email} disabled className="opacity-60" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Age" type="number" required value={form.age} onChange={handleChange("age")} error={errors.age} />
            <Select
              label="Gender"
              required
              value={form.gender}
              onChange={handleChange("gender")}
              error={errors.gender}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
          </div>
          <Input label="Phone Number" required value={form.phone_no} onChange={handleChange("phone_no")} error={errors.phone_no} />
          <Input label="Address" required value={form.address} onChange={handleChange("address")} error={errors.address} />

          <div className="flex gap-2">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default PatientProfile;