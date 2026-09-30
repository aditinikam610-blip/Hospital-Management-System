import { Link } from "react-router-dom";
import { format, parseISO, isFuture } from "date-fns";
import { CalendarCheck, Clock3, FileText, CreditCard, Stethoscope, CalendarPlus } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/domain/StatCard";
import AppointmentCard from "../../components/domain/AppointmentCard";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import {
  getAppointmentsByPatient,
  enrichAppointment,
  getPrescriptionsByPatient,
  getPaymentsByPatient,
} from "../../utils/dataHelpers";

function PatientDashboard() {
  const { profile } = useAuth();
  const appointments = getAppointmentsByPatient(profile.patient_id).map(enrichAppointment);
  const prescriptions = getPrescriptionsByPatient(profile.patient_id);
  const paymentRecords = getPaymentsByPatient(profile.patient_id);

  const upcoming = appointments
    .filter((a) => isFuture(parseISO(a.date)) && !["Cancelled", "Rejected"].includes(a.status))
    .sort((a, b) => parseISO(a.date) - parseISO(b.date))[0];

  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const totalPaid = paymentRecords.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text">Welcome back, {profile.name}</h2>
        <p className="text-sm text-text-muted">Here's what's happening with your care.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Total Appointments" value={appointments.length} />
        <StatCard icon={Clock3} label="Pending" value={pendingCount} />
        <StatCard icon={CalendarCheck} label="Completed" value={completedCount} />
        <StatCard icon={FileText} label="Prescriptions" value={prescriptions.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Upcoming Appointment">
            {upcoming ? (
              <AppointmentCard appointment={upcoming} />
            ) : (
              <EmptyState
                title="No upcoming appointments"
                description="Book an appointment with a doctor to see it here."
                actionLabel="Book Appointment"
                onAction={() => {}}
              />
            )}
          </Card>

          <Card title="Recent Activity">
            {appointments.length === 0 ? (
              <EmptyState title="No activity yet" />
            ) : (
              <div className="space-y-3">
                {[...appointments]
                  .sort((a, b) => parseISO(b.date) - parseISO(a.date))
                  .slice(0, 3)
                  .map((a) => (
                    <AppointmentCard key={a.appointment_id} appointment={a} />
                  ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Payment Summary">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Total paid</span>
              <span className="font-semibold text-text">₹{totalPaid.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-text-muted">Payment records</span>
              <span className="font-semibold text-text">{paymentRecords.length}</span>
            </div>
            <Link to="/patient/payment-history">
              <Button variant="secondary" size="sm" fullWidth className="mt-4">
                View Payment History
              </Button>
            </Link>
          </Card>

          <Card title="Quick Actions">
            <div className="space-y-2">
              <Link to="/patient/doctors">
                <Button variant="secondary" fullWidth className="justify-start gap-2">
                  <Stethoscope size={16} /> Find a Doctor
                </Button>
              </Link>
              <Link to="/patient/book-appointment">
                <Button variant="secondary" fullWidth className="justify-start gap-2">
                  <CalendarPlus size={16} /> Book Appointment
                </Button>
              </Link>
              <Link to="/patient/appointments">
                <Button variant="secondary" fullWidth className="justify-start gap-2">
                  <CalendarCheck size={16} /> View Appointments
                </Button>
              </Link>
              <Link to="/patient/prescriptions">
                <Button variant="secondary" fullWidth className="justify-start gap-2">
                  <FileText size={16} /> View Prescriptions
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;