import { Link } from "react-router-dom";
import { Stethoscope, Phone } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";

function DoctorCard({ doctor }) {
  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-text">{doctor.name}</h4>
          <p className="flex items-center gap-1 text-xs text-text-muted">
            <Stethoscope size={13} /> {doctor.specialization}
          </p>
          <p className="text-xs text-text-muted">{doctor.department} Dept.</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
            <Phone size={13} /> {doctor.phone_no}
          </p>
        </div>
      </div>
      <Link to={`/patient/doctors/${doctor.doctor_id}`}>
        <Button size="sm" variant="secondary" fullWidth className="mt-4">
          View Details
        </Button>
      </Link>
    </Card>
  );
}

export default DoctorCard;