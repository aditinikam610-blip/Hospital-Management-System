import { useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getPaymentsByPatient } from "../../utils/dataHelpers";

function PaymentHistory() {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");

  const records = getPaymentsByPatient(profile.patient_id).filter((p) => {
    const matchesSearch = String(p.appointment_id).includes(search) || String(p.payment_id).includes(search);
    const matchesMode = !mode || p.payment_mode === mode;
    return matchesSearch && matchesMode;
  });

  return (
    <Card title="Payment History">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          placeholder="Search by payment or appointment ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="All payment modes"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          options={[
            { value: "UPI", label: "UPI" },
            { value: "Card", label: "Card" },
            { value: "Cash", label: "Cash" },
            { value: "Net Banking", label: "Net Banking" },
          ]}
        />
      </div>

      {records.length === 0 ? (
        <EmptyState title="No payment records found" />
      ) : (
        <Table
          rows={records}
          rowKey="payment_id"
          columns={[
            { key: "payment_id", header: "Payment ID" },
            { key: "appointment_id", header: "Appointment ID" },
            { key: "amount", header: "Amount", render: (r) => `₹${Number(r.amount).toFixed(2)}` },
            { key: "payment_date", header: "Date", render: (r) => format(parseISO(r.payment_date), "dd MMM yyyy") },
            { key: "payment_mode", header: "Mode" },
          ]}
        />
      )}
    </Card>
  );
}

export default PaymentHistory;