"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContractAnalysis, RiskFlag } from "../api/scan/route";

const SEV_COLOR: Record<RiskFlag["severity"], string> = {
  critical: "bg-danger/15 text-danger border-danger/40",
  high: "bg-warn/15 text-warn border-warn/30",
  medium: "bg-muted/15 text-muted border-border",
  low: "bg-surface-2 text-muted border-border",
};

const REC_COLOR: Record<ContractAnalysis["recommendation"], string> = {
  Sign: "bg-success/15 text-success border-success/30",
  Negotiate: "bg-warn/15 text-warn border-warn/30",
  Reject: "bg-danger/15 text-danger border-danger/30",
  "Seek Counsel": "bg-accent/15 text-accent-2 border-accent/30",
};

const RISK_COLOR: Record<ContractAnalysis["overallRisk"], string> = {
  Low: "text-success", Moderate: "text-warn", High: "text-danger", Critical: "text-danger font-black",
};

type State = "idle" | "loading" | "error" | { demo: boolean; analysis: ContractAnalysis };

const PLACEHOLDER = `FREELANCE SERVICE AGREEMENT

This Agreement is entered into between Client ("Client") and Contractor ("Contractor").

1. Services: Contractor agrees to provide web development services as directed by Client.

2. Payment: Client will pay Contractor within 90 days of invoice approval. Client reserves the right to withhold approval pending internal review with no time limit.

3. Intellectual Property: All work product, including pre-existing tools and methodologies, shall become the sole property of Client upon creation.

4. Non-Compete: Contractor agrees not to provide services to any competing business for 12 months following termination.

5. Termination: Client may terminate with 2 days written notice. Contractor must provide 30 days notice.`;

export default function ContractForm() {
  const [contract, setContract] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contract.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setState({ demo: data.demo, analysis: data.analysis });
    } catch {
      setState("error");
    }
  }

  const result = typeof state === "object" ? state : null;
  const a = result?.analysis;

  return (
    <section id="scan" className="mx-auto w-full max-w-3xl px-4 pb-32">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-10">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">Paste contract text</label>
          <textarea
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={10}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-accent focus:outline-none resize-none font-mono"
          />
          <p className="text-xs text-muted">Paste the full contract or specific clauses. Max ~8,000 characters analyzed.</p>
        </div>
        <div className="rounded-xl border border-warn/20 bg-warn/5 px-4 py-2.5 text-xs text-warn/80">
          ⚠ For informational purposes only. Not legal advice. Consult a qualified attorney before signing any contract.
        </div>
        <button
          type="submit"
          disabled={state === "loading" || !contract.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {state === "loading" ? (
            <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" /></svg> Scanning…</>
          ) : "Scan my contract →"}
        </button>
      </form>

      {state === "error" && <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger mb-8">Something went wrong. Please try again.</div>}

      <AnimatePresence>
        {result && a && (
          <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-6">
            {result.demo && (
              <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-2.5 text-xs text-accent-2">
                <span>◈</span> Demo analysis — add a Groq API key to scan your real contract
              </div>
            )}

            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{a.documentType}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-sm font-bold ${RISK_COLOR[a.overallRisk]}`}>{a.overallRisk} Risk · {a.riskScore}/100</span>
                  <span className={`text-xs font-bold border rounded-full px-3 py-0.5 ${REC_COLOR[a.recommendation]}`}>{a.recommendation}</span>
                </div>
              </div>
            </motion.div>

            {/* Risk bar */}
            <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${a.riskScore}%` }}
                transition={{ delay: 0.15, duration: 0.8 }}
                className={`h-full rounded-full ${a.riskScore > 70 ? "bg-danger" : a.riskScore > 40 ? "bg-warn" : "bg-success"}`}
              />
            </div>

            {/* Summary */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Summary</p>
              <p className="text-sm text-foreground">{a.summary}</p>
            </motion.div>

            {/* Plain English */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-accent/20 bg-accent-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Plain English</p>
              <p className="text-sm text-foreground">{a.plainEnglish}</p>
            </motion.div>

            {/* Red flags */}
            {a.redFlags.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Red Flags ({a.redFlags.length})</p>
                <div className="flex flex-col gap-2">
                  {a.redFlags.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }} className="rounded-xl border border-border bg-surface p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 border shrink-0 ${SEV_COLOR[f.severity]}`}>{f.severity}</span>
                        <p className="text-xs font-semibold text-muted">{f.clause}</p>
                      </div>
                      <p className="text-sm text-foreground mb-2">{f.issue}</p>
                      <p className="text-xs text-accent">Fix: {f.recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing terms */}
            {a.missingTerms.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Missing Protections</p>
                <div className="flex flex-col gap-2">
                  {a.missingTerms.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }} className="flex items-start gap-3 rounded-xl border border-warn/20 bg-warn/5 p-3">
                      <span className="text-warn shrink-0">⚠</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.term}</p>
                        <p className="text-xs text-muted mt-0.5">{t.why}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorable terms */}
            {a.favorableTerms.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">What Protects You</p>
                <div className="flex flex-col gap-1">
                  {a.favorableTerms.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + i * 0.05 }} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-success shrink-0">✓</span> {t}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
