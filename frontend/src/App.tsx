import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Activity, BrainCircuit, FileCheck2, Lock, RefreshCw, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import { apiRequest } from './api';
import { formatValue, toneForRisk } from './lib/viewModel';

type RecordItem = Record<string, unknown> & { id: string };
type Metrics = { kpis: Record<string, number> };
type DomainResult = Record<string, unknown> & { reasonCodes?: string[]; explanation?: string };

const roles = [
  "ADMIN",
  "WELLNESS_COACH",
  "USER",
  "FAMILY_REVIEWER",
  "VIEWER"
];
const primaryColumns = [
  "merchantName",
  "category",
  "amount",
  "decision",
  "impulseScore"
];
const fallbackPrimary = [
  {
    "id": "intent_001",
    "merchantName": "Office Canteen",
    "category": "FOOD",
    "amount": 52,
    "decision": "NO_FRICTION",
    "impulseScore": 8,
    "createdAt": "2026-05-27T11:50:00.000Z"
  },
  {
    "id": "intent_002",
    "merchantName": "Late Night Eats",
    "category": "FOOD_DELIVERY",
    "amount": 620,
    "decision": "DELAY",
    "impulseScore": 74,
    "createdAt": "2026-05-27T11:54:00.000Z"
  },
  {
    "id": "intent_003",
    "merchantName": "Flash Sale Mall",
    "category": "SHOPPING",
    "amount": 3499,
    "decision": "BUDGET_OVERRIDE",
    "impulseScore": 81,
    "createdAt": "2026-05-27T11:58:00.000Z"
  }
];
const fallbackSecondary = [
  {
    "id": "rule_001",
    "name": "Late-night food brake",
    "category": "FOOD_DELIVERY",
    "thresholdAmount": 500,
    "maxWeeklyCount": 2,
    "friction": "DELAY_60_SECONDS",
    "active": true,
    "createdAt": "2026-05-27T10:20:00.000Z"
  },
  {
    "id": "rule_002",
    "name": "Shopping budget override",
    "category": "SHOPPING",
    "thresholdAmount": 2500,
    "maxWeeklyCount": 1,
    "friction": "ASK_REASON",
    "active": true,
    "createdAt": "2026-05-27T10:25:00.000Z"
  }
];
const domainPayload = {
  "amount": 620,
  "category": "FOOD_DELIVERY",
  "hour": 0,
  "weeklyCategoryCount": 3,
  "monthlyBudgetUsed": 0.83,
  "selfControlRuleHit": true,
  "upiLite": false,
  "emotionalRisk": 0.62
};
const createPayload = {
  "merchantName": "Late Night Eats",
  "category": "FOOD_DELIVERY",
  "amount": 620,
  "decision": "DELAY",
  "impulseScore": 74
};

