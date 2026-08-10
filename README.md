<div align="center">

# ContractLens

### Contract Intelligence Cockpit

ContractLens gives founders, freelancers, and operators a plain-English contract review cockpit — clause risk scanning, obligation extraction, negotiation-move suggestions, and lawyer-handoff summaries — so a signature never becomes a surprise.

<p>
  <a href="https://contractlens-rho.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live-Demo-1D4ED8?style=for-the-badge&logo=vercel&logoColor=white"></a>
  <a href="https://github.com/jayblast-spec/contractlens"><img alt="GitHub Repo" src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white"></a>
</p>

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React%2019-149ECA?style=flat-square&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white">
  <img alt="Stripe" src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white">
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-1D4ED8?style=flat-square&logo=framer&logoColor=white">
</p>

<p>
  <img alt="Animated ContractLens headline" src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=18&duration=2600&pause=650&color=1D4ED8&center=true&vCenter=true&width=760&lines=Spot+contract+risk+before+you+sign;Clause+risk+%2B+obligation+extraction;Negotiation+moves%2C+plain+English;Clean+summary+for+lawyer+handoff">
</p>

</div>

## What It Does

ContractLens takes pasted contract text (payment, termination, IP, liability, exclusivity, auto-renewal clauses) and returns a review-confidence score with a risk breakdown across payment terms, IP ownership, termination, and liability caps. It classifies clause risk, extracts obligations into owner/date/action form, suggests safer negotiation language, and prepares a clean summary for a lawyer handoff. Paid checkout is wired through Stripe for the professional tier.

## How It Works

Built on Next.js (App Router, latest) with React 19 and TypeScript, styled with Tailwind CSS v4. The client (`app/page.tsx`) posts contract text to `/api/intelligence`, which returns a score, status, and structured risk/action data (with a deterministic client-side fallback when the API is unavailable). Additional routes under `app/api/` handle `scan` (contract scanning), `checkout` and `stripe` (subscription billing via Stripe), and `intelligence` (the core analysis endpoint). Supabase (`@supabase/supabase-js`) provides auth and persistence; Framer Motion drives interface animation.

## Live

https://contractlens-rho.vercel.app

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Backend / Auth | Supabase |
| Billing | Stripe |
| Motion | Framer Motion |
| Deployment | Vercel |

<p align="center">
  <img alt="ArkNet Digital footer" src="https://capsule-render.vercel.app/api?type=waving&height=120&color=0:1D4ED8,55:0B1E3D,100:020617&section=footer&text=ArkNet%20Digital&fontColor=FFFFFF&fontSize=24&fontAlign=50&fontAlignY=65&desc=michael@arknet.digital&descAlign=50&descAlignY=85">
</p>
