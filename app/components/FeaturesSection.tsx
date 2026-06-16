"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  { icon: "🚩", title: "Red flag detection", body: "Every risky clause is flagged with its specific problem, severity level, and a concrete rewrite recommendation." },
  { icon: "📋", title: "Missing terms", body: "Contracts often omit protection by accident or design. ContractLens lists what's not there and why it matters." },
  { icon: "✅", title: "Favorable terms", body: "Not all news is bad — the AI also highlights terms that actually protect you, so you know what to keep in negotiations." },
  { icon: "📖", title: "Plain English", body: "Legal language translated into what this contract actually means for you, your income, and your rights." },
  { icon: "⚖️", title: "Clear recommendation", body: "Sign, Negotiate, Reject, or Seek Counsel — a single action recommendation with the reasoning behind it." },
  { icon: "🔒", title: "Private by design", body: "Contract text is analyzed and immediately discarded. Nothing is stored. Sensitive documents stay sensitive." },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="mx-auto max-w-4xl px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Your interests,{" "}
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            protected
          </span>
        </h2>
        <p className="mt-3 text-muted">Every contract has traps. ContractLens finds them before you sign.</p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition-colors"
          >
            <div className="mb-3 text-2xl">{f.icon}</div>
            <p className="mb-1 font-semibold text-foreground">{f.title}</p>
            <p className="text-sm text-muted leading-relaxed">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
