import { Loader2 } from "lucide-react";

function Loading({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-text-muted">
      <Loader2 size={24} className="animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default Loading;