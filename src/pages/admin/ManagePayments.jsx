import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { IndianRupee, CheckCircle2, Clock3 } from "lucide-react";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import StatCard from "../../components/domain/StatCard";

import api from "../../services/api";

function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [paymentResponse, appointmentResponse] =
        await Promise.all([
          api.get("/admin/payments"),
          api.get("/admin/appointments"),
        ]);

      if (paymentResponse.data.success) {
        setPayments(
          paymentResponse.data.payments || []
        );
      }

      if (appointmentResponse.data.success) {
        setAppointments(
          appointmentResponse.data.appointments || []
        );
      }
    } catch (error) {
      console.error(
        "Failed to load payment data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const paidTotal = payments.reduce(
    (sum, payment) =>
      sum + (Number(payment.amount) || 0),
    0
  );

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "Completed"
    );

  const unpaidCount =
    completedAppointments.filter(
      (appointment) => {
        const appointmentId =
          appointment._id;

        return !payments.some(
          (payment) =>
            String(
              payment.appointment_id?._id ||
                payment.appointment_id
            ) === String(appointmentId)
        );
      }
    ).length;

  const filtered = payments.filter((payment) => {
    const patientName =
      payment.appointment_id?.patient_id?.name ||
      payment.appointment_id?.patient_id?.full_name ||
      payment.patient?.name ||
      "";

    const paymentId =
      payment._id || "";

    const searchText =
      search.toLowerCase();

    return (
      patientName
        .toLowerCase()
        .includes(searchText) ||
      String(paymentId)
        .toLowerCase()
        .includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <p className="text-sm text-text-muted">
            Loading payment information...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={IndianRupee}
          label="Total Collected"
          value={`₹${paidTotal.toFixed(0)}`}
        />

        <StatCard
          icon={CheckCircle2}
          label="Payment Records"
          value={payments.length}
        />

        <StatCard
          icon={Clock3}
          label="Completed, Unpaid"
          value={unpaidCount}
        />
      </div>

      {/* Payments */}
      <Card title="All Payments">
        <div className="mb-4 max-w-sm">
          <Input
            placeholder="Search by patient or payment ID"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No payment records found"
          />
        ) : (
          <Table
            rows={filtered}
            rowKey="_id"
            columns={[
              {
                key: "_id",
                header: "Payment ID",
              },

              {
                key: "patient",
                header: "Patient",
                render: (r) =>
                  r.appointment_id
                    ?.patient_id?.name ||
                  r.appointment_id
                    ?.patient_id?.full_name ||
                  "-",
              },

              {
                key: "payment_date",
                header: "Date",
                render: (r) =>
                  r.payment_date
                    ? format(
                        parseISO(
                          r.payment_date
                        ),
                        "dd MMM yyyy"
                      )
                    : "-",
              },

              {
                key: "amount",
                header: "Amount",
                render: (r) =>
                  `₹${Number(
                    r.amount || 0
                  ).toFixed(2)}`,
              },

              {
                key: "payment_mode",
                header: "Mode",
                render: (r) =>
                  r.payment_mode || "-",
              },

              {
                key: "actions",
                header: "",
                render: (r) => (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setViewing(r)
                    }
                  >
                    View
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* Payment Details */}
      <Modal
        open={!!viewing}
        onClose={() =>
          setViewing(null)
        }
        title="Payment Details"
      >
        {viewing && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-text-muted">
                Patient:
              </span>{" "}
              {viewing.appointment_id
                ?.patient_id?.name ||
                viewing.appointment_id
                  ?.patient_id?.full_name ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Doctor:
              </span>{" "}
              {viewing.appointment_id
                ?.doctor_id?.name ||
                viewing.appointment_id
                  ?.doctor_id?.full_name ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Amount:
              </span>{" "}
              ₹
              {Number(
                viewing.amount || 0
              ).toFixed(2)}
            </p>

            <p>
              <span className="text-text-muted">
                Date:
              </span>{" "}
              {viewing.payment_date
                ? format(
                    parseISO(
                      viewing.payment_date
                    ),
                    "dd MMM yyyy"
                  )
                : "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Mode:
              </span>{" "}
              {viewing.payment_mode ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Appointment ID:
              </span>{" "}
              {viewing.appointment_id
                ?._id ||
                viewing.appointment_id ||
                "-"}
            </p>

            <p>
              <span className="text-text-muted">
                Payment ID:
              </span>{" "}
              {viewing._id || "-"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ManagePayments;