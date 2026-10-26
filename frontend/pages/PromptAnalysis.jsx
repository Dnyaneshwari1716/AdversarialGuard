
import { useState } from "react";
import PromptInput from "../components/analysis/PromptInput";
import DecisionCard from "../components/analysis/DecisionCard";
import RiskScore from "../components/analysis/RiskScore";
import EvidencePanel from "../components/analysis/EvidencePanel";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const DETECT_ENDPOINT =
  import.meta.env.VITE_DETECT_ENDPOINT ||
  `${API_BASE_URL}/api/detect`;

const demoResult = {
  decision: "REVIEW",
  riskScore: 58,
  riskLevel: "MEDIUM",
  explanation:
    "This is illustrative demo data, not a real security analysis. Connect the detection API to receive actual findings.",
  evidence: [
    {
      title: "Demo detection signal",
      description:
        "Example evidence displayed to demonstrate the interface.",
    },
    {
      title: "Backend integration pending",
      description:
        "Actual detector signals will appear when the API is connected.",
    },
  ],
};

function normalizeResult(data) {
  const decision = String(
    data?.decision ?? data?.verdict ?? ""
  ).toUpperCase();

  if (!["ALLOW", "REVIEW", "BLOCK"].includes(decision)) {
    throw new Error(
      "The API response does not contain a valid ALLOW, REVIEW, or BLOCK decision."
    );
  }

  const rawScore = data?.riskScore ?? data?.risk_score;
  const riskScore =
    rawScore !== null && rawScore !== undefined && rawScore !== ""
      ? Number(rawScore)
      : null;

  if (
    riskScore !== null &&
    (!Number.isFinite(riskScore) ||
      riskScore < 0 ||
      riskScore > 100)
  ) {
    throw new Error("The API returned an invalid risk score.");
  }

  return {
    decision,
    riskScore,
    riskLevel: data?.riskLevel ?? data?.risk_level ?? "",
    explanation:
      data?.explanation ??
      data?.reason ??
      "",
    evidence:
      data?.evidence ??
      data?.signals ??
      [],
  };
}

export default function PromptAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const handleAnalyze = async (prompt) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (demoMode) {
        // Explicit demo mode: no classifier is executed.
        await new Promise((resolve) => setTimeout(resolve, 500));
        setResult({ ...demoResult });
        return;
      }

      const response = await fetch(DETECT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          `Analysis failed (${response.status}). ${
            message || "Please try again."
          }`
        );
      }

      const data = await response.json();
      setResult(normalizeResult(data));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze the prompt."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1220] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <header className="mb-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
            <span>Security Center</span>
            <span className="text-slate-600">/</span>
            <span>Prompt Analysis</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Prompt Analysis
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Analyze input prompts for potential prompt injection
            attacks and inspect the security decision and its evidence.
          </p>
        </header>

        {/* Demo mode toggle */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div>
            <p className="text-sm font-medium text-slate-200">
              Analysis mode
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {demoMode
                ? "Using illustrative demo data. No detector is running."
                : "Connected mode sends the prompt to your configured API."}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setDemoMode((current) => !current);
              setResult(null);
              setError("");
            }}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-white disabled:opacity-50"
          >
            {demoMode ? "Switch to API mode" : "Preview demo"}
          </button>
        </div>

        {/* Prompt input */}
        <PromptInput
          onAnalyze={handleAnalyze}
          loading={loading}
        />

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
          >
            <p className="text-sm font-semibold text-red-300">
              Analysis could not be completed
            </p>
            <p className="mt-1 break-words text-sm text-red-200/80">
              {error}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Check that FastAPI is running, the endpoint is correct,
              and CORS permits requests from this frontend.
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            role="status"
            className="mt-5 flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4"
          >
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
            <span className="text-sm text-slate-300">
              Analyzing prompt...
            </span>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <section className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">
                Analysis Results
              </h2>

              {demoMode && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                  Illustrative demo
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <DecisionCard
                decision={result.decision}
                demo={demoMode}
              />

              <RiskScore
                score={result.riskScore}
                riskLevel={result.riskLevel}
              />
            </div>

            <EvidencePanel
              explanation={result.explanation}
              evidence={result.evidence}
            />
          </section>
        )}

        {/* Initial state */}
        {!result && !loading && !error && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-800 px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-blue-400">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <h2 className="mt-4 font-semibold text-slate-200">
              Ready to analyze
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Enter a prompt above to view its security decision,
              risk score and available detection evidence.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
