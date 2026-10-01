import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import DoctorCard from "../../components/domain/DoctorCard";
import api from "../../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch doctors from MongoDB
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");

        if (response.data.success) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Specialization filter options
  const specializationOptions = useMemo(
    () =>
      [...new Set(doctors.map((d) => d.specialization).filter(Boolean))]
        .map((s) => ({
          value: s,
          label: s,
        })),
    [doctors]
  );

  // Department filter options
  const departmentOptions = useMemo(
    () =>
      [...new Set(doctors.map((d) => d.department).filter(Boolean))]
        .map((d) => ({
          value: d,
          label: d,
        })),
    [doctors]
  );

  // Filter doctors
  const filtered = doctors.filter((doctor) => {
    const doctorName =
      doctor.name ||
      doctor.full_name ||
      "";

    const matchesSearch = doctorName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSpecialization =
      !specialization ||
      doctor.specialization === specialization;

    const matchesDepartment =
      !department ||
      doctor.department === department;

    return (
      matchesSearch &&
      matchesSpecialization &&
      matchesDepartment
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-text">
            Find a Doctor
          </h2>
          <p className="text-sm text-text-muted">
            Loading doctors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text">
          Find a Doctor
        </h2>

        <p className="text-sm text-text-muted">
          Browse and filter available doctors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
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

        <Select
          placeholder="All specializations"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          options={specializationOptions}
        />

        <Select
          placeholder="All departments"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={departmentOptions}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="No doctors are currently available."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor) => (
            <DoctorCard
              key={doctor._id || doctor.doctor_id}
              doctor={{
                ...doctor,
                doctor_id: doctor._id || doctor.doctor_id,
                name:
                  doctor.name ||
                  doctor.full_name ||
                  "Doctor",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Doctors;