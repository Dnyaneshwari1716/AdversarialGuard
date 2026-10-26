
export default function EvidencePanel({
  explanation,
  evidence = [],
}) {
  const items = Array.isArray(evidence) ? evidence : [];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4M11 8v3M11 14h.01" />
          </svg>
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Detection Evidence
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Signals reported by the analysis pipeline
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-medium text-slate-300">
          Explanation
        </h4>

        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
          {explanation ||
            "No explanation is available. Run an analysis to see the detector's findings."}
        </p>
      </div>

      <div className="mt-5 border-t border-slate-800 pt-4">
        <h4 className="text-sm font-medium text-slate-300">
          Evidence signals
          <span className="ml-2 rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
            {items.length}
          </span>
        </h4>

        {items.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {items.map((item, index) => {
              const isObject =
                item !== null && typeof item === "object";

              const title = isObject
                ? item.title || item.name || item.signal || "Detection signal"
                : String(item);

              const description = isObject
                ? item.description || item.details
                : null;

              return (
                <li
                  key={isObject ? item.id || `${title}-${index}` : `${title}-${index}`}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />

                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-slate-200">
                        {title}
                      </p>

                      {description && (
                        <p className="mt-1 break-words text-sm leading-5 text-slate-400">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-slate-800 p-4 text-sm text-slate-500">
            No evidence signals were returned.
          </p>
        )}
      </div>
    </section>
  );
}
