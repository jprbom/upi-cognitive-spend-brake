<p align="center">
  <img src="frontend/public/logo.svg" width="96" alt="UPI Cognitive Spend Brake logo">
</p>

# UPI Cognitive Spend Brake

AI friction layer for responsible digital spending before simulated UPI payment approval.

Author: Prashant Jagtap <jprbom@gmail.com>

## Portfolio Positioning

A behavioral AI system that detects impulse risk, UPI Lite micro-spend leakage, late-night drift, category overuse, and self-control rule violations, then adds only the minimum useful payment friction.

All payment, receipt, merchant, policy, and behavioral records are synthetic. The app does not connect to NPCI, banks, PSPs, UPI rails, account aggregators, or real user accounts.

## Highlights

- TypeScript Express backend with RBAC, Helmet, CORS controls, rate limiting, Zod validation, and JSON persistence.
- React and Vite frontend with role-aware operations dashboard, animated KPI panels, CRUD controls, and explanation surface.
- Domain endpoint at /api/brake-decisions.
- CRUD for Payment Intent Simulator and Spend Brake Rules.
- Mermaid diagrams for architecture, DFD, deployment, integration, API flow, and RBAC.

## Run Locally

~~~bash
npm install
npm run dev:backend
npm run dev:frontend
~~~

Backend: http://127.0.0.1:4106

Frontend: http://127.0.0.1:5176

## Verify

~~~bash
npm run build
npm run test
npm run audit:high
~~~

## Repo Name

upi-cognitive-spend-brake

