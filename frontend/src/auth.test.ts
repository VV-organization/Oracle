import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeContact, normalizeCode, createLocalAuthService, AuthError, remainingSeconds } from './auth/service.ts';
import { resolveAuthScreen, authUrl, readPreviewSession, readRecoveryReceipt, authStorageKeys } from './auth/routing.ts';

test('contact accepts email or international phone and rejects ambiguous input', () => {
  assert.equal(normalizeContact(' person@example.com '), 'person@example.com');
  assert.equal(normalizeContact('+7 (999) 123-45-67'), '+79991234567');
  for (const value of ['', 'abc', 'a@b', '123456', '+00000000000']) assert.equal(normalizeContact(value), null);
  assert.equal(normalizeCode('123 456'), '123456');
  assert.equal(normalizeCode('12345x'), null);
});
test('mock verifies a live challenge once and enforces expiry and resend deadline', async () => {
  let now = 1000;
  const service = createLocalAuthService({ now: () => now, delay: async () => {} });
  const challenge = await service.requestCode('person@example.com');
  assert.equal(remainingSeconds(challenge.retryAt, now), 30);
  await assert.rejects(service.resendCode(challenge), (e: unknown) => e instanceof AuthError && e.code === 'too-soon');
  await assert.rejects(service.verifyCode(challenge, '111111'), (e: unknown) => e instanceof AuthError && e.code === 'invalid-code');
  now += 30000;
  const renewed = await service.resendCode(challenge);
  await assert.rejects(service.verifyCode(challenge, '123456'), (e: unknown) => e instanceof AuthError && e.code === 'expired');
  assert.equal((await service.verifyCode(renewed, '123 456')).contact, 'person@example.com');
  await assert.rejects(service.verifyCode(renewed, '123456'));
  const expired = await service.requestCode('+79991234567');
  now += 300000;
  await assert.rejects(service.verifyCode(expired, '123456'), (e: unknown) => e instanceof AuthError && e.code === 'expired');
});
test('opt-in guard preserves direct review and rejects missing session/challenge', () => {
  assert.equal(resolveAuthScreen(null, false, false, false), 'home');
  assert.equal(resolveAuthScreen('home', true, false, false), 'login');
  assert.equal(resolveAuthScreen('home', true, true, false), 'home');
  assert.equal(resolveAuthScreen('home', true, true, false, false, true), 'register');
  assert.equal(resolveAuthScreen(null, true, true, false, false, true), 'register');
  assert.equal(resolveAuthScreen('code', true, false, false), 'login');
  assert.equal(resolveAuthScreen('code', true, false, true), 'code');
  const url = authUrl('https://example.com/?layout=columns&theme=orange&lang=en#keep', 'login');
  assert.equal(new URL(url).searchParams.get('theme'), 'orange');
  assert.equal(new URL(url).searchParams.get('lang'), 'en');
  assert.equal(new URL(url).searchParams.get('screen'), 'login');
  assert.equal(readPreviewSession({ getItem: key => key === authStorageKeys.session ? 'local-preview' : null }), false);
  assert.equal(readPreviewSession({ getItem: () => null }), false);
  assert.equal(readPreviewSession({ getItem: () => { throw new Error('blocked'); } }), false);
});
test('clearing a pending request prevents its stale challenge from completing', async () => {
  let finish!: () => void;
  const service = createLocalAuthService({ delay: () => new Promise<void>(resolve => { finish = resolve; }) });
  const request = service.requestCode('person@example.com');
  service.clear(); finish();
  await assert.rejects(request, (e: unknown) => e instanceof AuthError && e.code === 'expired');
});

test('recovery validates both contacts, cancels stale submissions, and never issues a session', async () => {
  const service = createLocalAuthService({ delay: async () => {} });
  await assert.rejects(service.requestRecovery('', ''), (e: unknown) => e instanceof AuthError && e.code === 'recovery-required');
  await assert.rejects(service.requestRecovery('person@example.com', '+79991234567'), (e: unknown) => e instanceof AuthError && e.code === 'invalid-reply');
  const challenge = await service.requestCode('person@example.com');
  const receipt = await service.requestRecovery('+7 (999) 123-45-67', ' reply@example.com ');
  assert.equal(receipt.contact, '+79991234567');
  assert.equal(receipt.replyEmail, 'reply@example.com');
  assert.equal(receipt.kind, 'local-recovery-request');
  await assert.rejects(service.verifyCode(challenge, '123456'));
});

test('recovery ignores duplicate submission and permits retry after adapter error', async () => {
  let finish!: () => void;
  let fail = true;
  const service = createLocalAuthService({ delay: () => fail ? Promise.reject(new Error('offline')) : new Promise<void>(resolve => { finish = resolve; }) });
  await assert.rejects(service.requestRecovery('person@example.com', 'reply@example.com'));
  fail = false;
  const request = service.requestRecovery('person@example.com', 'reply@example.com');
  await assert.rejects(service.requestRecovery('person@example.com', 'reply@example.com'), (e: unknown) => e instanceof AuthError && e.code === 'too-soon');
  service.clear(); finish();
  await assert.rejects(request, (e: unknown) => e instanceof AuthError && e.code === 'expired');
});

test('recovery result requires receipt and keeps session guard and URL context', () => {
  assert.equal(resolveAuthScreen('recovery', true, false, false), 'recovery');
  assert.equal(resolveAuthScreen('recovery-result', true, false, false), 'recovery');
  assert.equal(resolveAuthScreen('recovery-result', true, false, false, true), 'recovery-result');
  assert.equal(resolveAuthScreen('home', true, false, false, true), 'login');
  const url = new URL(authUrl('https://example.com/?theme=orange&lang=en', 'recovery'));
  assert.equal(url.searchParams.get('theme'), 'orange');
  assert.equal(url.searchParams.get('lang'), 'en');
});

test('only a valid per-tab local recovery receipt restores the request result', () => {
  const receipt = { id: 'local-recovery-1', kind: 'local-recovery-request', contact: 'person@example.com', replyEmail: 'reply@example.com' };
  assert.deepEqual(readRecoveryReceipt({ getItem: key => key === authStorageKeys.recovery ? JSON.stringify(receipt) : null }), receipt);
  for (const value of [null, '', '{', JSON.stringify({ ...receipt, replyEmail: '+79991234567' }), JSON.stringify({ ...receipt, kind: 'local-preview' }), JSON.stringify({ ...receipt, contact: 'invalid' })]) {
    assert.equal(readRecoveryReceipt({ getItem: () => value }), null);
  }
  assert.equal(readRecoveryReceipt({ getItem: () => { throw new Error('blocked'); } }), null);
});

test('starting recovery cancels an in-flight OTP verification rather than authenticating', async () => {
  const completions: (() => void)[] = [];
  const service = createLocalAuthService({ delay: () => new Promise<void>(resolve => completions.push(resolve)) });
  const issued = service.requestCode('person@example.com'); completions.shift()!();
  const challenge = await issued;
  const verification = service.verifyCode(challenge, '123456');
  const recovery = service.requestRecovery('person@example.com', 'reply@example.com');
  completions.shift()!(); completions.shift()!();
  await assert.rejects(verification, (e: unknown) => e instanceof AuthError && e.code === 'expired');
  assert.equal((await recovery).kind, 'local-recovery-request');
});
