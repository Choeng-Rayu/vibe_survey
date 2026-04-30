export default function DateTime() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        className="h-12 rounded-full border border-[rgba(124,158,138,0.24)] bg-[rgba(250,247,242,0.8)] px-4 text-sm text-[var(--muted)] outline-none"
        value="Select date"
        readOnly
      />
      <input
        className="h-12 rounded-full border border-[rgba(124,158,138,0.24)] bg-[rgba(250,247,242,0.8)] px-4 text-sm text-[var(--muted)] outline-none"
        value="Select time"
        readOnly
      />
    </div>
  );
}
