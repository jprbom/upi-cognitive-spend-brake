import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createTestDatabase } from '../src/db.js';

describe('UPI Cognitive Spend Brake API', () => {
  it('returns an explainable domain decision', async () => {
    const app = createApp(createTestDatabase());
    const response = await request(app)
      .post('/api/brake-decisions')
      .set('x-user-role', 'WELLNESS_COACH')
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
    const created = await request(app)
      .post('/api/payment-intents')
      .set('x-user-role', 'WELLNESS_COACH')
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
      .set('x-user-role', 'WELLNESS_COACH');
    expect(denied.status).toBe(403);

    const deleted = await request(app)
      .delete('/api/payment-intents/' + created.body.id)
      .set('x-user-role', 'ADMIN');
    expect(deleted.status).toBe(204);
  });
});

