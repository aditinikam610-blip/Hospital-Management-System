import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Phone, Stethoscope, Building2 } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import ErrorState from "../../components/common/ErrorState";
import api from "../../services/api";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch doctor from MongoDB
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/doctors/${id}`);

        if (response.data.success) {
          setDoctor(response.data.doctor);
        }
      } catch (error) {
        console.error("Failed to load doctor:", error);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <Card title="Doctor Details">
        <p className="text-sm text-text-muted">
          Loading doctor details...
        </p>
      </Card>
    );
  }

  if (!doctor) {
    return (
      <ErrorState
        title="Doctor not found"
        description="This doctor may no longer be available."
        onRetry={() => navigate("/patient/doctors")}
      />
    );
  }

  const doctorName =
    doctor.name ||
    doctor.full_name ||
    "Doctor";

  return (
    <Card title="Doctor Details">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
          {doctorName
            .replace("Dr. ", "")
            .split(" ")
            .map((p) => p[0])
            .join("")}
        </span>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-text">
              {doctorName}
            </h3>

            <p className="text-sm text-text-muted">
              {doctor.specialization || "-"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-text">
              <Stethoscope
                size={16}
                className="text-text-muted"
              />

              {doctor.specialization || "-"}
            </p>

            <p className="flex items-center gap-2 text-sm text-text">
              <Building2
                size={16}
                className="text-text-muted"
              />

              {doctor.department
                ? `${doctor.department} Department`
                : "-"}
            </p>

            <p className="flex items-center gap-2 text-sm text-text">
              <Phone
                size={16}
                className="text-text-muted"
              />

              {doctor.phone_no || "-"}
            </p>
          </div>

          <Button
            onClick={() =>
              navigate(
                `/patient/book-appointment?doctorId=${
                  doctor._id
                }`
              )
            }
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default DoctorDetails;