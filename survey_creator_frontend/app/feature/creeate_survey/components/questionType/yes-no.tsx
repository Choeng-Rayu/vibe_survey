export default function YesNo() {
  return (
    <div className="flex gap-3">
      {["Yes", "No"].map((label) => (
        <span
          key={label}
          className="flex-1 rounded-full border border-[rgba(124,158,138,0.24)] px-4 py-3 text-center text-sm text-[var(--muted)]"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
