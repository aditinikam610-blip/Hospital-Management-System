import { format, parseISO, isToday, isFuture } from "date-fns";
import { CalendarCheck, Clock3, Users, FileText } from "lucide-react";
import Card from "../../components/common/Card";
import StatCard from "../../components/domain/StatCard";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import {
  getAppointmentsByDoctor,
  enrichAppointment,
  getPatientsForDoctor,
} from "../../utils/dataHelpers";

function DoctorDashboard() {
  const { profile } = useAuth();
  const appointments = getAppointmentsByDoctor(profile.doctor_id).map(enrichAppointment);
  const patients = getPatientsForDoctor(profile.doctor_id);

  const todaysAppointments = appointments.filter((a) => isToday(parseISO(a.date)));
  const pending = appointments.filter((a) => a.status === "Pending");
  const completed = appointments.filter((a) => a.status === "Completed");

  const recent = [...appointments]
    .sort((a, b) => parseISO(b.date) - parseISO(a.date))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text">Welcome, {profile.name}</h2>
        <p className="text-sm text-text-muted">{profile.specialization} · {profile.department}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Today's Appointments" value={todaysAppointments.length} />
        <StatCard icon={Clock3} label="Pending" value={pending.length} />
        <StatCard icon={CalendarCheck} label="Completed" value={completed.length} />
        <StatCard icon={Users} label="Total Patients" value={patients.length} />
      </div>

      <Card title="Recent Activity">
        {recent.length === 0 ? (
          <EmptyState title="No appointments yet" />
        ) : (
          <div className="divide-y divide-border">
            {recent.map((a) => (
              <div key={a.appointment_id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-text">{a.patient?.name}</p>
                  <p className="text-xs text-text-muted">
                    {format(parseISO(a.date), "dd MMM yyyy")} · {a.time}
                  </p>
                </div>
                <span className="text-xs text-text-muted">{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default DoctorDashboard;