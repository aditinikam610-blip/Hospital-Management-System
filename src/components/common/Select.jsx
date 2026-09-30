import { useId } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

function Select({
  label,
  error,
  required = false,
  options = [],
  placeholder = "Select an option",
  id,
  className,
  ...rest
}) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text">
          {label}
          {required && <span className="text-status-danger"> *</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={clsx(
            "w-full appearance-none rounded-card border bg-surface px-3 py-2 pr-9 text-sm text-text",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            error ? "border-status-danger" : "border-border",
            className
          )}
          
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
      </div>

      {error && (
        <p id={`${selectId}-error`} className="text-xs text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;