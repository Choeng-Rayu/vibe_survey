export default function Slider(question: { minLabel?: string; maxLabel?: string }) {
  return (
    <div className="space-y-3">
      <div className="h-2 rounded-full bg-[rgba(124,158,138,0.16)]">
        <div className="h-2 w-2/3 rounded-full bg-[var(--primary)]" />
      </div>
      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span>{question.minLabel || "Low"}</span>
        <span>{question.maxLabel || "High"}</span>
      </div>
    </div>
  );
}
