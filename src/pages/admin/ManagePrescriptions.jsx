import { useState } from "react";
import { format, parseISO } from "date-fns";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { getAllPrescriptionsEnriched } from "../../utils/dataHelpers";

function ManagePrescriptions() {
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);

  const prescriptions = getAllPrescriptionsEnriched().filter(
    (p) =>
      p.appointment?.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
      p.appointment?.doctor?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card title="Manage Prescriptions">
      <div className="mb-4 max-w-sm">
        <Input placeholder="Search by patient or doctor" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {prescriptions.length === 0 ? (
        <EmptyState title="No prescriptions found" />
      ) : (
        <Table
          rows={prescriptions}
          rowKey="prescription_id"
          columns={[
            { key: "prescription_id", header: "ID" },
            { key: "patient", header: "Patient", render: (r) => r.appointment?.patient?.name },
            { key: "doctor", header: "Doctor", render: (r) => r.appointment?.doctor?.name },
            { key: "date", header: "Date", render: (r) => format(parseISO(r.appointment.date), "dd MMM yyyy") },
            { key: "diagnosis", header: "Diagnosis" },
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

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Prescription Details">
        {viewing && (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Patient:</span> {viewing.appointment?.patient?.name}</p>
            <p><span className="text-text-muted">Doctor:</span> {viewing.appointment?.doctor?.name}</p>
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

export default ManagePrescriptions;