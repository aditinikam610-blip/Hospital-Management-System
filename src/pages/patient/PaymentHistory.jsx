import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import api from "../../services/api";

function PaymentHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");

  // Fetch real payment history from MongoDB
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/payments/my");

        if (response.data.success) {
          setRecords(response.data.payments);
        }
      } catch (error) {
        console.error("Failed to load payment history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments
  const filteredRecords = records.filter((p) => {
    const appointmentId = p.appointment_id?._id || "";
    const paymentId = p._id || "";

    const matchesSearch =
      String(appointmentId)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(paymentId)
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesMode =
      !mode || p.payment_mode === mode;

    return matchesSearch && matchesMode;
  });

  if (loading) {
    return (
      <Card title="Payment History">
        <p className="text-sm text-text-muted">
          Loading payment history...
        </p>
      </Card>
    );
  }

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
            { value: "Online", label: "Online" },
          ]}
        />
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyState title="No payment records found" />
      ) : (
        <Table
          rows={filteredRecords}
          rowKey="_id"
          columns={[
            {
              key: "_id",
              header: "Payment ID",
            },

            {
              key: "appointment_id",
              header: "Appointment ID",
              render: (r) =>
                r.appointment_id?._id || "-",
            },

            {
              key: "amount",
              header: "Amount",
              render: (r) =>
                `₹${Number(r.amount).toFixed(2)}`,
            },

            {
              key: "payment_date",
              header: "Date",
              render: (r) =>
                r.payment_date
                  ? format(
                      parseISO(r.payment_date),
                      "dd MMM yyyy"
                    )
                  : "-",
            },

            {
              key: "payment_mode",
              header: "Mode",
            },
          ]}
        />
      )}
    </Card>
  );
}

export default PaymentHistory;