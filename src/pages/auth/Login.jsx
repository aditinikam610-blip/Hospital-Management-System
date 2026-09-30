import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HeartPulse, Eye, EyeOff } from "lucide-react";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

function validate(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.password) errors.password = "Password is required.";
  if (!form.role) errors.role = "Select your role.";
  return errors;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    const result = login(form);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.message);
      return;
    }
    const redirectTo = location.state?.from?.pathname || `/${form.role}/dashboard`;
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-card border border-border bg-surface shadow-card p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <HeartPulse size={32} className="text-primary" />
          <h1 className="mt-2 text-xl font-semibold text-text">HMS Portal</h1>
          <p className="text-sm text-text-muted">Sign in to continue to your dashboard</p>
        </div>

        {formError && (
          <p className="mb-4 rounded-card bg-status-danger-bg px-3 py-2 text-sm text-status-danger">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            placeholder="you@example.com"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[34px] text-text-muted"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Select
            label="Role"
            required
            value={form.role}
            onChange={handleChange("role")}
            error={errors.role}
            options={[
              { value: "patient", label: "Patient" },
              { value: "doctor", label: "Doctor" },
              { value: "admin", label: "Admin" },
            ]}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border text-accent focus-visible:ring-2 focus-visible:ring-accent"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => alert("Password reset requires a backend API — not implemented in this demo.")}
              className="text-accent hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-4 rounded-card bg-bg px-3 py-2 text-xs text-text-muted">
          Demo accounts — patient@hms.com / patient123 · doctor@hms.com / doctor123 · admin@hms.com / admin123
        </div>
      </div>
    </div>
  );
}

export default Login;