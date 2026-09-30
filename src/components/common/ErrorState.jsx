import { AlertCircle } from "lucide-react";
import Button from "./Button";

function ErrorState({
  title = "Unable to load data",
  description,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <AlertCircle
        size={28}
        className="text-status-danger"
      />

      <p className="text-sm font-medium text-text">
        {title}
      </p>

      {description && (
        <p className="max-w-xs text-sm text-text-muted">
          {description}
        </p>
      )}

      {onRetry && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onRetry}
          className="mt-2"
        >
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;