import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { signDemoToken, type Role } from '../src/auth.js';
import { createTestDatabase } from '../src/db.js';

const bearer = (role: Role) => 'Bearer ' + signDemoToken(role);

describe('UPI Cognitive Spend Brake API', () => {
  it('returns an explainable domain decision', async () => {
    const app = createApp(createTestDatabase());
    const response = await request(app)
      .post('/api/brake-decisions')
      .set('Authorization', bearer('WELLNESS_COACH'))
      .send({
  "amount": 620,
  "category": "FOOD_DELIVERY",
  "hour": 0,
  "weeklyCategoryCount": 3,
  "monthlyBudgetUsed": 0.83,
  "selfControlRuleHit": true,
  "upiLite": false,
  "emotionalRisk": 0.62
});

    expect(response.status).toBe(200);
    expect(response.body.reasonCodes.length).toBeGreaterThan(0);
    expect(typeof response.body.explanation).toBe('string');
  });

  it('supports CRUD and protects delete through admin RBAC', async () => {
    const app = createApp(createTestDatabase());
    const forgedRole = await request(app)
      .post('/api/payment-intents')
      .set('x-user-role', 'UNKNOWN_ADMIN')
      .send({
  "merchantName": "Forged Role Merchant",
  "category": "SHOPPING",
  "amount": 1200,
  "decision": "SOFT_NUDGE",
  "impulseScore": 52
});

    expect(forgedRole.status).toBe(403);
    expect(forgedRole.body.role).toBe('VIEWER');

    const created = await request(app)
      .post('/api/payment-intents')
      .set('Authorization', bearer('WELLNESS_COACH'))
      .send({
  "merchantName": "Late Night Eats",
  "category": "FOOD_DELIVERY",
  "amount": 620,
  "decision": "DELAY",
  "impulseScore": 74
});

    expect(created.status).toBe(201);
    expect(created.body.id).toBeTruthy();

    const denied = await request(app)
      .delete('/api/payment-intents/' + created.body.id)
      .set('Authorization', bearer('WELLNESS_COACH'));
    expect(denied.status).toBe(403);

    const deleted = await request(app)
      .delete('/api/payment-intents/' + created.body.id)
      .set('Authorization', bearer('ADMIN'));
    expect(deleted.status).toBe(204);
  });

  it('returns NPCI-style mock UPI rail response for end-to-end demo flows', async () => {
    const app = createApp(createTestDatabase());
    const response = await request(app)
      .post('/api/mock-upi')
      .set('Authorization', bearer('WELLNESS_COACH'))
      .send({
        txnId: 'TXN-DEMO-001',
        payerVpa: 'payer@oksbi',
        payeeVpa: 'merchant@upi',
        amount: 499,
        flow: 'UPI_INTENT',
        purpose: 'portfolio test flow',
        riskScore: 24,
        scenario: 'HAPPY_PATH'
      });

    expect(response.status).toBe(200);
    expect(response.body.gateway).toBe('NPCI_UPI_MOCK');
    expect(response.body.txnId).toBe('TXN-DEMO-001');
    expect(response.body.rrn).toMatch(/^RRN/);
    expect(response.body.risk.reasonCodes).toContain('SYNTHETIC_NPCI_SANDBOX');
    expect(response.body.settlement).toHaveProperty('preSettlementHold');
  });

});