export default function App() {
  const [role, setRole] = useState('WELLNESS_COACH');
  const [primary, setPrimary] = useState<RecordItem[]>(fallbackPrimary);
  const [secondary, setSecondary] = useState<RecordItem[]>(fallbackSecondary);
  const [metrics, setMetrics] = useState<Metrics>({ kpis: { primaryRecords: fallbackPrimary.length, secondaryRecords: fallbackSecondary.length, totalAmount: 0, averageRisk: 0 } });
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState('');
  const riskyCount = useMemo(() => primary.filter((item) => Number(item.riskScore || item.impulseScore || 0) >= 70).length, [primary]);

  async function load() {
    try {
      const [nextMetrics, nextPrimary, nextSecondary] = await Promise.all([
        apiRequest<Metrics>('/metrics', role),
        apiRequest<RecordItem[]>('/payment-intents', role),
        apiRequest<RecordItem[]>('/spend-rules', role)
      ]);
      setMetrics(nextMetrics);
      setPrimary(nextPrimary);
      setSecondary(nextSecondary);
      setError('');
    } catch {
      setError('API offline: showing synthetic portfolio data.');
    }
  }

  useEffect(() => {
    void load();
  }, [role]);

  async function runDecision() {
    const response = await apiRequest<DomainResult>('/brake-decisions', role, { method: 'POST', body: JSON.stringify(domainPayload) });
    setResult(response);
  }

  async function createRecord() {
    const created = await apiRequest<RecordItem>('/payment-intents', role, { method: 'POST', body: JSON.stringify(createPayload) });
    setPrimary([created, ...primary]);
  }

  async function removeRecord(id: string) {
    await apiRequest<void>('/payment-intents/' + id, role, { method: 'DELETE' });
    setPrimary(primary.filter((item) => item.id !== id));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><img src="/logo.svg" alt="" /><span>UPI Cognitive Spend Brake</span></div>
        {['Command Center', 'Payment Intent Simulator', 'Spend Brake Rules', 'Risk Review', 'Audit Trail', 'Reports'].map((item, index) => (
          <button className={index === 0 ? 'nav-item active' : 'nav-item'} key={item}><ShieldCheck size={16} />{item}</button>
        ))}
        <div className="region-card"><span>Mode</span><strong>UPI simulator</strong><small>Synthetic data only</small></div>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <h1>AI friction layer for responsible digital spending before simulated UPI payment approval.</h1>
            <p>A behavioral AI system that detects impulse risk, UPI Lite micro-spend leakage, late-night drift, category overuse, and self-control rule violations, then adds only the minimum useful payment friction.</p>
          </div>
          <div className="top-actions">
            <span className="live-dot">Live</span>
            <select value={role} onChange={(event) => setRole(event.target.value)}>{roles.map((item) => <option key={item}>{item}</option>)}</select>
            <button onClick={load}><RefreshCw size={16} />Refresh</button>
          </div>
        </header>
        {error ? <div className="notice">{error}</div> : null}
        <section className="kpi-grid">
          <Metric title="Payment Intent Simulator" value={String(metrics.kpis.primaryRecords ?? primary.length)} detail="operational records" icon={<Activity />} />
          <Metric title="Spend Brake Rules" value={String(metrics.kpis.secondaryRecords ?? secondary.length)} detail="policy and trust memory" icon={<FileCheck2 />} />
          <Metric title="Risk Watch" value={String(riskyCount)} detail="high-friction cases" icon={<BrainCircuit />} />
          <Metric title="Avg Risk" value={String(metrics.kpis.averageRisk ?? 0)} detail="synthetic model signal" icon={<Lock />} />
        </section>
        <section className="workspace-grid">
          <div className="panel span-two">
            <div className="panel-title"><Sparkles size={18} /> Friction Decision</div>
            <div className="simulator-row">
              <button onClick={runDecision}><Sparkles size={16} />Run Spend Brake</button>
              <button onClick={createRecord}><Activity size={16} />Create Record</button>
            </div>
            <div className="recommendation-card">
              <div><span>Decision</span><strong>{String(result?.decision || result?.status || 'Run simulator')}</strong></div>
              <div><span>Risk</span><strong>{String(result?.riskScore || result?.impulseScore || 0)}</strong></div>
              <p>{String(result?.explanation || 'The model evaluates synthetic signals and returns reason codes for a review-ready decision.')}</p>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title"><ShieldCheck size={18} /> Reason Codes</div>
            {(result?.reasonCodes || ['READY_FOR_SIMULATION', 'RBAC_ENABLED', 'SYNTHETIC_ONLY']).map((code) => <div className="node-row" key={code}><strong>{code}</strong><span>Explainability signal</span></div>)}
          </div>
          <div className="panel span-three">
            <div className="panel-title"><Lock size={18} /> Payment Intent Simulator CRUD</div>
            <div className="table">
              <div className="table-row header">{primaryColumns.map((column) => <span key={column}>{column}</span>)}<span>Action</span></div>
              {primary.map((item) => {
                const risk = Number(item.riskScore || item.impulseScore || 0);
                return (
                  <div className="table-row" key={item.id}>
                    {primaryColumns.map((column) => <span className={/risk|impulse/i.test(column) ? 'status ' + toneForRisk(risk) : ''} key={column}>{formatValue(column, item[column])}</span>)}
                    <span><button className="icon-button" onClick={() => void removeRecord(item.id)}><Trash2 size={15} /></button></span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="panel span-three">
            <div className="panel-title"><FileCheck2 size={18} /> Spend Brake Rules</div>
            <div className="secondary-grid">{secondary.map((item) => <div className="case-card" key={item.id}>{Object.entries(item).filter(([key]) => !['id', 'createdAt'].includes(key)).slice(0, 4).map(([key, value]) => <p key={key}><strong>{key}</strong>: {formatValue(key, value)}</p>)}</div>)}</div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return <div className="metric-card"><div>{icon}</div><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>;
}

