export default function RatingScale5() {
  return (
    <div className="flex gap-3 text-[var(--border)]">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className="text-3xl leading-none">
          ☆
        </span>
      ))}
    </div>
  );
}
