import { QuestionOption } from "../../types/question";

export default function Matrix({
  rows = [],
  columns = ["1", "2", "3"],
}: {
  rows?: QuestionOption[];
  columns?: string[];
}) {
  const fallbackRows: QuestionOption[] = [
    { id: "1", text: "Row 1" },
    { id: "2", text: "Row 2" },
  ];

  const safeRows = rows.length ? rows : fallbackRows;

  return (
    <div className="overflow-hidden rounded-[16px] border border-[rgba(124,158,138,0.18)]">
      {safeRows.map((row) => (
        <div
          key={row.id} // ✅ use id
          className="grid grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] border-b border-[rgba(124,158,138,0.12)] last:border-b-0 text-xs text-[var(--muted)]"
        >
          <div className="bg-[rgba(124,158,138,0.06)] px-3 py-3 text-[var(--text)] flex items-center gap-2">
            {/* Optional image */}
            {row.imageUrl && (
              <img
                src={row.imageUrl}
                alt={row.text}
                className="w-5 h-5 object-cover rounded"
              />
            )}

            {row.text} {/* ✅ correct field */}
          </div>

          {columns.map((column) => (
            <div
              key={column}
              className="flex items-center justify-center px-3 py-3"
            >
              ○
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}