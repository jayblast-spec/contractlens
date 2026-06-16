"use client";

import { useRef } from "react";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import ContractForm from "./components/ContractForm";
import Footer from "./components/Footer";

export default function Home() {
  const scanRef = useRef<HTMLDivElement>(null);

  function scrollToScan() {
    scanRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <HeroSection onScanClick={scrollToScan} />
      <FeaturesSection />
      <div ref={scanRef} className="scroll-mt-8 pt-8">
        <div className="mx-auto max-w-3xl px-4 mb-10">
          <h2 className="text-xl font-bold text-foreground">Scan your contract</h2>
          <p className="text-sm text-muted mt-1">
            Paste any contract text below. Freelance agreements, client MSAs, employment contracts — all supported.
          </p>
        </div>
        <ContractForm />
      </div>
      <Footer />
    </main>
  );
}
