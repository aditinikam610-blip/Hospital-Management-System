import clsx from "clsx";

function Card({ title, action, children, className, ...rest }) {
  return (
    <div
      className={clsx(
        "rounded-card border border-border bg-surface shadow-card",
        className
      )}
      {...rest}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          {title && (
            <h3 className="text-sm font-semibold text-text">
              {title}
            </h3>
          )}

          {action}
        </div>
      )}

      <div className="p-5">{children}</div>
    </div>
  );
}

export default Card;