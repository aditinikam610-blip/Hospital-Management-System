import clsx from "clsx";
import { getStatusColor } from "../../constants/statusColors";

function StatusBadge({ status }) {
  const color = getStatusColor(status);

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-card px-2.5 py-1 text-xs font-medium",
        `bg-status-${color}-bg text-status-${color}`
      )}
    >
      {status}
    </span>
  );
}

export default StatusBadge;