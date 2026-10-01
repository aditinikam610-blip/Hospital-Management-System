import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

function ManagePrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all prescriptions from backend
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/prescriptions/admin/all"
      );

      if (response.data.success) {
        setPrescriptions(
          response.data.prescriptions || []
        );
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

  // Search by patient, doctor or diagnosis
  const filtered = prescriptions.filter(
    (prescription) => {
      const patientName =
        prescription.appointment_id
          ?.patient_id?.name ||
        prescription.appointment_id
          ?.patient_id?.full_name ||
        "";

      const doctorName =
        prescription.appointment_id
          ?.doctor_id?.name ||
        prescription.appointment_id
          ?.doctor_id?.full_name ||
        "";

      const diagnosis =
        prescription.diagnosis || "";

      const searchText =
        search.trim().toLowerCase();

      return (
        patientName
          .toLowerCase()
          .includes(searchText) ||
        doctorName
          .toLowerCase()
          .includes(searchText) ||
        diagnosis
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // Loading state
  if (loading) {
    return (
      <Card title="Manage Prescriptions">
        <p className="text-sm text-text-muted">
          Loading prescriptions...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Manage Prescriptions">

      {/* Search */}
      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search by patient, doctor or diagnosis"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Prescription Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No prescriptions found"
          description={
            search
              ? "No prescriptions match your search."
              : "No prescription records are currently available."
          }
        />
      ) : (
        <Table
          rows={filtered}
          rowKey="_id"
          columns={[
            {
              key: "_id",
              header: "ID",
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
              key: "doctor",
              header: "Doctor",
              render: (r) =>
                r.appointment_id
                  ?.doctor_id?.name ||
                r.appointment_id
                  ?.doctor_id?.full_name ||
                "-",
            },

            {
              key: "date",
              header: "Date",
              render: (r) => {
                const date =
                  r.appointment_id?.date;

                if (!date) return "-";

                return format(
                  parseISO(date),
                  "dd MMM yyyy"
                );
              },
            },

            {
              key: "diagnosis",
              header: "Diagnosis",
              render: (r) =>
                r.diagnosis || "-",
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

      {/* Prescription Details Modal */}
      <Modal
        open={!!viewing}
        onClose={() =>
          setViewing(null)
        }
        title="Prescription Details"
      >
        {viewing && (
          <div className="space-y-2 text-sm">

            {/* Patient */}
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

            {/* Doctor */}
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

            {/* Date */}
            <p>
              <span className="text-text-muted">
                Date:
              </span>{" "}
              {viewing.appointment_id?.date
                ? format(
                    parseISO(
                      viewing.appointment_id
                        .date
                    ),
                    "dd MMM yyyy"
                  )
                : "-"}
            </p>

            {/* Diagnosis */}
            <p>
              <span className="text-text-muted">
                Diagnosis:
              </span>{" "}
              {viewing.diagnosis || "-"}
            </p>

            {/* Medicines */}
            <div>
              <p className="text-text-muted">
                Medicines:
              </p>

              <p className="mt-1 rounded-card bg-bg p-3">
                {viewing.medicines || "-"}
              </p>
            </div>

            {/* Appointment ID */}
            <p>
              <span className="text-text-muted">
                Appointment ID:
              </span>{" "}
              {viewing.appointment_id?._id ||
                "-"}
            </p>

            {/* Prescription ID */}
            <p>
              <span className="text-text-muted">
                Prescription ID:
              </span>{" "}
              {viewing._id || "-"}
            </p>

          </div>
        )}
      </Modal>

    </Card>
  );
}

export default ManagePrescriptions;