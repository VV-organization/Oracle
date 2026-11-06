import type { Dashboard } from '../domain.ts';
import { normalizeContact } from './service.ts';
export type RegistrationDraft = { type: 'personal' | 'business'; name: string; contact: string; organization: string; registrationNumber: string };
export type RegisteredAccount = RegistrationDraft & { id: string; kyc: 'not-started'; kyb?: 'not-started' };
export type AccountSession = { kind: 'local-preview'; contact: string } | { kind: 'local-registered'; contact: string; account: RegisteredAccount };
export const emptyRegistration: RegistrationDraft = { type: 'personal', name: '', contact: '', organization: '', registrationNumber: '' };
export const accountKeys = { registry: 'oraclepay.auth-preview.accounts', draft: 'oraclepay.auth-preview.registration', drafts: 'oraclepay.auth-preview.profile-drafts', confirmation: 'oraclepay.auth-preview.contact-confirmation' };
export type LocalStorage = Pick<Storage, 'getItem' | 'setItem'> & Partial<Pick<Storage,'removeItem'>>;
export function validDraft(value: unknown): value is RegistrationDraft {
 if (!value || typeof value !== 'object') return false;
 const v = value as RegistrationDraft;
 return (v.type === 'personal' || v.type === 'business') && ['name','contact','organization','registrationNumber'].every(key => typeof v[key as keyof RegistrationDraft] === 'string' && v[key as keyof RegistrationDraft].length <= 254);
}
export function validAccount(value: unknown): value is RegisteredAccount {
 if (!validDraft(value)) return false;
 const v = value as RegisteredAccount;
 return Boolean(v.name.trim() && normalizeContact(v.contact) && typeof v.id === 'string' && v.id.startsWith('local-account-') && v.kyc === 'not-started' && (v.type === 'personal' || (v.organization.trim() && v.registrationNumber.trim() && v.kyb === 'not-started')));
}
export function readAccounts(storage?: Pick<Storage,'getItem'>): RegisteredAccount[] {
 try { const v: unknown = JSON.parse(storage?.getItem(accountKeys.registry) ?? '[]'); return Array.isArray(v) && v.every(validAccount) ? v : []; } catch { return []; }
}
export function readRegistrationDraft(storage: Pick<Storage,'getItem'>): RegistrationDraft {
 try { const v: unknown = JSON.parse(storage.getItem(accountKeys.draft) ?? 'null'); return validDraft(v) ? v : { ...emptyRegistration }; } catch { return { ...emptyRegistration }; }
}
export function moneyAllowed(session: AccountSession | null): boolean { return session?.kind !== 'local-registered'; }
export function dashboardForSession(fixture: Dashboard, session: AccountSession | null): Dashboard {
 if (session?.kind !== 'local-registered') return fixture;
 return { owner: session.account.name, accounts: fixture.accounts.map(a => ({ ...a, units: '0' })), operations: [] };
}
export function actionAllowed(session: AccountSession | null, action: string): boolean {
 return moneyAllowed(session) || ['home','history','help','settings','logout','receiving-details'].includes(action);
}
