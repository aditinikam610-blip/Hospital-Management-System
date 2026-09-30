import { Loader2 } from "lucide-react";
import clsx from "clsx";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-light disabled:bg-primary/50",
  secondary:
    "bg-surface text-primary border border-border hover:bg-bg disabled:opacity-50",
  outline:
    "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white disabled:opacity-50",
  danger:
    "bg-status-danger text-white hover:opacity-90 disabled:opacity-50",
  ghost:
    "bg-transparent text-text-muted hover:bg-bg disabled:opacity-50",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-card font-medium transition-colors duration-150",
        "focus-visible:outline-none",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;