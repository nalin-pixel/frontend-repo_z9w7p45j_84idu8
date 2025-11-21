import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="py-10 text-center">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
        <Sparkles className="w-4 h-4 text-blue-300" />
        <span className="text-xs text-blue-200/80">AI‑assisted GST Calculator</span>
      </div>
      <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
        Dynamic GST Calculator
      </h1>
      <p className="mt-3 text-blue-200/80 max-w-2xl mx-auto">
        Real‑time GST for goods and services. Type a description and amount — the system detects an appropriate rate or use your own.
      </p>
    </header>
  );
}
