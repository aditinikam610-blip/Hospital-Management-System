import { useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import {
  getAppointmentsByPatient,
  enrichAppointment,
  getPaymentForAppointment,
  addPayment,
} from "../../utils/dataHelpers";

function Payments() {
  const { profile } = useAuth();
  const [version, setVersion] = useState(0);
  const [paying, setPaying] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");

  // Only completed appointments are billable — matches the schema's
  // relationship (a payment belongs to one appointment).
  const billable = getAppointmentsByPatient(profile.patient_id)
    .map(enrichAppointment)
    .filter((a) => a.status === "Completed")
    .map((a) => ({ ...a, payment: getPaymentForAppointment(a.appointment_id) }));

  const handlePay = () => {
    setError("");
    if (!amount || Number(amount) <= 0) return setError("Enter a valid amount.");
    if (!mode) return setError("Select a payment mode.");

    addPayment({
      amount: Number(amount),
      payment_date: new Date().toISOString().split("T")[0],
      payment_mode: mode,
      appointment_id: paying.appointment_id,
    });
    setPaying(null);
    setAmount("");
    setMode("");
    setVersion((v) => v + 1);
  };

  return (
    <Card title="Payments">
      {billable.length === 0 ? (
        <EmptyState
          title="No billable appointments"
          description="Payments become available once an appointment is marked completed."
        />
      ) : (
        <Table
          rows={billable}
          rowKey="appointment_id"
          columns={[
            { key: "appointment_id", header: "Appointment" },
            { key: "doctor", header: "Doctor", render: (r) => r.doctor?.name },
            { key: "date", header: "Date", render: (r) => format(parseISO(r.date), "dd MMM yyyy") },
            {
              key: "status",
              header: "Payment Status",
              render: (r) => (
                <span
                  className={`inline-flex rounded-card px-2.5 py-1 text-xs font-medium ${
                    r.payment
                      ? "bg-status-success-bg text-status-success"
                      : "bg-status-warning-bg text-status-warning"
                  }`}
                >
                  {r.payment ? "Paid" : "Unpaid"}
                </span>
              ),
            },
            {
              key: "actions",
              header: "",
              render: (r) =>
                r.payment ? (
                  <span className="text-xs text-text-muted">₹{r.payment.amount} via {r.payment.payment_mode}</span>
                ) : (
                  <Button size="sm" onClick={() => setPaying(r)}>
                    Pay Now
                  </Button>
                ),
            },
          ]}
        />
      )}

      <Modal
        open={!!paying}
        onClose={() => setPaying(null)}
        title="Record Payment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPaying(null)}>Cancel</Button>
            <Button onClick={handlePay}>Confirm Payment</Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && (
            <p className="rounded-card bg-status-danger-bg px-3 py-2 text-sm text-status-danger">{error}</p>
          )}
          <p className="text-sm text-text-muted">
            Appointment #{paying?.appointment_id} with {paying?.doctor?.name}
          </p>
          <Input label="Amount (₹)" type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Select
            label="Payment Mode"
            required
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            options={[
              { value: "UPI", label: "UPI" },
              { value: "Card", label: "Card" },
              { value: "Cash", label: "Cash" },
              { value: "Net Banking", label: "Net Banking" },
            ]}
          />
          <p className="text-xs text-text-muted">
            This is a UI simulation only — no real payment gateway is connected.
          </p>
        </div>
      </Modal>
    </Card>
  );
}

export default Payments;