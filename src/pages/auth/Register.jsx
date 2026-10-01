
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

import { useAuth } from "../../context/AuthContext";

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 6) {
    errors.password =
      "Password must be at least 6 characters.";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  if (!form.phone_no.trim()) {
    errors.phone_no = "Phone number is required.";
  } else if (!/^\d{10}$/.test(form.phone_no)) {
    errors.phone_no =
      "Enter a valid 10-digit phone number.";
  }

  // Patient-specific validation
  if (form.role === "patient") {
    if (!form.age) {
      errors.age = "Age is required.";
    } else if (
      Number(form.age) <= 0 ||
      Number(form.age) > 120
    ) {
      errors.age = "Enter a valid age.";
    }

    if (!form.gender) {
      errors.gender = "Select a gender.";
    }

    if (!form.address.trim()) {
      errors.address = "Address is required.";
    }
  }

  // Doctor-specific validation
  if (form.role === "doctor") {
    if (!form.specialization.trim()) {
      errors.specialization =
        "Specialization is required.";
    }

    if (!form.department.trim()) {
      errors.department =
        "Department is required.";
    }
  }

  return errors;
}

function Register() {
  const { registerUser } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "patient",

    name: "",
    email: "",
    password: "",
    confirmPassword: "",

    phone_no: "",
    age: "",
    gender: "",
    address: "",

    specialization: "",
    department: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: e.target.value,
    }));

    // Remove error when user starts correcting field
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;

    setForm((currentForm) => ({
      ...currentForm,
      role: selectedRole,
    }));

    setErrors({});
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    const validationErrors = validate(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    const result = await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,

      phone_no: form.phone_no,

      // Patient fields
      age:
        form.role === "patient"
          ? Number(form.age)
          : undefined,

      gender:
        form.role === "patient"
          ? form.gender
          : undefined,

      address:
        form.role === "patient"
          ? form.address
          : undefined,

      // Doctor fields
      specialization:
        form.role === "doctor"
          ? form.specialization
          : undefined,

      department:
        form.role === "doctor"
          ? form.department
          : undefined,

      role: form.role,
    });

    setSubmitting(false);

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">

      <div className="w-full max-w-lg rounded-card border border-border bg-surface shadow-card p-8">

        {/* HEADER */}
        <div className="mb-6 flex flex-col items-center text-center">

          <HeartPulse
            size={32}
            className="text-primary"
          />

          <h1 className="mt-2 text-xl font-semibold text-text">
            Create an account
          </h1>

          <p className="text-sm text-text-muted">
            Register as a patient or doctor.
          </p>

        </div>

        {/* ERROR */}
        {formError && (
          <p className="mb-4 rounded-card bg-status-danger-bg px-3 py-2 text-sm text-status-danger">
            {formError}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >

          {/* ROLE */}
          <Select
            label="Register as"
            required
            value={form.role}
            onChange={handleRoleChange}
            options={[
              {
                value: "patient",
                label: "Patient",
              },
              {
                value: "doctor",
                label: "Doctor",
              },
            ]}
          />

          {/* NAME */}
          <Input
            label="Full name"
            required
            value={form.name}
            onChange={handleChange("name")}
            error={errors.name}
          />

          {/* EMAIL */}
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
          />

          {/* PASSWORD */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
            />

            <Input
              label="Confirm password"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
            />

          </div>

          {/* PHONE */}
          <Input
            label="Phone number"
            required
            value={form.phone_no}
            onChange={handleChange("phone_no")}
            error={errors.phone_no}
            placeholder="10-digit number"
          />

          {/* ============================ */}
          {/* PATIENT FIELDS */}
          {/* ============================ */}

          {form.role === "patient" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Input
                  label="Age"
                  type="number"
                  required
                  value={form.age}
                  onChange={handleChange("age")}
                  error={errors.age}
                />

                <Select
                  label="Gender"
                  required
                  value={form.gender}
                  onChange={handleChange("gender")}
                  error={errors.gender}
                  options={[
                    {
                      value: "Male",
                      label: "Male",
                    },
                    {
                      value: "Female",
                      label: "Female",
                    },
                    {
                      value: "Other",
                      label: "Other",
                    },
                  ]}
                />

              </div>

              <Input
                label="Address"
                required
                value={form.address}
                onChange={handleChange("address")}
                error={errors.address}
              />
            </>
          )}

          {/* ============================ */}
          {/* DOCTOR FIELDS */}
          {/* ============================ */}

          {form.role === "doctor" && (
            <>
              <Input
                label="Specialization"
                required
                value={form.specialization}
                onChange={handleChange("specialization")}
                error={errors.specialization}
                placeholder="e.g. Cardiologist"
              />

              <Input
                label="Department"
                required
                value={form.department}
                onChange={handleChange("department")}
                error={errors.department}
                placeholder="e.g. Cardiology"
              />
            </>
          )}

          {/* SUBMIT */}
          <Button
            type="submit"
            fullWidth
            loading={submitting}
          >
            Create account
          </Button>

        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-sm text-text-muted">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-accent hover:underline"
          >
            Log in
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;
