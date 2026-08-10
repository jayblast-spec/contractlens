'use client';

import { useMemo, useState } from 'react';

type Intel = {
  score: number;
  status: string;
  intelligence_map: Array<{ label: string; value: string; status: string }>;
  action_queue: Array<{ action: string; priority: string; impact: string }>;
  contributor_lanes: Array<{ lane: string; mission: string }>;
};

const example = 'Payment is due within 60 days. All work product and derivative rights transfer to the client. Either party may terminate with 7 days notice. Contractor liability is unlimited.';
const modules = [
  ['Payment terms', 'Cash-flow exposure', 'High'],
  ['IP ownership', 'Asset ownership', 'Critical'],
  ['Termination', 'Exit conditions', 'Medium'],
  ['Liability cap', 'Downside exposure', 'High'],
] as const;

function fallback(subject: string): Intel {
  const score = Math.min(96, 61 + (subject.length % 29));
  return {
    score,
    status: score > 84 ? 'strong' : score > 72 ? 'ready' : 'needs review',
    intelligence_map: modules.map(([label, value, status]) => ({ label, value, status })),
    action_queue: [
      { action: 'Shorten the payment window', priority: 'High', impact: 'Ask for Net 15 or Net 30 with a defined acceptance window.' },
      { action: 'Narrow the IP transfer', priority: 'Critical', impact: 'Carve out pre-existing tools, methods, and reusable know-how.' },
      { action: 'Add a liability ceiling', priority: 'High', impact: 'Tie aggregate liability to fees paid under the agreement.' },
    ],
    contributor_lanes: [],
  };
}

export default function Home() {
  const [subject, setSubject] = useState(example);
  const [intel, setIntel] = useState<Intel>(() => fallback(example));
  const [loading, setLoading] = useState(false);
  const tone = useMemo(() => (intel.score >= 86 ? 'good' : intel.score >= 72 ? 'warn' : 'risk'), [intel.score]);

  async function run() {
    setLoading(true);
    try {
      const response = await fetch('/api/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: subject }),
      });
      setIntel(await response.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ContractLens home">
          <span className="brand-mark">CL</span>
          <span>ContractLens<small>Contract intelligence</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#review">Review</a><a href="#findings">Findings</a><a href="#workflow">How it works</a>
        </nav>
        <a className="header-cta" href="#review">Review a contract</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> CONTRACT REVIEW · PLAIN ENGLISH</p>
          <h1>Know what you’re agreeing to <em>before you sign.</em></h1>
          <p className="lede">ContractLens turns dense clauses into a prioritized review of obligations, exposure, missing protections, and negotiation moves.</p>
          <div className="hero-actions"><a className="button primary" href="#review">Scan contract risk <span>→</span></a><a className="button secondary" href="#findings">See example findings</a></div>
          <div className="trust-row"><span>✓ Clause-level findings</span><span>✓ Actionable negotiation notes</span><span>✓ Counsel-ready summary</span></div>
        </div>

        <div className="review-shell" id="review">
          <div className="window-bar"><span className="window-dots"><i/><i/><i/></span><span>NEW REVIEW</span><span className="secure">● LOCAL SESSION</span></div>
          <div className="review-head"><div><span className="mono">DOCUMENT / EXCERPT</span><h2>Paste a clause to review</h2></div><div className={`score ${tone}`}><small>REVIEW SCORE</small><strong>{intel.score}</strong><span>/100</span></div></div>
          <label className="sr-only" htmlFor="contract-input">Contract text</label>
          <textarea id="contract-input" value={subject} onChange={(event) => setSubject(event.target.value)} />
          <div className="input-footer"><span>{subject.length} characters · Text excerpt</span><button onClick={run} disabled={loading}>{loading ? 'Reviewing clauses…' : 'Run risk review'} <b>→</b></button></div>
          <div className="signal-grid" aria-label="Example review summary">
            <div><small>CRITICAL</small><strong>01</strong><span>IP ownership</span></div>
            <div><small>HIGH RISK</small><strong>02</strong><span>Payment · Liability</span></div>
            <div><small>REVIEW</small><strong>01</strong><span>Termination</span></div>
          </div>
        </div>
      </section>

      <section className="findings" id="findings">
        <div className="section-heading"><p className="eyebrow"><span /> 01 / FINDINGS</p><h2>A decision surface, not a wall of legal text.</h2><p>See the clause, why it matters, and the next move in one scan.</p></div>
        <div className="findings-board">
          <div className="clause-list" role="list">
            {intel.intelligence_map.map((item, index) => <article key={item.label} className={index === 1 ? 'active' : ''}>
              <span className={`severity severity-${String(item.status).toLowerCase()}`}>{item.status}</span><div><h3>{item.label}</h3><p>{item.value}</p></div><b>0{index + 1}</b>
            </article>)}
          </div>
          <div className="finding-detail">
            <div className="detail-top"><span className="severity severity-critical">Critical</span><span className="mono">CLAUSE 7.2 · INTELLECTUAL PROPERTY</span></div>
            <blockquote>“All work product and derivative rights transfer to the client.”</blockquote>
            <div className="analysis-block"><small>WHY THIS MATTERS</small><p>The language may transfer more than the deliverables—including reusable methods, templates, and tools created before this engagement.</p></div>
            <div className="recommendation"><span>NEGOTIATION MOVE</span><p>Carve out pre-existing materials and grant the client a license only to what is required to use the final deliverable.</p></div>
          </div>
        </div>
      </section>

      <section className="actions" aria-labelledby="action-title">
        <div className="section-heading compact"><p className="eyebrow"><span /> 02 / ACTION QUEUE</p><h2 id="action-title">Turn findings into a negotiation plan.</h2></div>
        <div className="action-grid">{intel.action_queue.map((item, index) => <article key={item.action}><div><span>0{index + 1}</span><span className={`priority priority-${item.priority.toLowerCase()}`}>{item.priority}</span></div><h3>{item.action}</h3><p>{item.impact}</p></article>)}</div>
      </section>

      <section className="workflow" id="workflow">
        <div className="section-heading compact"><p className="eyebrow"><span /> 03 / WORKFLOW</p><h2>From contract text to counsel-ready questions.</h2></div>
        <ol><li><b>01</b><div><h3>Paste an excerpt</h3><p>Start with the clauses you need to understand.</p></div></li><li><b>02</b><div><h3>Review exposure</h3><p>See risks grouped by commercial impact.</p></div></li><li><b>03</b><div><h3>Prepare your response</h3><p>Take clear questions and negotiation points to counsel.</p></div></li></ol>
        <p className="disclaimer">ContractLens provides contract intelligence, not legal advice. Have a qualified lawyer review material agreements.</p>
      </section>

      <footer><div className="brand"><span className="brand-mark">CL</span><span>ContractLens<small>Read clearly. Decide confidently.</small></span></div><a href="#review">Start a new review ↑</a></footer>
    </main>
  );
}
