export type IntelligenceInput = { input?: string };

const product = {
  "repo": "ContractLens",
  "suite": "Professional Utility",
  "category": "Contract review",
  "audience": "founders, freelancers, agencies, and operators reviewing agreements",
  "promise": "spot contract risks, plain-English obligations, and negotiation moves before signing",
  "inputLabel": "Contract clause or agreement summary",
  "placeholder": "Paste payment, termination, IP, liability, or exclusivity clauses",
  "primary": "Scan contract",
  "gradient": "from-yellow-200 via-amber-300 to-orange-300",
  "modules": [
    "Risk classification",
    "Obligation extraction",
    "Missing clause finder",
    "Negotiation script",
    "Decision memo"
  ],
  "outputs": [
    "Risk score",
    "Plain-English summary",
    "Questions for lawyer",
    "Negotiation edits"
  ],
  "next": [
    "PDF/DOCX contract upload",
    "clause library",
    "redline suggestions",
    "lawyer handoff export"
  ]
} as const;

function score(text: string) {
  const length = text.trim().length;
  const diversity = new Set(text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean)).size;
  return Math.min(97, 48 + Math.floor(length / 7) + Math.min(28, diversity));
}

export function generateIntelligence({ input = '' }: IntelligenceInput) {
  const subject = input.trim() || product.placeholder;
  const confidence = score(subject);
  const urgency = confidence > 82 ? 'high' : confidence > 66 ? 'medium' : 'starter';
  return {
    product: product.repo,
    category: product.category,
    subject,
    confidence,
    urgency,
    executive_summary: product.promise,
    immediate_outputs: product.outputs.map((output, index) => ({
      title: output,
      detail: output + ' for: ' + subject,
      priority: index === 0 ? 'primary' : index === 1 ? 'supporting' : 'next'
    })),
    automation_plan: product.modules.map((module, index) => ({
      stage: index + 1,
      module,
      value: 'Automate ' + module.toLowerCase() + ' so ' + product.audience + ' can move faster with less manual work.'
    })),
    future_addons: product.next.map((addon, index) => ({
      name: addon,
      horizon: index < 2 ? 'v2' : 'v3',
      contributor_lane: index % 2 === 0 ? 'integration' : 'product intelligence'
    })),
    contributor_brief: 'Improve ' + product.repo + ' by making ' + product.category.toLowerCase() + ' easier for ' + product.audience + '.',
    generated_at: new Date().toISOString()
  };
}
