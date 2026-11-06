import { test } from 'node:test';
import assert from 'node:assert/strict';
import { operationPresentation } from './domain.ts';
import { dashboardFixture } from './fixtures.ts';

test('only settled movements receive a sign; only credited income is green', () => {
  const pending = dashboardFixture.operations.find(op => op.id === 'OP-CR-IN-002')!;
  assert.deepEqual(operationPresentation(pending), {
    incoming: true, sign: '', amountTone: 'neutral', statusLabel: 'pending',
  });
  for (const kind of ['receiving', 'funding', 'transfer'] as const) {
    for (const status of ['pending', 'unknown', 'failed', 'completed'] as const) {
      const display = operationPresentation({ kind, status, currency: 'USDC' });
      assert.equal(display.sign, status !== 'completed' ? '' : kind === 'transfer' ? '−' : '+');
      assert.equal(display.amountTone, status === 'completed' && kind !== 'transfer' ? 'credit' : 'neutral');
      if (status !== 'completed') assert.equal(display.statusLabel, status);
    }
  }
});

test('bank processing does not claim blockchain confirmation', () => {
  assert.equal(operationPresentation({ kind: 'transfer', status: 'pending', currency: 'EUR' }).statusLabel, 'processing');
  assert.equal(operationPresentation({ kind: 'transfer', status: 'unknown', currency: 'EUR' }).statusLabel, 'unknown');
});
