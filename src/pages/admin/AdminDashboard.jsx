import {
  Users, Stethoscope, CalendarCheck, Clock3, IndianRupee,
} from "lucide-react";
import Card from "../../components/common/Card";
import StatCard from "../../components/domain/StatCard";
import {
  getDashboardStats,
  getAppointmentStatusBreakdown,
  getDepartmentBreakdown,
  getMonthlyRevenue,
} from "../../utils/dataHelpers";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

const PIE_COLORS = ["#0F3D5C", "#0D9488", "#2C6E8E", "#B45309", "#1D4ED8"];

function AdminDashboard() {
  const stats = getDashboardStats();
  const statusBreakdown = getAppointmentStatusBreakdown();
  const departmentBreakdown = getDepartmentBreakdown();
  const monthlyRevenue = getMonthlyRevenue();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text">Admin Dashboard</h2>
        <p className="text-sm text-text-muted">System-wide overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Users} label="Total Patients" value={stats.totalPatients} />
        <StatCard icon={Stethoscope} label="Total Doctors" value={stats.totalDoctors} />
        <StatCard icon={CalendarCheck} label="Today's Appointments" value={stats.todaysCount} />
        <StatCard icon={Clock3} label="Pending" value={stats.pendingCount} />
        <StatCard icon={CalendarCheck} label="Completed" value={stats.completedCount} />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${stats.totalRevenue.toFixed(0)}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Appointment Statistics">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCE4E8" />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#5A6B78" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5A6B78" }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0F3D5C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Department Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={departmentBreakdown}
                dataKey="count"
                nameKey="department"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {departmentBreakdown.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly Revenue" className="lg:col-span-2">
          {monthlyRevenue.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">No payment records yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE4E8" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5A6B78" }} />
                <YAxis tick={{ fontSize: 12, fill: "#5A6B78" }} />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Line type="monotone" dataKey="total" stroke="#0D9488" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;