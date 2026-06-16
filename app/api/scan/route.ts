import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export type RiskFlag = {
  clause: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  recommendation: string;
};

export type MissingTerm = {
  term: string;
  why: string;
};

export type ContractAnalysis = {
  documentType: string;
  overallRisk: "Low" | "Moderate" | "High" | "Critical";
  riskScore: number;
  summary: string;
  redFlags: RiskFlag[];
  missingTerms: MissingTerm[];
  favorableTerms: string[];
  plainEnglish: string;
  recommendation: "Sign" | "Negotiate" | "Reject" | "Seek Counsel";
};

const DEMO: ContractAnalysis = {
  documentType: "Freelance Service Agreement",
  overallRisk: "High",
  riskScore: 74,
  summary: "This contract heavily favors the client. Three clauses are particularly dangerous: unlimited IP assignment, a non-compete clause, and payment terms with 90-day delays. Negotiate before signing.",
  redFlags: [
    {
      clause: "Section 4.2 — Intellectual Property",
      issue: "Assigns all IP to the client, including work created outside of this engagement or using pre-existing tools and methods.",
      severity: "critical",
      recommendation: "Limit assignment to work specifically created under this contract. Carve out your pre-existing tools, frameworks, and IP.",
    },
    {
      clause: "Section 7.1 — Non-Compete",
      issue: "Prohibits working for any 'competing business' for 12 months post-contract. The definition of 'competing' is vague and extremely broad.",
      severity: "high",
      recommendation: "Cap non-compete to 3 months, restrict to named direct competitors only, and require compensation during the restriction period.",
    },
    {
      clause: "Section 5.4 — Payment Terms",
      issue: "Payment due 90 days after invoice approval, with client retaining right to withhold approval indefinitely pending 'review'.",
      severity: "high",
      recommendation: "Negotiate to Net 30 maximum. Add late payment penalty (1.5%/month). Define 'approval' with a maximum review period of 5 business days.",
    },
    {
      clause: "Section 9.1 — Termination",
      issue: "Client can terminate with 2 days notice; contractor requires 30 days notice. Asymmetric and unreasonable.",
      severity: "medium",
      recommendation: "Equal notice periods of 14 days minimum, or termination payment equal to 2 weeks of fees.",
    },
  ],
  missingTerms: [
    { term: "Scope change / change order process", why: "Without this, the client can expand scope without additional payment." },
    { term: "Dispute resolution clause", why: "No process defined for disagreements — defaults to costly litigation." },
    { term: "Liability cap", why: "Your liability is currently unlimited. Should be capped at contract value." },
  ],
  favorableTerms: [
    "Section 3.1: You retain the right to display work in your portfolio",
    "Section 6.2: Expenses reimbursed at cost with receipts within 30 days",
  ],
  plainEnglish: "This contract was written for the client, not you. They own everything you build (including your existing tools), can fire you on 2 days notice, and might not pay for 90 days. The non-compete could block you from working in your field for a year. Don't sign this as-is.",
  recommendation: "Negotiate",
};

export async function POST(req: NextRequest) {
  const { contract } = await req.json();

  if (!contract || typeof contract !== "string") {
    return NextResponse.json({ error: "contract text required" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    await new Promise((r) => setTimeout(r, 1700));
    return NextResponse.json({ demo: true, analysis: DEMO });
  }

  const systemPrompt = `You are a senior contract attorney with 20 years of experience reviewing commercial and freelance agreements.
Analyze the provided contract text for risks, red flags, and missing terms.

Be honest, specific, and protective of the person sharing the contract (assume they are the service provider / contractor unless context says otherwise).

Return ONLY valid JSON matching exactly this shape:
{
  "documentType": "type of contract",
  "overallRisk": "Low|Moderate|High|Critical",
  "riskScore": 0-100,
  "summary": "2-3 sentence executive summary of key risks",
  "redFlags": [
    {
      "clause": "section reference or title",
      "issue": "specific problem with this clause",
      "severity": "low|medium|high|critical",
      "recommendation": "concrete change to make"
    }
  ],
  "missingTerms": [
    {
      "term": "term that's missing",
      "why": "why this matters"
    }
  ],
  "favorableTerms": ["term that benefits you", ...],
  "plainEnglish": "plain language summary of what this contract really means for you",
  "recommendation": "Sign|Negotiate|Reject|Seek Counsel"
}`;

  const text = contract.slice(0, 8000);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Contract text:\n\n${text}` },
      ],
      temperature: 0.2,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) return NextResponse.json({ error: "AI unavailable" }, { status: 500 });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis: ContractAnalysis = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return NextResponse.json({ demo: false, analysis });
  } catch {
    return NextResponse.json({ error: "Parse failed" }, { status: 500 });
  }
}
