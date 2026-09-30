import { CalendarClock } from "lucide-react";
import { format, parseISO } from "date-fns";
import StatusBadge from "../common/StatusBadge";

function AppointmentCard({ appointment }) {
  const { doctor, date, time, status } = appointment;

  return (
    <div className="flex items-center gap-4 rounded-card border border-border bg-surface p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        <CalendarClock size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">{doctor?.name}</p>
        <p className="text-xs text-text-muted">{doctor?.specialization}</p>
        <p className="text-xs text-text-muted">
          {format(parseISO(date), "dd MMM yyyy")} · {time}
        </p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

export default AppointmentCard;