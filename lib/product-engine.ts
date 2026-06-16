export type IntelligenceInput = { input?: string };
const product = {
  "repo": "ContractLens",
  "suite": "Professional Utility",
  "domain": "Contract intelligence",
  "accent": "from-yellow-200 via-amber-300 to-orange-300",
  "hero": "Spot contract risk before a signature becomes a problem.",
  "sub": "ContractLens gives founders, freelancers, and operators a plain-English contract review cockpit for obligations, risk, missing clauses, negotiation moves, and lawyer handoff.",
  "input": "Paste payment, termination, IP, liability, exclusivity, or auto-renewal clauses",
  "cta": "Scan contract risk",
  "score": "Review confidence",
  "modules": [
    [
      "Clause risk",
      "Classify risk by payment, liability, IP, termination, and exclusivity."
    ],
    [
      "Obligation extraction",
      "Turn legal language into owner, date, and action."
    ],
    [
      "Negotiation moves",
      "Suggest safer language and questions to ask."
    ],
    [
      "Lawyer handoff",
      "Prepare a clean summary for professional review."
    ]
  ],
  "rows": [
    [
      "Payment terms",
      "Cash risk",
      "High",
      "Check due dates, late fees, acceptance, and dispute windows."
    ],
    [
      "IP ownership",
      "Asset risk",
      "Critical",
      "Clarify who owns work product and derivative rights."
    ],
    [
      "Termination",
      "Exit risk",
      "Medium",
      "Spot one-sided cancellation or notice traps."
    ],
    [
      "Liability cap",
      "Legal risk",
      "High",
      "Flag unlimited or unclear liability exposure."
    ]
  ],
  "missions": [
    [
      "PDF/DOCX upload",
      "Extract clauses from real files."
    ],
    [
      "Clause library",
      "Build reusable examples of safer language."
    ],
    [
      "Redline assistant",
      "Suggest edits with tracked rationale."
    ],
    [
      "Lawyer handoff export",
      "Package risks and questions for counsel."
    ]
  ]
} as const;
function scoreFor(subject: string) { let score = 57 + Math.min(30, Math.floor(subject.length / 6)); if (/risk|urgent|investor|client|payment|contract|meeting|decision|launch|proof|delay/i.test(subject)) score += 7; return Math.min(98, score); }
function band(score: number) { return score >= 86 ? 'strong' : score >= 72 ? 'ready' : score >= 60 ? 'needs review' : 'starter'; }
export function generateIntelligence({ input = '' }: IntelligenceInput) {
  const subject = input.trim() || product.input;
  const score = scoreFor(subject);
  return {
    product: product.repo,
    brand: 'ArkNet Digital',
    suite: product.suite,
    domain: product.domain,
    subject,
    score,
    status: band(score),
    executive_summary: product.sub,
    intelligence_map: product.modules.map(([label, value]) => ({ label, value, status: score >= 72 ? 'priority' : 'review' })),
    action_queue: product.rows.slice(0, 3).map(([item, owner, priority, note]) => ({ action: item + ' - ' + owner, priority, impact: note })),
    contributor_lanes: product.missions.map(([lane, mission]) => ({ lane, mission })),
    generated_at: new Date().toISOString()
  };
}
