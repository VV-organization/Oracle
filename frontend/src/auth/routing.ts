import { validAccount, readAccounts, type AccountSession } from './account.ts';
import { normalizeContact, type RecoveryReceipt } from './service.ts';
export type AuthScreen = 'login' | 'code' | 'home' | 'recovery' | 'recovery-result' | 'register';
export const authStorageKeys = { enabled: 'oraclepay.auth-preview.enabled', session: 'oraclepay.auth-preview.session', recovery: 'oraclepay.auth-preview.recovery' } as const;
export function resolveAuthScreen(requested: string | null, enabled: boolean, session: boolean, challenge: boolean, recovery = false, onboarding = false): AuthScreen {
  if (!enabled) return 'home';
  if (requested === 'register') return onboarding ? 'register' : 'login';
  if (requested === 'recovery-result') return recovery ? 'recovery-result' : 'recovery';
  if (requested === 'recovery') return 'recovery';
  if (requested === 'code') return challenge ? 'code' : onboarding ? 'register' : 'login';
  if (requested === 'login') return 'login';
  return onboarding ? 'register' : session ? 'home' : 'login';
}
export function authUrl(href: string, screen: AuthScreen): string {
  const url = new URL(href);
  url.searchParams.set('screen', screen);
  return url.href;
}
export function readAccountSession(storage: Pick<Storage, 'getItem'>, registry?: Pick<Storage,'getItem'>): AccountSession | null {
 try {
  const raw = storage.getItem(authStorageKeys.session);
  if (raw === 'local-preview') return null;
  const value = JSON.parse(raw ?? 'null');
  if (value?.kind === 'local-preview') return null;
  if (value?.kind === 'local-registered' && validAccount(value.account)) {
   const account = readAccounts(registry).find(a => a.id === value.account.id && a.contact === value.account.contact);
   return account ? { kind: 'local-registered', contact: account.contact, account } : null;
  }
  return null;
 } catch { return null; }
}
export function readPreviewSession(storage: Pick<Storage, 'getItem'>): boolean { return Boolean(readAccountSession(storage)); }

/** A per-tab local receipt preserves only the request outcome; it never grants access. */
export function readRecoveryReceipt(storage: Pick<Storage, 'getItem'>): RecoveryReceipt | null {
  try {
    const value = JSON.parse(storage.getItem(authStorageKeys.recovery) ?? 'null');
    if (!value || value.kind !== 'local-recovery-request' || typeof value.id !== 'string' || !value.id.startsWith('local-recovery-') || typeof value.contact !== 'string' || typeof value.replyEmail !== 'string') return null;
    if (!normalizeContact(value.contact) || !value.replyEmail.includes('@') || !normalizeContact(value.replyEmail)) return null;
    return { id: value.id, contact: value.contact, replyEmail: value.replyEmail, kind: value.kind };
  } catch { return null; }
}
