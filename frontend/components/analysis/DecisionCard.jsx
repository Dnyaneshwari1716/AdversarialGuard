
const verdictStyles = {
  ALLOW: {
    color: "text-emerald-300",
    border: "border-emerald-500/30",
    background: "bg-emerald-500/10",
    dot: "bg-emerald-400",
    description: "The policy allows this prompt to proceed.",
  },
  REVIEW: {
    color: "text-amber-300",
    border: "border-amber-500/30",
    background: "bg-amber-500/10",
    dot: "bg-amber-400",
    description: "This prompt requires additional review.",
  },
  BLOCK: {
    color: "text-red-300",
    border: "border-red-500/30",
    background: "bg-red-500/10",
    dot: "bg-red-400",
    description: "The policy blocks this prompt.",
  },
};

export default function DecisionCard({ decision, demo = false }) {
  const verdict = String(decision || "").toUpperCase();
  const style = verdictStyles[verdict];

  if (!style) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">
          No decision is available yet.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-live="polite"
      className={`rounded-2xl border ${style.border} ${style.background} p-5`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">
            FINAL SECURITY DECISION
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${style.dot}`} />

            <h3 className={`text-3xl font-bold tracking-tight ${style.color}`}>
              {verdict}
            </h3>
          </div>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            {style.description}
          </p>
        </div>

        <span className={`rounded-lg border ${style.border} px-2.5 py-1 text-xs font-semibold ${style.color}`}>
          {demo ? "DEMO" : "POLICY"}
        </span>
      </div>
    </section>
  );
}
