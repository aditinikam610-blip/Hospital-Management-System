
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/patients/prescriptions"
      );

      if (response.data.success) {
        const formattedPrescriptions =
          response.data.prescriptions.map(
            (prescription) => ({
              prescription_id: prescription._id,
              diagnosis: prescription.diagnosis,
              medicines: prescription.medicines,

              appointment: {
                ...prescription.appointment_id,

                doctor:
                  prescription.appointment_id?.doctor_id,
              },
            })
          );

        setPrescriptions(formattedPrescriptions);
      }
    } catch (error) {
      console.error(
        "Failed to load prescriptions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <Card title="Prescriptions">
        <p className="text-sm text-text-muted">
          Loading prescriptions...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Prescriptions">
      {prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions found"
          description="Prescriptions from your doctor visits will appear here."
        />
      ) : (
        <Table
          rows={prescriptions}
          rowKey="prescription_id"
          columns={[
            {
              key: "prescription_id",
              header: "ID",
              render: (r) =>
                r.prescription_id
                  ?.toString()
                  .slice(-6),
            },

            {
              key: "doctor",
              header: "Doctor",
              render: (r) =>
                r.appointment?.doctor?.name ||
                "N/A",
            },

            {
              key: "date",
              header: "Date",
              render: (r) =>
                r.appointment?.date
                  ? format(
                      parseISO(
                        r.appointment.date
                      ),
                      "dd MMM yyyy"
                    )
                  : "N/A",
            },

            {
              key: "diagnosis",
              header: "Diagnosis",
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

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Prescription Details"
      >
        {viewing && (
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-text-muted">
                Doctor:
              </span>{" "}
              {viewing.appointment?.doctor?.name ||
                "N/A"}
            </p>

            <p>
              <span className="text-text-muted">
                Specialization:
              </span>{" "}
              {viewing.appointment?.doctor
                ?.specialization || "N/A"}
            </p>

            <p>
              <span className="text-text-muted">
                Date:
              </span>{" "}
              {viewing.appointment?.date
                ? format(
                    parseISO(
                      viewing.appointment.date
                    ),
                    "dd MMM yyyy"
                  )
                : "N/A"}
            </p>

            <p>
              <span className="text-text-muted">
                Diagnosis:
              </span>{" "}
              {viewing.diagnosis}
            </p>

            <div>
              <p className="text-text-muted">
                Medicines:
              </p>

              <p className="mt-1 rounded-card bg-bg p-3">
                {viewing.medicines}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}

export default Prescriptions;
