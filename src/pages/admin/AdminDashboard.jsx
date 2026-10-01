import { useEffect, useState } from "react";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  Clock3,
  IndianRupee,
} from "lucide-react";

import Card from "../../components/common/Card";
import StatCard from "../../components/domain/StatCard";
import api from "../../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const PIE_COLORS = [
  "#0F3D5C",
  "#0D9488",
  "#2C6E8E",
  "#B45309",
  "#1D4ED8",
];

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todaysCount: 0,
    pendingCount: 0,
    completedCount: 0,
    totalRevenue: 0,
  });

  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [departmentBreakdown, setDepartmentBreakdown] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          dashboardResponse,
          appointmentResponse,
          doctorResponse,
          paymentResponse,
        ] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/appointments"),
          api.get("/admin/doctors"),
          api.get("/admin/payments"),
        ]);

        // -----------------------------
        // Dashboard statistics
        // -----------------------------
        if (dashboardResponse.data.success) {
          const data = dashboardResponse.data;

          setStats({
            totalPatients:
              data.totalPatients ??
              data.stats?.totalPatients ??
              0,

            totalDoctors:
              data.totalDoctors ??
              data.stats?.totalDoctors ??
              0,

            todaysCount:
              data.todaysCount ??
              data.stats?.todaysCount ??
              0,

            pendingCount:
              data.pendingCount ??
              data.stats?.pendingCount ??
              0,

            completedCount:
              data.completedCount ??
              data.stats?.completedCount ??
              0,

            totalRevenue:
              data.totalRevenue ??
              data.stats?.totalRevenue ??
              0,
          });
        }

        // -----------------------------
        // Appointments
        // -----------------------------
        let appointments = [];

        if (appointmentResponse.data.success) {
          appointments =
            appointmentResponse.data.appointments || [];
        }

        // Appointment status breakdown
        const statusCount = {};

        appointments.forEach((appointment) => {
          const status = appointment.status || "Unknown";

          statusCount[status] =
            (statusCount[status] || 0) + 1;
        });

        setStatusBreakdown(
          Object.entries(statusCount).map(
            ([status, count]) => ({
              status,
              count,
            })
          )
        );

        // -----------------------------
        // Doctors / Departments
        // -----------------------------
        let doctors = [];

        if (doctorResponse.data.success) {
          doctors = doctorResponse.data.doctors || [];
        }

        const departmentCount = {};

        doctors.forEach((doctor) => {
          const department =
            doctor.department || "Other";

          departmentCount[department] =
            (departmentCount[department] || 0) + 1;
        });

        setDepartmentBreakdown(
          Object.entries(departmentCount).map(
            ([department, count]) => ({
              department,
              count,
            })
          )
        );

        // -----------------------------
        // Payments / Revenue
        // -----------------------------
        let payments = [];

        if (paymentResponse.data.success) {
          payments =
            paymentResponse.data.payments || [];
        }

        // Monthly revenue
        const monthly = {};

        payments.forEach((payment) => {
          if (!payment.payment_date) return;

          const date = new Date(payment.payment_date);

          if (Number.isNaN(date.getTime())) return;

          const month = date.toLocaleString("en-IN", {
            month: "short",
            year: "numeric",
          });

          if (!monthly[month]) {
            monthly[month] = 0;
          }

          monthly[month] += Number(payment.amount) || 0;
        });

        setMonthlyRevenue(
          Object.entries(monthly).map(
            ([month, total]) => ({
              month,
              total,
            })
          )
        );
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-text">
            Admin Dashboard
          </h2>

          <p className="text-sm text-text-muted">
            Loading system data...
          </p>
        </div>

        <Card>
          <p className="text-sm text-text-muted">
            Please wait...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text">
          Admin Dashboard
        </h2>

        <p className="text-sm text-text-muted">
          System-wide overview.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.totalPatients}
        />

        <StatCard
          icon={Stethoscope}
          label="Total Doctors"
          value={stats.totalDoctors}
        />

        <StatCard
          icon={CalendarCheck}
          label="Today's Appointments"
          value={stats.todaysCount}
        />

        <StatCard
          icon={Clock3}
          label="Pending"
          value={stats.pendingCount}
        />

        <StatCard
          icon={CalendarCheck}
          label="Completed"
          value={stats.completedCount}
        />

        <StatCard
          icon={IndianRupee}
          label="Revenue"
          value={`₹${Number(
            stats.totalRevenue
          ).toFixed(0)}`}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appointment Statistics */}
        <Card title="Appointment Statistics">
          {statusBreakdown.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              No appointment records yet.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={260}
            >
              <BarChart data={statusBreakdown}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#DCE4E8"
                />

                <XAxis
                  dataKey="status"
                  tick={{
                    fontSize: 12,
                    fill: "#5A6B78",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 12,
                    fill: "#5A6B78",
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#0F3D5C"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Department Distribution */}
        <Card title="Department Distribution">
          {departmentBreakdown.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              No doctor records yet.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={260}
            >
              <PieChart>
                <Pie
                  data={departmentBreakdown}
                  dataKey="count"
                  nameKey="department"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {departmentBreakdown.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          PIE_COLORS[
                            index %
                              PIE_COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                  }}
                />

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Monthly Revenue */}
        <Card
          title="Monthly Revenue"
          className="lg:col-span-2"
        >
          {monthlyRevenue.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              No payment records yet.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={240}
            >
              <LineChart data={monthlyRevenue}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#DCE4E8"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: "#5A6B78",
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: "#5A6B78",
                  }}
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${value}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#0D9488"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;