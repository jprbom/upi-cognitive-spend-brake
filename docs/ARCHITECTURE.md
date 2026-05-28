# Architecture

UPI Cognitive Spend Brake uses a split React and Express architecture with a public-safe payment ecosystem simulator for user-owned responsible-spending workflows.

## Components

- React dashboard: RBAC role switcher, KPI cards, command panels, tables, CRUD actions, guardrail review, and Payment Ecosystem Timeline.
- Express API: health, metrics, CRUD, spend-brake decisioning, signed demo auth, payment lifecycle, webhooks, refund, dispute, and reconciliation endpoints.
- RBAC middleware: signed local demo bearer tokens and role-to-permission mapping.
- JSON persistence: deterministic synthetic DB file for local demos.
- Domain engine: budget use, category frequency, late-night context, UPI Lite leakage, cooling-off, and nudge reason-code simulator.
- Payment ecosystem simulator: PG, PA, TPAP, PSP/bank, and NPCI-style rail adapters with spend-brake and UPI Lite hooks.
- AIML/DL artifacts: 10,000-row synthetic training harness with model card, metrics, and feature importance.

## Runtime Ports

- Backend: 4106
- Frontend dev server: 5176
- Frontend preview server: 5106

