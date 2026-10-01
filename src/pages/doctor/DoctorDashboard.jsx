import { useEffect, useMemo, useState } from "react";
import { parseISO, isToday } from "date-fns";
import { CalendarCheck, Clock3, Users } from "lucide-react";

import Card from "../../components/common/Card";
import StatCard from "../../components/domain/StatCard";
import EmptyState from "../../components/common/EmptyState";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function DoctorDashboard() {
const { profile } = useAuth();

const [appointments, setAppointments] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const loadDashboard = async () => {
try {
setLoading(true);
setError("");


    const response = await api.get("/appointments/doctor/my");

    if (response.data.success) {
      setAppointments(response.data.appointments || []);
    } else {
      setError(response.data.message || "Failed to load appointments.");
    }
  } catch (err) {
    console.error("Doctor Dashboard Error:", err);

    setError(
      err.response?.data?.message ||
      "Unable to load doctor dashboard."
    );
  } finally {
    setLoading(false);
  }
};

loadDashboard();


}, []);

const todaysAppointments = useMemo(() => {
return appointments.filter((appointment) => {
if (!appointment.date) return false;


  try {
    return isToday(parseISO(appointment.date));
  } catch {
    return false;
  }
});


}, [appointments]);

const pending = useMemo(() => {
return appointments.filter(
(appointment) =>
appointment.status?.toLowerCase() === "pending"
);
}, [appointments]);

const completed = useMemo(() => {
return appointments.filter(
(appointment) =>
appointment.status?.toLowerCase() === "completed"
);
}, [appointments]);

const patients = useMemo(() => {
const uniquePatients = new Set();

appointments.forEach((appointment) => {
  const patientId =
    appointment.patient_id?._id ||
    appointment.patient_id;

  if (patientId) {
    uniquePatients.add(patientId.toString());
  }
});

return Array.from(uniquePatients);

}, [appointments]);

const recent = useMemo(() => {
return [...appointments]
.sort((a, b) => {
return new Date(b.date) - new Date(a.date);
})
.slice(0, 4);
}, [appointments]);

if (!profile) {
return ( <div className="space-y-6"> <Card> <p className="text-sm text-status-danger">
Doctor profile could not be loaded. </p> </Card> </div>
);
}

if (loading) {
return ( <div className="space-y-6"> <div> <h2 className="text-xl font-semibold text-text">
Loading dashboard... </h2> <p className="text-sm text-text-muted">
Please wait while we load your appointments. </p> </div> </div>
);
}

return ( <div className="space-y-6">

  {/* HEADER */}
  <div>
    <h2 className="text-xl font-semibold text-text">
      Welcome, {profile.name}
    </h2>

    <p className="text-sm text-text-muted">
      {profile.specialization} · {profile.department}
    </p>
  </div>

  {/* ERROR */}
  {error && (
    <Card>
      <p className="text-sm text-status-danger">
        {error}
      </p>
    </Card>
  )}

  {/* STAT CARDS */}
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

    <StatCard
      icon={CalendarCheck}
      label="Today's Appointments"
      value={todaysAppointments.length}
    />

    <StatCard
      icon={Clock3}
      label="Pending"
      value={pending.length}
    />

    <StatCard
      icon={CalendarCheck}
      label="Completed"
      value={completed.length}
    />

    <StatCard
      icon={Users}
      label="Total Patients"
      value={patients.length}
    />

  </div>

  {/* RECENT ACTIVITY */}
  <Card title="Recent Activity">

    {recent.length === 0 ? (
      <EmptyState title="No appointments yet" />
    ) : (
      <div className="divide-y divide-border">

        {recent.map((appointment) => {

          const patient =
            appointment.patient_id &&
            typeof appointment.patient_id === "object"
              ? appointment.patient_id
              : appointment.patient;

          return (
            <div
              key={appointment._id || appointment.appointment_id}
              className="flex items-center justify-between py-3 text-sm"
            >

              <div>
                <p className="font-medium text-text">
                  {patient?.name || "Patient"}
                </p>

                <p className="text-xs text-text-muted">
                  {appointment.date
                    ? new Date(
                        appointment.date
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date unavailable"}

                  {" · "}

                  {appointment.time || "Time unavailable"}
                </p>
              </div>

              <span className="text-xs text-text-muted">
                {appointment.status || "Pending"}
              </span>

            </div>
          );
        })}

      </div>
    )}

  </Card>

</div>

);
}

export default DoctorDashboard;
