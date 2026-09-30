import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-card border border-border bg-surface shadow-card"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2
            id="modal-title"
            className="text-sm font-semibold text-text"
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-card p-1 text-text-muted hover:bg-bg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;