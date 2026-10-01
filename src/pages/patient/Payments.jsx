import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import api from "../../services/api";

function Payments() {
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paying, setPaying] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");

  // Fetch completed appointments and payment history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentResponse, paymentResponse] =
          await Promise.all([
            api.get("/appointments/my"),
            api.get("/payments/my"),
          ]);

        if (appointmentResponse.data.success) {
          setAppointments(appointmentResponse.data.appointments);
        }

        if (paymentResponse.data.success) {
          setPayments(paymentResponse.data.payments);
        }
      } catch (error) {
        console.error("Failed to load payment data:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load payment data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Only completed appointments are billable
  const billable = appointments
    .filter((a) => a.status === "Completed")
    .map((a) => {
      const payment = payments.find(
        (p) => p.appointment_id?._id === a._id
      );

      return {
        ...a,
        appointment_id: a._id,
        payment,
      };
    });

  // Create payment
  const handlePay = async () => {
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (!mode) {
      setError("Select a payment mode.");
      return;
    }

    try {
      await api.post("/payments", {
        amount: Number(amount),
        payment_mode: mode,
        appointment_id: paying.appointment_id,
      });

      setPaying(null);
      setAmount("");
      setMode("");

      // Refresh payments after successful payment
      const response = await api.get("/payments/my");

      if (response.data.success) {
        setPayments(response.data.payments);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create payment."
      );
    }
  };

  if (loading) {
    return (
      <Card title="Payments">
        <p className="text-sm text-text-muted">
          Loading payment information...
        </p>
      </Card>
    );
  }

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
            {
              key: "appointment_id",
              header: "Appointment",
            },

            {
              key: "doctor_id",
              header: "Doctor",
              render: (r) =>
                r.doctor_id?.name ||
                r.doctor_id?.full_name ||
                "-",
            },

            {
              key: "date",
              header: "Date",
              render: (r) =>
                r.date
                  ? format(
                      parseISO(r.date),
                      "dd MMM yyyy"
                    )
                  : "-",
            },

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
                  <span className="text-xs text-text-muted">
                    ₹{r.payment.amount} via{" "}
                    {r.payment.payment_mode}
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      setPaying(r);
                      setError("");
                    }}
                  >
                    Pay Now
                  </Button>
                ),
            },
          ]}
        />
      )}

      <Modal
        open={!!paying}
        onClose={() => {
          setPaying(null);
          setError("");
          setAmount("");
          setMode("");
        }}
        title="Record Payment"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setPaying(null);
                setError("");
                setAmount("");
                setMode("");
              }}
            >
              Cancel
            </Button>

            <Button onClick={handlePay}>
              Confirm Payment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && (
            <p className="rounded-card bg-status-danger-bg px-3 py-2 text-sm text-status-danger">
              {error}
            </p>
          )}

          <p className="text-sm text-text-muted">
            Appointment #{paying?.appointment_id} with{" "}
            {paying?.doctor_id?.name ||
              paying?.doctor_id?.full_name ||
              "Doctor"}
          </p>

          <Input
            label="Amount (₹)"
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Select
            label="Payment Mode"
            required
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            options={[
              { value: "UPI", label: "UPI" },
              { value: "Card", label: "Card" },
              { value: "Cash", label: "Cash" },
              { value: "Online", label: "Online" },
            ]}
          />

          <p className="text-xs text-text-muted">
            This is a UI simulation only — no real payment
            gateway is connected.
          </p>
        </div>
      </Modal>
    </Card>
  );
}

export default Payments;