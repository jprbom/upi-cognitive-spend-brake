import type { SpendBrakeInput } from './schemas.js';

export function evaluateSpendBrake(input: SpendBrakeInput) {
  let impulseScore = 0;
  const reasonCodes: string[] = [];
  impulseScore += input.emotionalRisk * 26;
  impulseScore += Math.min(input.weeklyCategoryCount, 8) * 5;
  impulseScore += input.monthlyBudgetUsed * 22;
  if (input.selfControlRuleHit) { impulseScore += 22; reasonCodes.push('SELF_CONTROL_RULE_HIT'); }
  if (input.hour >= 23 || input.hour < 5) { impulseScore += 10; reasonCodes.push('LATE_NIGHT_PAYMENT'); }
  if (input.upiLite && input.amount < 500) { impulseScore += 8; reasonCodes.push('UPI_LITE_MICRO_SPEND_LEAKAGE'); }
  if (input.monthlyBudgetUsed > 0.8) reasonCodes.push('BUDGET_NEAR_LIMIT');
  if (input.weeklyCategoryCount > 2) reasonCodes.push('CATEGORY_STREAK');
  const finalImpulseScore = Math.round(Math.min(100, impulseScore));
  const decision = finalImpulseScore >= 85 ? 'BLOCK' : finalImpulseScore >= 70 ? 'BUDGET_OVERRIDE' : finalImpulseScore >= 55 ? 'DELAY' : finalImpulseScore >= 35 ? 'SOFT_NUDGE' : 'NO_FRICTION';
  return {
    decision,
    impulseScore: finalImpulseScore,
    reasonCodes,
    explanation: 'Spend brake decision ' + decision + ' based on budget usage, category streak, time of day, self-control rules, UPI Lite leakage, and emotional-risk indicators.'
  };
}
