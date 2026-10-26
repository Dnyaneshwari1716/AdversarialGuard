
export default function RiskScore({
  score,
  riskLevel,
}) {
  const validScore =
    typeof score === "number" &&
    Number.isFinite(score) &&
    score >= 0 &&
    score <= 100;

  const levelStyles = {
    LOW: "text-emerald-300 bg-emerald-500/10",
    MEDIUM: "text-amber-300 bg-amber-500/10",
    HIGH: "text-orange-300 bg-orange-500/10",
    CRITICAL: "text-red-300 bg-red-500/10",
  };

  const normalizedLevel = String(
    riskLevel || ""
  ).toUpperCase();

  const levelStyle =
    levelStyles[normalizedLevel] ||
    "text-slate-300 bg-slate-700/50";

  const barColor =
    !validScore
      ? "bg-slate-700"
      : score < 30
        ? "bg-emerald-400"
        : score < 60
          ? "bg-amber-400"
          : score < 80
            ? "bg-orange-400"
            : "bg-red-400";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">
            RISK SCORE
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-white">
              {validScore ? score : "--"}
            </span>

            <span className="text-sm text-slate-500">
              / 100
            </span>
          </div>
        </div>

        {normalizedLevel && (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelStyle}`}>
            {normalizedLevel}
          </span>
        )}
      </div>

      <div
        className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-label="Prompt risk score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={validScore ? score : undefined}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{
            width: `${validScore ? score : 0}%`,
          }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Lower risk</span>
        <span>Higher risk</span>
      </div>

      {!validScore && (
        <p className="mt-3 text-xs text-slate-500">
          A valid risk score will appear after analysis.
        </p>
      )}
    </section>
  );
}
