import { Inbox } from "lucide-react";
import Button from "./Button";

function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Icon size={28} className="text-text-muted" />

      <p className="text-sm font-medium text-text">
        {title}
      </p>

      {description && (
        <p className="max-w-xs text-sm text-text-muted">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          size="sm"
          onClick={onAction}
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;