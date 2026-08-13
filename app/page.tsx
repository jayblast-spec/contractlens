'use client';

import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ContractForm from './components/ContractForm';
import Footer from './components/Footer';

export default function Home() {
  function scrollToScan() {
    document.getElementById('scan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-border bg-background/85 px-4 py-3.5 backdrop-blur-lg sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="ContractLens home">
          <span className="icon-3d h-9 w-9 text-sm font-bold text-foreground">CL</span>
          <span className="text-sm font-semibold tracking-tight text-foreground">ContractLens</span>
        </a>
        <button
          onClick={scrollToScan}
          className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all"
        >
          Scan a contract
        </button>
      </header>

      <div id="top">
        <HeroSection onScanClick={scrollToScan} />
      </div>
      <FeaturesSection />
      <ContractForm />
      <Footer />
    </main>
  );
}
