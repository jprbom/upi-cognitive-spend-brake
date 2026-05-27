import { describe, expect, it } from 'vitest';
import { formatValue, toneForRisk } from './viewModel';

describe('view model helpers', () => {
  it('formats rupee-like fields and booleans', () => {
    expect(formatValue('amount', 4999)).toContain('4,999');
    expect(formatValue('active', true)).toBe('Yes');
  });

  it('maps risk tones', () => {
    expect(toneForRisk(90)).toBe('critical');
    expect(toneForRisk(60)).toBe('warning');
    expect(toneForRisk(20)).toBe('healthy');
  });
});

