const STATUS_MAP = {
  pending: "warning",
  accepted: "success",
  confirmed: "success",
  completed: "info",
  cancelled: "danger",
  rejected: "danger",
  paid: "success",
  unpaid: "warning",
  active: "success",
  inactive: "danger",
};

export function getStatusColor(status) {
  if (!status) return "info";

  const key = status.toString().trim().toLowerCase();

  return STATUS_MAP[key] || "info";
}