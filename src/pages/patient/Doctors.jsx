import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import DoctorCard from "../../components/domain/DoctorCard";
import { doctors } from "../../data/mock/doctors";

function Doctors() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");

  const specializationOptions = useMemo(
    () => [...new Set(doctors.map((d) => d.specialization))].map((s) => ({ value: s, label: s })),
    []
  );
  const departmentOptions = useMemo(
    () => [...new Set(doctors.map((d) => d.department))].map((d) => ({ value: d, label: d })),
    []
  );

  const filtered = doctors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialization = !specialization || d.specialization === specialization;
    const matchesDepartment = !department || d.department === department;
    return matchesSearch && matchesSpecialization && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text">Find a Doctor</h2>
        <p className="text-sm text-text-muted">Browse and filter available doctors.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
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
        <EmptyState title="No doctors found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.doctor_id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Doctors;