import { useId } from "react";
import clsx from "clsx";

function Input({
  label,
  error,
  required = false,
  type = "text",
  id,
  className,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
          {required && <span className="text-status-danger"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={clsx(
          "w-full rounded-card border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          error ? "border-status-danger" : "border-border",
          className
        )}
        {...rest}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;