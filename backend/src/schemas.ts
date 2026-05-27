import { z } from 'zod';

export const paymentIntentInputSchema = z.object({
  merchantName: z.string().min(3),
  category: z.string().min(3),
  amount: z.number().positive().max(500000),
  decision: z.enum(['NO_FRICTION', 'SOFT_NUDGE', 'DELAY', 'ASK_REASON', 'BUDGET_OVERRIDE', 'BLOCK']),
  impulseScore: z.number().min(0).max(100)
});

export const spendRuleInputSchema = z.object({
  name: z.string().min(3),
  category: z.string().min(3),
  thresholdAmount: z.number().positive().max(500000),
  maxWeeklyCount: z.number().int().nonnegative(),
  friction: z.string().min(3),
  active: z.boolean()
});

export const spendBrakeInputSchema = z.object({
  amount: z.number().positive().max(500000),
  category: z.string().min(3),
  hour: z.number().int().min(0).max(23),
  weeklyCategoryCount: z.number().int().nonnegative(),
  monthlyBudgetUsed: z.number().min(0).max(1.5),
  selfControlRuleHit: z.boolean(),
  upiLite: z.boolean(),
  emotionalRisk: z.number().min(0).max(1)
});

export type SpendBrakeInput = z.infer<typeof spendBrakeInputSchema>;

