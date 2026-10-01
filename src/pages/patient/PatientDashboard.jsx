
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { parseISO, isFuture } from "date-fns";
import {
  CalendarCheck,
  Clock3,
  FileText,
  Stethoscope,
  CalendarPlus,
} from "lucide-react";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/domain/StatCard";
import AppointmentCard from "../../components/domain/AppointmentCard";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function PatientDashboard() {
  const { profile } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get patient's appointments
        const appointmentResponse = await api.get(
          "/appointments/my"
        );

        if (appointmentResponse.data.success) {
          const formattedAppointments =
            appointmentResponse.data.appointments.map(
              (appointment) => ({
                appointment_id: appointment._id,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status,

                doctor: appointment.doctor_id,
              })
            );

          setAppointments(formattedAppointments);
        }

        // Get patient's prescriptions
        const prescriptionResponse = await api.get(
          "/patients/prescriptions"
        );

        if (prescriptionResponse.data.success) {
          setPrescriptions(
            prescriptionResponse.data.prescriptions
          );
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const upcoming = appointments
    .filter(
      (appointment) =>
        isFuture(parseISO(appointment.date)) &&
        !["Cancelled", "Rejected"].includes(
          appointment.status
        )
    )
    .sort(
      (a, b) =>
        parseISO(a.date) - parseISO(b.date)
    )[0];

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === "Pending"
  ).length;

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === "Completed"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-text-muted">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold text-text">
          Welcome back, {profile?.name}
        </h2>

        <p className="text-sm text-text-muted">
          Here's what's happening with your care.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

        <StatCard
          icon={CalendarCheck}
          label="Total Appointments"
          value={appointments.length}
        />

        <StatCard
          icon={Clock3}
          label="Pending"
          value={pendingCount}
        />

        <StatCard
          icon={CalendarCheck}
          label="Completed"
          value={completedCount}
        />

        <StatCard
          icon={FileText}
          label="Prescriptions"
          value={prescriptions.length}
        />

      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left Side */}
        <div className="space-y-6 lg:col-span-2">

          {/* Upcoming Appointment */}
          <Card title="Upcoming Appointment">

            {upcoming ? (
              <AppointmentCard
                appointment={upcoming}
              />
            ) : (
              <EmptyState
                title="No upcoming appointments"
                description="Book an appointment with a doctor to see it here."
                actionLabel="Book Appointment"
                onAction={() => {}}
              />
            )}

          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity">

            {appointments.length === 0 ? (
              <EmptyState
                title="No activity yet"
              />
            ) : (
              <div className="space-y-3">

                {[...appointments]
                  .sort(
                    (a, b) =>
                      parseISO(b.date) -
                      parseISO(a.date)
                  )
                  .slice(0, 3)
                  .map((appointment) => (
                    <AppointmentCard
                      key={appointment.appointment_id}
                      appointment={appointment}
                    />
                  ))}

              </div>
            )}

          </Card>

        </div>

        {/* Right Side */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <Card title="Quick Actions">

            <div className="space-y-2">

              <Link to="/patient/doctors">
                <Button
                  variant="secondary"
                  fullWidth
                  className="justify-start gap-2"
                >
                  <Stethoscope size={16} />
                  Find a Doctor
                </Button>
              </Link>

              <Link to="/patient/book-appointment">
                <Button
                  variant="secondary"
                  fullWidth
                  className="justify-start gap-2"
                >
                  <CalendarPlus size={16} />
                  Book Appointment
                </Button>
              </Link>

              <Link to="/patient/appointments">
                <Button
                  variant="secondary"
                  fullWidth
                  className="justify-start gap-2"
                >
                  <CalendarCheck size={16} />
                  View Appointments
                </Button>
              </Link>

              <Link to="/patient/prescriptions">
                <Button
                  variant="secondary"
                  fullWidth
                  className="justify-start gap-2"
                >
                  <FileText size={16} />
                  View Prescriptions
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

