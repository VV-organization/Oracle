import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterOperations, formatAmount, toggleAccount } from './domain.ts';
import { dashboardFixture } from './fixtures.ts';
test('account selection toggles and switches without mutating balances', () => {
  const before = JSON.stringify(dashboardFixture);
  assert.equal(toggleAccount(null, 'CHF'), 'CHF');
  assert.equal(toggleAccount('CHF', 'CHF'), null);
  assert.equal(toggleAccount('CHF', 'EUR'), 'EUR');
  assert.deepEqual(filterOperations(dashboardFixture.operations, 'CHF'), []);
  assert.equal(filterOperations(dashboardFixture.operations, 'EUR').length, 4);
  assert.equal(filterOperations(dashboardFixture.operations, 'USDC').length, 4);
  assert.equal(filterOperations(dashboardFixture.operations, null).length, 20);
  assert.equal(JSON.stringify(dashboardFixture), before);
});
test('exact decimal rendering preserves all cryptocurrency digits and zero', () => {
  assert.equal(formatAmount('3115971', 8, 'BTC'), '0,03115971 BTC');
  assert.equal(formatAmount('1245000', 2, 'EUR'), '12 450,00 EUR');
  assert.equal(formatAmount('0', 2, 'CHF'), '0,00 CHF');
  assert.equal(formatAmount('1393529', 2, 'USD', 'en'), '13,935.29 USD');
});
