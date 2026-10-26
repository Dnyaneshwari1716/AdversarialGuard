
import { useState } from "react";

export default function PromptInput({
  onAnalyze,
  loading = false,
}) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError("Please enter a prompt to analyze.");
      return;
    }

    setError("");
    onAnalyze(trimmedPrompt);
  };

  const handleChange = (event) => {
    setPrompt(event.target.value);

    if (error && event.target.value.trim()) {
      setError("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Prompt Security Analyzer
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Inspect a prompt for potential injection attacks.
          </p>
        </div>

        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
          Text analysis
        </span>
      </div>

      <label
        htmlFor="prompt-input"
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        Prompt to analyze
      </label>

      <textarea
        id="prompt-input"
        value={prompt}
        onChange={handleChange}
        placeholder="Paste or type a prompt here..."
        rows={7}
        maxLength={20000}
        disabled={loading}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "prompt-error" : "prompt-help"}
        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="mt-2 flex items-start justify-between gap-3">
        <p
          id={error ? "prompt-error" : "prompt-help"}
          role={error ? "alert" : undefined}
          className={`text-xs ${
            error ? "text-red-400" : "text-slate-500"
          }`}
        >
          {error || "Do not include real passwords or API keys."}
        </p>

        <span className="shrink-0 text-xs text-slate-500">
          {prompt.length.toLocaleString()} / 20,000
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setPrompt("");
            setError("");
          }}
          disabled={loading || !prompt}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear prompt
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}

          {loading ? "Analyzing..." : "Analyze prompt"}
        </button>
      </div>
    </form>
  );
}
