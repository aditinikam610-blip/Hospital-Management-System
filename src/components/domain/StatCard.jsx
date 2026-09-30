function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-4 shadow-card">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xl font-semibold text-text">{value}</p>
        <p className="text-xs text-text-muted">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;