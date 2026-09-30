import { useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getPrescriptionsByPatient } from "../../utils/dataHelpers";

function Prescriptions() {
  const { profile } = useAuth();
  const [viewing, setViewing] = useState(null);
  const prescriptions = getPrescriptionsByPatient(profile.patient_id);

  return (
    <Card title="Prescriptions">
      {prescriptions.length === 0 ? (
        <EmptyState title="No prescriptions found" description="Prescriptions from your doctor visits will appear here." />
      ) : (
        <Table
          rows={prescriptions}
          rowKey="prescription_id"
          columns={[
            { key: "prescription_id", header: "ID" },
            { key: "doctor", header: "Doctor", render: (r) => r.appointment.doctor?.name },
            { key: "date", header: "Date", render: (r) => format(parseISO(r.appointment.date), "dd MMM yyyy") },
            { key: "diagnosis", header: "Diagnosis" },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <Button size="sm" variant="secondary" onClick={() => setViewing(r)}>
                  View
                </Button>
              ),
            },
          ]}
        />
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Prescription Details">
        {viewing && (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Doctor:</span> {viewing.appointment.doctor?.name}</p>
            <p><span className="text-text-muted">Date:</span> {format(parseISO(viewing.appointment.date), "dd MMM yyyy")}</p>
            <p><span className="text-text-muted">Diagnosis:</span> {viewing.diagnosis}</p>
            <div>
              <p className="text-text-muted">Medicines:</p>
              <p className="mt-1 rounded-card bg-bg p-3">{viewing.medicines}</p>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}

export default Prescriptions;