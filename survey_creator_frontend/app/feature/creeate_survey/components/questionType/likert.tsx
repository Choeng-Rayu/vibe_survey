export default function Likert() {
  return (
    <div className="flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
      {[
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree",
      ].map((label) => (
        <span
          key={label}
          className="flex-1 rounded-full border border-[rgba(124,158,138,0.2)] px-3 py-2 text-center"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
