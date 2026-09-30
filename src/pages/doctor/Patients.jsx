import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getPatientsForDoctor, getAppointmentsForDoctorAndPatient } from "../../utils/dataHelpers";

function Patients() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const patients = getPatientsForDoctor(profile.doctor_id).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card title="My Patients">
      <div className="mb-4 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {patients.length === 0 ? (
        <EmptyState title="No patients found" description="Patients you've had appointments with will appear here." />
      ) : (
        <Table
          rows={patients}
          rowKey="patient_id"
          columns={[
            { key: "patient_id", header: "Patient ID" },
            { key: "name", header: "Name" },
            { key: "age", header: "Age" },
            { key: "gender", header: "Gender" },
            { key: "phone_no", header: "Phone" },
            {
              key: "visits",
              header: "Total Visits",
              render: (r) => getAppointmentsForDoctorAndPatient(profile.doctor_id, r.patient_id).length,
            },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <Button size="sm" variant="secondary" onClick={() => navigate(`/doctor/patients/${r.patient_id}`)}>
                  View Details
                </Button>
              ),
            },
          ]}
        />
      )}
    </Card>
  );
}

export default Patients;