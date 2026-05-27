# Security

## Data Safety

No live UPI, bank, PSP, Aadhaar, PAN, mobile number, account number, customer receipt, or private user data is used.

## Controls Implemented

- Helmet for defensive HTTP headers.
- express-rate-limit for request throttling.
- Zod validation on write and decision endpoints.
- RBAC middleware on every API route.
- Admin-only destructive operations.
- CORS origin configurable through CORS_ORIGIN.
- No secrets committed.
- Dependency audit script: npm run audit:high.

## Prototype Boundary

The x-user-role header is a portfolio RBAC simulator. Production would use OIDC, signed JWTs, tenant isolation, immutable audit logs, and KMS-backed secrets.

