export function formatValue(key: string, value: unknown) {
  if (typeof value === 'number' && /amount|limit|inflow|outflow|threshold/i.test(key)) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  }
  if (typeof value === 'number') return value.toLocaleString('en-IN');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value ?? '');
}

export function toneForRisk(value: number) {
  if (value >= 75) return 'critical';
  if (value >= 45) return 'warning';
  return 'healthy';
}

