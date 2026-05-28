# API Reference

Base URL: http://127.0.0.1:4106

Authentication model: signed local demo bearer tokens from `POST /api/auth/demo-token`. Raw `x-user-role` headers are ignored for authorization.

## Health

GET /api/health

## Metrics

GET /api/metrics

## Auth

POST /api/auth/demo-token

Returns a one-hour signed local demo bearer token for one of the documented RBAC roles.

## Payment Ecosystem Simulator

POST /api/payments/initiate
GET /api/payments/:id/status
POST /api/payments/:id/simulate-event
GET /api/payments/:id/timeline
GET /api/reconciliation/batches
POST /api/refunds/initiate
POST /api/disputes/raise
POST /api/webhooks/payment-gateway
POST /api/webhooks/payment-aggregator
POST /api/webhooks/tpap
POST /api/webhooks/npci

These endpoints simulate PG checkout, PA payment attempts, TPAP app authorization, PSP/bank outcomes, NPCI-style UPI rail states, HMAC webhooks, settlement, refunds, disputes, duplicate delivery, out-of-order webhook handling, and spend-brake / UPI Lite hooks.

## Domain Decision

POST /api/brake-decisions

## CRUD

GET/POST/PATCH/DELETE /api/payment-intents

GET/POST/PATCH/DELETE /api/spend-rules
