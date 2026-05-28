export type MockScenario = 'HAPPY_PATH' | 'DEGRADED_BANK' | 'BANK_TIMEOUT' | 'RISK_HOLD' | 'STEP_UP';

export type WorkflowTab = {
  id: string;
  label: string;
  description: string;
  cta: string;
  drillDown: string;
  apiFlow: string;
  mockScenario: MockScenario;
};

export const workflowTabs: WorkflowTab[] = [
  {
    "id": "overview",
    "label": "Spend Brake",
    "description": "Real-time pre-payment friction for intentional spending.",
    "cta": "Open Wellness Console",
    "drillDown": "View budget, impulse, and friction metrics.",
    "apiFlow": "GET /metrics -> spend safety KPIs",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "intents",
    "label": "Payment Intents",
    "description": "UPI payment intents before approval and friction decisions.",
    "cta": "Create Payment Intent",
    "drillDown": "Open intent drill-down and action.",
    "apiFlow": "CRUD /payment-intents",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "rules",
    "label": "Spend Rules",
    "description": "User-owned self-control rules and category thresholds.",
    "cta": "Review Spend Rule",
    "drillDown": "Inspect rule and friction setting.",
    "apiFlow": "CRUD /spend-rules",
    "mockScenario": "HAPPY_PATH"
  },
  {
    "id": "impulse",
    "label": "Impulse AI",
    "description": "Sequence risk, late-night drift, and habit-loop detection.",
    "cta": "Run Impulse Model",
    "drillDown": "Generate neutral user nudge.",
    "apiFlow": "POST /brake-decisions",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "lite",
    "label": "UPI Lite Leakage",
    "description": "Low-value micro-spend leakage and budget guardrails.",
    "cta": "Mock Lite Payment",
    "drillDown": "View response code, delay, and reason.",
    "apiFlow": "POST /mock-upi",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "outcomes",
    "label": "Outcome Simulator",
    "description": "Before/after spend and avoided impulse transaction view.",
    "cta": "Simulate Monthly Outcome",
    "drillDown": "Trace friction into savings estimate.",
    "apiFlow": "Model output + dashboard",
    "mockScenario": "HAPPY_PATH"
  }
];

export function getWorkflowTab(id: string) {
  return workflowTabs.find((tab) => tab.id === id) ?? workflowTabs[0];
}

export function buildMockUpiRequest(tab: WorkflowTab, amount: number) {
  return {
    txnId: 'TXN-' + tab.id.toUpperCase() + '-' + Date.now().toString(36).toUpperCase(),
    payerVpa: 'demo.payer@oksbi',
    payeeVpa: 'upicognitivespendbrake@upi',
    amount,
    flow: tab.id.includes('qr') ? 'UPI_QR' : tab.id.includes('lite') ? 'UPI_LITE' : 'UPI_INTENT',
    purpose: 'UPI Cognitive Spend Brake ' + tab.label + ' sandbox payment',
    riskScore: tab.mockScenario === 'RISK_HOLD' ? 88 : tab.mockScenario === 'STEP_UP' ? 66 : 24,
    scenario: tab.mockScenario
  };
}
