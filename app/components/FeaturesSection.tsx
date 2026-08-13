"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function FlagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3v18" />
      <path d="M5 4h11l-2.5 4L16 12H5" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5h11" />
      <path d="M9 12h11" />
      <path d="M9 19h11" />
      <path d="M4.5 5h.01" />
      <path d="M4.5 12h.01" />
      <path d="M4.5 19h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M7 21h10" />
      <path d="M5 7h5m4 0h5" />
      <path d="M3.5 11 7 4l3.5 7a3.6 3.6 0 0 1-7 0Z" />
      <path d="M13.5 11 17 4l3.5 7a3.6 3.6 0 0 1-7 0Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  );
}

const FEATURES = [
  { Icon: FlagIcon, title: "Red flag detection", body: "Every risky clause is flagged with its specific problem, severity level, and a concrete rewrite recommendation." },
  { Icon: ListIcon, title: "Missing terms", body: "Contracts often omit protection by accident or design. ContractLens lists what's not there and why it matters." },
  { Icon: CheckIcon, title: "Favorable terms", body: "Not all news is bad — the AI also highlights terms that actually protect you, so you know what to keep in negotiations." },
  { Icon: BookIcon, title: "Plain English", body: "Legal language translated into what this contract actually means for you, your income, and your rights." },
  { Icon: ScaleIcon, title: "Clear recommendation", body: "Sign, Negotiate, Reject, or Seek Counsel — a single action recommendation with the reasoning behind it." },
  { Icon: LockIcon, title: "Private by design", body: "Contract text is analyzed and immediately discarded. Nothing is stored. Sensitive documents stay sensitive." },
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
            <div className="icon-3d mb-3 text-foreground">
              <f.Icon />
            </div>
            <p className="mb-1 font-semibold text-foreground">{f.title}</p>
            <p className="text-sm text-muted leading-relaxed">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
