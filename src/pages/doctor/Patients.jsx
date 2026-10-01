import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Patients() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);

        const response = await api.get("/appointments/doctor/my");

        const appointments = response.data.appointments || [];

        // Create unique patient list from doctor's appointments
        const patientMap = new Map();

        appointments.forEach((appointment) => {
          const patient = appointment.patient_id || appointment.patient;

          if (!patient) return;

          const patientId = patient._id || patient.patient_id;

          if (!patientId) return;

          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, {
              patient_id: patientId,
              name: patient.name || "Unknown",
              age: patient.age ?? "-",
              gender: patient.gender || "-",
              phone_no: patient.phone_no || "-",
              visits: 1,
            });
          } else {
            const existingPatient = patientMap.get(patientId);
            existingPatient.visits += 1;
          }
        });

        setPatients(Array.from(patientMap.values()));
      } catch (error) {
        console.error(
          "Failed to load patients:",
          error.response?.data || error.message
        );

        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.doctor_id) {
      loadPatients();
    }
  }, [profile]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card title="My Patients">
      <div className="mb-4 relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />

        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="py-10 text-center text-text-muted">
          Loading patients...
        </div>
      ) : filteredPatients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="Patients you've had appointments with will appear here."
        />
      ) : (
        <Table
          rows={filteredPatients}
          rowKey="patient_id"
          columns={[
            {
              key: "patient_id",
              header: "Patient ID",
              render: (patient) =>
                String(patient.patient_id).slice(-6),
            },

            {
              key: "name",
              header: "Name",
            },

            {
              key: "age",
              header: "Age",
            },

            {
              key: "gender",
              header: "Gender",
            },

            {
              key: "phone_no",
              header: "Phone",
            },

            {
              key: "visits",
              header: "Total Visits",
            },

            {
              key: "actions",
              header: "",
              render: (patient) => (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      `/doctor/patients/${patient.patient_id}`
                    )
                  }
                >
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