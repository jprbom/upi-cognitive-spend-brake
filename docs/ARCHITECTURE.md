# Architecture

UPI Cognitive Spend Brake uses React for the dashboard and Express for API services. The API enforces RBAC, validates requests, persists synthetic data in JSON, and calls a pure TypeScript domain engine.

## Runtime Ports

- Backend: 4106
- Frontend dev server: 5176
- Frontend preview server: 5106

