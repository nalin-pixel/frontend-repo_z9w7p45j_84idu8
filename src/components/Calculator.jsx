import { useEffect, useMemo, useState } from "react";
import { Loader2, Percent, RefreshCcw } from "lucide-react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Calculator() {
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState("exclusive");
  const [description, setDescription] = useState("restaurant dinner bill");
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const parsedRate = useMemo(() => {
    const r = parseFloat(rate);
    return Number.isFinite(r) ? r : undefined;
  }, [rate]);

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), mode, description, rate: parsedRate }),
      });
      if (!res.ok) throw new Error("Failed to calculate");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Could not reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setTimeout(() => {
      if (amount) calculate();
    }, 350);
    return () => clearTimeout(id);
  }, [amount, mode, description, parsedRate]);

  function reset() {
    setAmount(1000);
    setMode("exclusive");
    setDescription("");
    setRate("");
    setResult(null);
  }

  return (
    <section className="max-w-3xl mx-auto w-full bg-slate-800/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              min={0}
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Description (AI detection)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., mobile phone, restaurant bill, essential groceries"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-blue-200/80 mb-1">Mode</label>
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                <button
                  onClick={() => setMode("exclusive")}
                  className={`flex-1 px-4 py-2 text-sm ${mode === "exclusive" ? "bg-blue-600 text-white" : "bg-slate-900/60 text-blue-200"}`}
                >
                  Exclusive
                </button>
                <button
                  onClick={() => setMode("inclusive")}
                  className={`flex-1 px-4 py-2 text-sm ${mode === "inclusive" ? "bg-blue-600 text-white" : "bg-slate-900/60 text-blue-200"}`}
                >
                  Inclusive
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-blue-200/80 mb-1 flex items-center gap-1">Override Rate <Percent className="w-3 h-3" /></label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g., 18"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                min={0}
                max={100}
                step="0.01"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={calculate}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Calculate
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 text-blue-100 hover:bg-slate-600 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Reset
            </button>
            {error && <span className="text-sm text-red-300">{error}</span>}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-5 border border-white/10">
          <h3 className="text-white font-semibold mb-3">Result</h3>
          {result ? (
            <div className="space-y-2 text-blue-100">
              <div className="flex justify-between"><span>Applied rate</span><span className="font-semibold">{result.applied_rate}%</span></div>
              {result.detected_category && (
                <div className="flex justify-between text-blue-300/80"><span>Category</span><span>{result.detected_category} ({result.source})</span></div>
              )}
              <div className="h-px bg-white/10 my-3" />
              <div className="flex justify-between"><span>Net amount</span><span className="font-semibold">₹ {result.net_amount?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>GST</span><span className="font-semibold">₹ {result.gst_amount?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Gross amount</span><span className="font-semibold">₹ {result.gross_amount?.toFixed(2)}</span></div>
            </div>
          ) : (
            <p className="text-blue-200/70">Enter details to see the calculation in real time.</p>
          )}
        </div>
      </div>
    </section>
  );
}
