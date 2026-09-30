import { useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import StatCard from "../../components/domain/StatCard";
import { IndianRupee, CheckCircle2, Clock3 } from "lucide-react";
import { getAllPaymentsEnriched, getAllAppointmentsEnriched } from "../../utils/dataHelpers";

function ManagePayments() {
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);

  const payments = getAllPaymentsEnriched();
  const allAppointments = getAllAppointmentsEnriched();

  const paidTotal = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const completedAppointments = allAppointments.filter((a) => a.status === "Completed");
  const unpaidCount = completedAppointments.filter(
    (a) => !payments.some((p) => p.appointment_id === a.appointment_id)
  ).length;

  const filtered = payments.filter(
    (p) =>
      p.appointment?.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.payment_id).includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={IndianRupee} label="Total Collected" value={`₹${paidTotal.toFixed(0)}`} />
        <StatCard icon={CheckCircle2} label="Payment Records" value={payments.length} />
        <StatCard icon={Clock3} label="Completed, Unpaid" value={unpaidCount} />
      </div>

      <Card title="All Payments">
        <div className="mb-4 max-w-sm">
          <Input placeholder="Search by patient or payment ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No payment records found" />
        ) : (
          <Table
            rows={filtered}
            rowKey="payment_id"
            columns={[
              { key: "payment_id", header: "Payment ID" },
              { key: "patient", header: "Patient", render: (r) => r.appointment?.patient?.name },
              { key: "date", header: "Date", render: (r) => format(parseISO(r.payment_date), "dd MMM yyyy") },
              { key: "amount", header: "Amount", render: (r) => `₹${Number(r.amount).toFixed(2)}` },
              { key: "payment_mode", header: "Mode" },
              {
                key: "actions",
                header: "",
                render: (r) => (
                  <Button size="sm" variant="secondary" onClick={() => setViewing(r)}>View</Button>
                ),
              },
            ]}
          />
        )}
      </Card>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Payment Details">
        {viewing && (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Patient:</span> {viewing.appointment?.patient?.name}</p>
            <p><span className="text-text-muted">Doctor:</span> {viewing.appointment?.doctor?.name}</p>
            <p><span className="text-text-muted">Amount:</span> ₹{Number(viewing.amount).toFixed(2)}</p>
            <p><span className="text-text-muted">Date:</span> {format(parseISO(viewing.payment_date), "dd MMM yyyy")}</p>
            <p><span className="text-text-muted">Mode:</span> {viewing.payment_mode}</p>
            <p><span className="text-text-muted">Appointment ID:</span> {viewing.appointment_id}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ManagePayments;