# Prototype Audit Response

## Latest Audit Closure

The latest implementation adds signed demo-token RBAC, a five-adapter payment ecosystem simulator, HMAC webhook signing, duplicate and out-of-order webhook handling, refund/dispute/reconciliation APIs, a frontend Payment Ecosystem Timeline, 10,000-row synthetic AIML/DL artifacts, and expanded enterprise documentation.

## Honest Status

UPI Cognitive Spend Brake is a runnable portfolio-grade prototype, not a production personal-finance intervention or regulated payment-blocking system. It demonstrates opt-in spend-friction decisioning, synthetic CRUD workflows, RBAC simulation, a mocked UPI/NPCI response, tests, CI, Docker packaging, and SDLC documentation.

It should be presented as: **a responsible digital-spending prototype with user-owned guardrails and synthetic UPI intents.**

It should not be presented as: **a real behavioural-health model, payment blocker, or production bank/PSP spending-control system.**

## What Is Real Today

- React dashboard with working tabs, CTAs, drill-downs, CRUD, and RBAC role selection.
- Express API with Zod validation, Helmet, rate limiting, CORS, and permission middleware.
- Domain endpoint for impulse-risk and friction decisions with reason codes and non-judgmental explanation.
- Mock NPCI/UPI rail returning RRN, UPI request id, bank reference, response code, settlement state, risk decision, reason codes, and callback metadata.
- Local JSON persistence for demo review.
- Backend tests, frontend helper tests, local browser E2E smoke script, Docker files, and CI verify workflow.
- Python ML/DL training demonstration that creates a model-card artifact from synthetic data.

## Prototype Boundaries

- RBAC remains a simulator, but it now uses signed local demo bearer tokens and ignores forged `x-user-role`; production would still require OIDC/JWT, signed sessions, tenant isolation, KMS-backed secrets, and immutable audit logs.
- Current spend-brake logic is rule/scoring based; it is not a clinically validated behavioural model and should not be framed as mental-health advice.
- The ML script now generates 10,000 synthetic rows with train/test metrics, confusion matrix, model card, and feature importance. It remains synthetic and not statistically valid production behavioural-finance or intervention model training.
- Persistence is JSON file storage, not a private local rule vault, encrypted personal finance store, or consent ledger.
- The payment ecosystem simulator is fully mocked and does not connect to PSPs, banks, UPI Lite wallets, or real payment authorization flows.

## Serious Upgrade Path

- Add user-defined guardrails for category, time, amount, cooling period, frequency, and essential-category exceptions.
- Add override flow with reason capture, private-mode local rules, and user-owned deletion/export.
- Add UPI Lite leakage simulator, monthly budget memory, merchant/category trends, and essential-spend safety guardrails.
- Add scenario tests for normal low-friction spend, late-night delivery, salary-day spike, repeated micro-spend, and emergency exceptions.
- Add UX guardrails so the product is autonomy-preserving and never paternalistic.
