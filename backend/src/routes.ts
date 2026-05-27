import type { Express } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { requirePermission } from './auth.js';
import type { JsonDatabase } from './db.js';
import { evaluateSpendBrake } from './engine.js';
import { paymentIntentInputSchema, spendRuleInputSchema, spendBrakeInputSchema } from './schemas.js';

const collections = [
  { route: 'payment-intents', key: 'paymentIntents', schema: paymentIntentInputSchema, prefix: 'payme_' },
  { route: 'spend-rules', key: 'spendRules', schema: spendRuleInputSchema, prefix: 'spend_' }
] as const;

const nonEmptyPatch = (schema: z.ZodObject<any>) =>
  schema.partial().refine((value) => Object.keys(value).length > 0, 'Patch must contain at least one field.');

export function registerRoutes(app: Express, db: JsonDatabase) {
  app.get('/api/metrics', requirePermission('read'), async (_req, res, next) => {
    try {
      const primary = await db.list('paymentIntents');
      const secondary = await db.list('spendRules');
      const totalAmount = primary.reduce((sum, item) => sum + Number(item.amount || item.maxAmount || item.thresholdAmount || 0), 0);
      const averageRisk = Math.round(primary.reduce((sum, item) => sum + Number(item.riskScore || item.impulseScore || 0), 0) / Math.max(primary.length, 1));
      res.json({
        kpis: {
          primaryRecords: primary.length,
          secondaryRecords: secondary.length,
          totalAmount,
          averageRisk
        },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  for (const collection of collections) {
    app.get('/api/' + collection.route, requirePermission('read'), async (_req, res, next) => {
      try { res.json(await db.list(collection.key)); } catch (error) { next(error); }
    });

    app.post('/api/' + collection.route, requirePermission('write'), async (req, res, next) => {
      try {
        const body = collection.schema.parse(req.body);
        const item = { id: collection.prefix + randomUUID(), createdAt: new Date().toISOString(), ...body };
        res.status(201).json(await db.create(collection.key, item));
      } catch (error) { next(error); }
    });

    app.patch('/api/' + collection.route + '/:id', requirePermission('write'), async (req, res, next) => {
      try {
        const patch = nonEmptyPatch(collection.schema).parse(req.body);
        res.json(await db.update(collection.key, String(req.params.id), patch));
      } catch (error) { next(error); }
    });

    app.delete('/api/' + collection.route + '/:id', requirePermission('admin'), async (req, res, next) => {
      try {
        await db.delete(collection.key, String(req.params.id));
        res.status(204).send();
      } catch (error) { next(error); }
    });
  }

  app.post('/api/brake-decisions', requirePermission('read'), (req, res, next) => {
    try {
      res.json(evaluateSpendBrake(spendBrakeInputSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  });
}


