export default function RatingScale10() {
    return (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, index) => (
            <span
              key={index}
              className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(124,158,138,0.28)] text-sm text-[var(--muted)]"
            >
              {index + 1}
            </span>
          ))}
        </div>
      )
}