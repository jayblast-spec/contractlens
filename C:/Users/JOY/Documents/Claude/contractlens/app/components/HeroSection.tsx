"use client";

import { motion } from "framer-motion";

export default function HeroSection({ onScanClick }: { onScanClick: () => void }) {
  return (
    <section className="forest-bg leaf-grid relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/6 blur-[130px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex max-w-3xl flex-col items-center gap-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-4 py-1.5 text-xs font-semibold text-accent-2"
        >
          <span>◈</span> AI contract review · Free · Attorney-level analysis
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          Know before you sign.
          <br />
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            AI finds the traps.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="max-w-xl text-base text-muted sm:text-lg"
        >
          Paste any contract or clause and ContractLens flags red flags, missing terms, and unfair clauses —
          with plain-English explanations and a clear recommendation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            onClick={onScanClick}
            className="rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-background hover:opacity-90 active:scale-95 transition-all"
          >
            Scan my contract →
          </button>
          <span className="text-xs text-muted">Not legal advice · For informational use</span>
        </motion.div>

        {/* Risk preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 w-full max-w-xs rounded-2xl border border-border bg-surface p-5 text-left shadow-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Risk scan</p>
            <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-full">High Risk</span>
          </div>
          {[
            { sev: "critical", text: "Unlimited IP assignment detected" },
            { sev: "high", text: "12-month non-compete clause" },
            { sev: "medium", text: "90-day payment terms" },
          ].map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="flex items-center gap-2 mb-2"
            >
              <span className={`h-2 w-2 rounded-full shrink-0 ${f.sev === "critical" ? "bg-danger" : f.sev === "high" ? "bg-warn" : "bg-muted"}`} />
              <p className="text-xs text-muted">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted"
      >
        <span className="text-xs">Scan yours below</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} className="h-4 w-px bg-muted/50" />
      </motion.div>
    </section>
  );
}
