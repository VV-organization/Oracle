import { browserStorage } from './storage.ts';
import { accountKeys, emptyRegistration, validAccount, validDraft, type RegistrationDraft, type RegisteredAccount, type AccountSession, type LocalStorage } from './account.ts';
export type AuthErrorCode = 'invalid-contact' | 'invalid-code' | 'expired' | 'too-soon' | 'unavailable' | 'recovery-required' | 'invalid-reply' | 'registration-required' | 'duplicate-contact';
export class AuthError extends Error {
  readonly code: AuthErrorCode;
  constructor(code: AuthErrorCode) { super(code); this.code = code; }
}
export type AuthChallenge = { id: string; contact: string; retryAt: number; expiresAt: number };
export type OnboardingConfirmation = { kind: 'local-onboarding'; id: string; contact: string; verifiedAt: number; expiresAt: number };
export type RegisteredSession = Extract<AccountSession, { kind: 'local-registered' }>;
export type AuthSession = RegisteredSession | OnboardingConfirmation;
export type RecoveryReceipt = { id: string; contact: string; replyEmail: string; kind: 'local-recovery-request' };
export interface AuthService {
  requestRecovery(contact: string, replyEmail: string): Promise<RecoveryReceipt>;
  requestCode(contact: string): Promise<AuthChallenge>;
  resendCode(challenge: AuthChallenge): Promise<AuthChallenge>;
  verifyCode(challenge: AuthChallenge, code: string): Promise<AuthSession>;
  resumeOnboarding(): OnboardingConfirmation | null;
  readProfileDraft(): RegistrationDraft;
  saveProfileDraft(draft: RegistrationDraft): void;
  completeRegistration(draft: RegistrationDraft): Promise<RegisteredSession>;
  cancelPending(): void;
  clear(): boolean;
}
export function normalizeContact(raw: string): string | null {
  const value = raw.trim();
  if (/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value) && value.length <= 254) return value;
  if (!/^\+[\d\s()-]+$/.test(value)) return null;
  const phone = value.replace(/[\s()-]/g, '');
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}
export function normalizeCode(raw: string): string | null {
  const value = raw.replace(/\s/g, '');
  return /^\d{6}$/.test(value) ? value : null;
}
export function remainingSeconds(deadline: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
const identity = (contact: string) => contact.toLowerCase();
const confirmationLifetime = 300000; // Local QA fixture, not server policy.
function memoryStorage(): LocalStorage { const values = new Map<string,string>(); return { getItem: key => values.get(key) ?? null, setItem: (key,value) => { values.set(key,value); } }; }
/** Local simulation only. Browser data is user-editable and is not a server authentication boundary.
 * OTP challenges stay in memory. A separate expiring per-tab confirmation resumes profile setup;
 * ordinary saved form data can never serve as contact confirmation. */
export function createLocalAuthService({ now = Date.now, delay = () => new Promise<void>(resolve => setTimeout(resolve, 400)), storage = browserStorage('localStorage') ?? memoryStorage(), confirmationStorage = browserStorage('sessionStorage') ?? memoryStorage() } = {} as { now?: () => number; delay?: () => Promise<void>; storage?: LocalStorage; confirmationStorage?: LocalStorage }): AuthService {
  let active: AuthChallenge | null = null;
  let sequence = 0;
  let generation = 0;
  let recoveryPending = false;
  let requestPending = false;
  let verificationPending = false;
  let profilePending = false;
  let confirmationBlocked = false;
  function write(target: LocalStorage, key: string, value: unknown) {
    try { target.setItem(key, JSON.stringify(value)); } catch { throw new AuthError('unavailable'); }
  }
  function loadAccounts(): RegisteredAccount[] {
    try {
      const raw: unknown = JSON.parse(storage.getItem(accountKeys.registry) ?? '[]');
      if (!Array.isArray(raw) || !raw.every(validAccount)) throw new Error('corrupt registry');
      return raw;
    } catch { throw new AuthError('unavailable'); }
  }
  function invalidateConfirmation() {
    confirmationBlocked = true;
    try { write(confirmationStorage, accountKeys.confirmation, null); } catch {
      try {
        if (!confirmationStorage.removeItem) throw new Error('removal unavailable');
        confirmationStorage.removeItem(accountKeys.confirmation);
      } catch { throw new AuthError('unavailable'); }
    }
    confirmationBlocked = false;
  }
  function resumeOnboarding(): OnboardingConfirmation | null {
    if (confirmationBlocked) return null;
    try {
      const v = JSON.parse(confirmationStorage.getItem(accountKeys.confirmation) ?? 'null');
      if (!v) return null;
      if (v.kind !== 'local-onboarding' || typeof v.id !== 'string' || !/^local-confirmation-[\w-]+$/.test(v.id) || typeof v.contact !== 'string' || !normalizeContact(v.contact) || !Number.isFinite(v.verifiedAt) || !Number.isFinite(v.expiresAt) || v.verifiedAt > now() || v.expiresAt !== v.verifiedAt + confirmationLifetime || now() >= v.expiresAt) {
        invalidateConfirmation(); return null;
      }
      return v;
    } catch { throw new AuthError('unavailable'); }
  }
  function requireConfirmation(contact?: string): OnboardingConfirmation {
    const confirmation = resumeOnboarding();
    if (!confirmation || (contact !== undefined && identity(confirmation.contact) !== identity(normalizeContact(contact) ?? ''))) throw new AuthError('expired');
    return confirmation;
  }
  function drafts(): Record<string,RegistrationDraft> {
    let raw: string | null;
    try { raw = confirmationStorage.getItem(accountKeys.drafts); } catch { throw new AuthError('unavailable'); }
    // Form data has no authority. Corruption may discard a draft, never confirm a contact.
    try {
      const value = JSON.parse(raw ?? '{}');
      if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
      const result: Record<string,RegistrationDraft> = {};
      for (const [key,v] of Object.entries(value)) if (validDraft(v) && identity(v.contact) === key) result[key] = v;
      return result;
    } catch { return {}; }
  }
  function saveProfileDraft(draft: RegistrationDraft) {
    const confirmation = requireConfirmation(draft.contact);
    if (!validDraft(draft)) throw new AuthError('registration-required');
    const next = drafts(); next[identity(confirmation.contact)] = { ...draft, contact: confirmation.contact };
    write(confirmationStorage, accountKeys.drafts, next);
  }
  function cancelCurrent() {
    active = null; generation++; requestPending = false; verificationPending = false; profilePending = false; recoveryPending = false;
  }
  const issue = (contact: string): AuthChallenge => {
    active = { id: `local-${crypto.randomUUID()}`, contact, retryAt: now() + 30000, expiresAt: now() + 300000 };
    return { ...active };
  };
  return {
    cancelPending: cancelCurrent,
    resumeOnboarding,
    readProfileDraft() {
      const confirmation = requireConfirmation();
      return { ...(drafts()[identity(confirmation.contact)] ?? emptyRegistration), contact: confirmation.contact };
    },
    saveProfileDraft,
    async completeRegistration(draft) {
      if (profilePending) throw new AuthError('too-soon');
      const confirmation = requireConfirmation(draft.contact);
      if (!validDraft(draft) || !draft.name.trim() || (draft.type === 'business' && (!draft.organization.trim() || !draft.registrationNumber.trim()))) throw new AuthError('registration-required');
      saveProfileDraft(draft); // Essential persistence must work before creating an account.
      const requestGeneration = generation;
      profilePending = true;
      try {
        await delay();
        if (requestGeneration !== generation || requireConfirmation(draft.contact).id !== confirmation.id) throw new AuthError('expired');
        const accounts = loadAccounts();
        if (accounts.some(a => identity(a.contact) === identity(confirmation.contact))) throw new AuthError('duplicate-contact');
        const account: RegisteredAccount = { ...draft, name: draft.name.trim(), contact: confirmation.contact, organization: draft.organization.trim(), registrationNumber: draft.registrationNumber.trim(), id: `local-account-${crypto.randomUUID()}`, kyc: 'not-started', ...(draft.type === 'business' ? { kyb: 'not-started' as const } : {}) };
        write(storage, accountKeys.registry, [...accounts, account]);
        // If invalidation fails, no session is returned. Retrying the same contact uses the
        // persisted account through OTP rather than replacing its owner or creating a duplicate.
        invalidateConfirmation();
        const next = drafts(); delete next[identity(account.contact)]; write(confirmationStorage, accountKeys.drafts, next);
        profilePending = false; generation++;
        return { kind: 'local-registered', contact: account.contact, account };
      } finally { if (requestGeneration === generation) profilePending = false; }
    },
    async requestRecovery(raw, rawReply) {
      if (recoveryPending) throw new AuthError('too-soon');
      if (!raw.trim() || !rawReply.trim()) throw new AuthError('recovery-required');
      const contact = normalizeContact(raw);
      if (!contact) throw new AuthError('invalid-contact');
      const replyEmail = normalizeContact(rawReply);
      if (!replyEmail || !replyEmail.includes('@')) throw new AuthError('invalid-reply');
      cancelCurrent(); invalidateConfirmation();
      const requestGeneration = generation;
      recoveryPending = true;
      try {
        await delay();
        if (requestGeneration !== generation) throw new AuthError('expired');
        return { id: `local-recovery-${++sequence}`, contact, replyEmail, kind: 'local-recovery-request' };
      } finally { if (requestGeneration === generation) recoveryPending = false; }
    },
    async requestCode(raw) {
      if (requestPending) throw new AuthError('too-soon');
      const contact = normalizeContact(raw);
      if (!contact) throw new AuthError('invalid-contact');
      cancelCurrent(); invalidateConfirmation();
      const requestGeneration = generation;
      requestPending = true;
      try {
        await delay();
        if (requestGeneration !== generation) throw new AuthError('expired');
        return issue(contact);
      } finally { if (requestGeneration === generation) requestPending = false; }
    },
    async resendCode(challenge) {
      if (!active || active.id !== challenge.id) throw new AuthError('expired');
      if (now() < active.retryAt || requestPending) throw new AuthError('too-soon');
      const contact = active.contact;
      const requestGeneration = ++generation;
      requestPending = true;
      try {
        await delay();
        if (requestGeneration !== generation) throw new AuthError('expired');
        return issue(contact);
      } finally { if (requestGeneration === generation) requestPending = false; }
    },
    async verifyCode(challenge, raw) {
      if (verificationPending) throw new AuthError('too-soon');
      const requestGeneration = generation;
      verificationPending = true;
      try {
        await delay();
        if (requestGeneration !== generation || !active || active.id !== challenge.id || now() >= active.expiresAt) throw new AuthError('expired');
        if (normalizeCode(raw) !== '123456') throw new AuthError('invalid-code');
        const contact = active.contact; // The caller cannot substitute a different contact.
        const account = loadAccounts().find(a => identity(a.contact) === identity(contact));
        let result: AuthSession;
        if (account) result = { kind: 'local-registered', contact: account.contact, account };
        else {
          const verifiedAt = now();
          result = { kind: 'local-onboarding', id: `local-confirmation-${crypto.randomUUID()}`, contact, verifiedAt, expiresAt: verifiedAt + confirmationLifetime };
          write(confirmationStorage, accountKeys.confirmation, result);
          confirmationBlocked = false;
        }
        active = null;
        generation++;
        return result;
      } finally { verificationPending = false; }
    },
    clear() {
      cancelCurrent();
      try { invalidateConfirmation(); return true; } catch { return false; }
    },
  };
}
