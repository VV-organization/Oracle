import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from '../components/Icon';
import type { Locale } from '../locales';
import { authCopy } from './copy';
import { AuthError, createLocalAuthService, normalizeCode, normalizeContact, remainingSeconds, type AuthChallenge, type AuthErrorCode, type OnboardingConfirmation, type RegisteredSession } from './service';
import { authStorageKeys, authUrl, readAccountSession, readRecoveryReceipt, resolveAuthScreen, type AuthScreen } from './routing';
import { emptyRegistration, type AccountSession, type RegistrationDraft } from './account';
import { browserStorage, setStoredValue } from './storage';
import './auth.css';
const sessionStorage = browserStorage('sessionStorage')!;
const localStorage = browserStorage('localStorage')!;
function storageGet(key: string) { try { return sessionStorage.getItem(key); } catch { return null; } }
function storageSet(key: string, value: string | null) {
  return setStoredValue(sessionStorage, key, value);
}
export function PreviewApp({ locale, renderHome }: { locale: Locale; renderHome: (onLogout: () => void, session: AccountSession | null) => ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState(locale);
  const t = authCopy[currentLocale];
  const service = useRef(createLocalAuthService()).current;
  const [restored] = useState(() => {
    try {
      const confirmation = service.resumeOnboarding();
      return { confirmation, draft: confirmation ? service.readProfileDraft() : { ...emptyRegistration }, error: null as AuthErrorCode | null };
    } catch { return { confirmation: null, draft: { ...emptyRegistration }, error: 'unavailable' as AuthErrorCode }; }
  });
  const onboarding = useRef<OnboardingConfirmation | null>(restored.confirmation);
  const enabled = useRef(storageGet(authStorageKeys.enabled) === '1' || ['login', 'code', 'home', 'recovery', 'recovery-result', 'register'].includes(new URLSearchParams(location.search).get('screen') ?? ''));
  const session = useRef(readAccountSession(sessionStorage, localStorage));
  const recoveryReceipt = useRef(readRecoveryReceipt(sessionStorage));
  const challenge = useRef<AuthChallenge | null>(null);
  const [screen, setScreen] = useState<AuthScreen>(() => {
    if (enabled.current) storageSet(authStorageKeys.enabled, '1');
    const requested = new URLSearchParams(location.search).get('screen');
    const initial = resolveAuthScreen(requested, enabled.current, Boolean(session.current), false, Boolean(recoveryReceipt.current), Boolean(onboarding.current));
    if (enabled.current && initial !== requested) history.replaceState(null, '', authUrl(location.href, initial));
    return initial;
  });
  const screenRef = useRef(screen); screenRef.current = screen;
  const [contact, setContact] = useState(restored.confirmation?.contact ?? '');
  const [draft, setDraft] = useState<RegistrationDraft>(restored.draft);
  const [replyEmail, setReplyEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<AuthErrorCode | null>(restored.error);
  const [message, setMessage] = useState<'resent' | null>(null);
  const [pending, setPending] = useState<'request' | 'verify' | 'resend' | 'recovery' | 'profile' | null>(null);
  const pendingRef = useRef(false);
  const operation = useRef(0);
  const [now, setNow] = useState(Date.now());
  const input = useRef<HTMLInputElement>(null);
  const replyInput = useRef<HTMLInputElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  function navigate(next: AuthScreen) { history.replaceState(null, '', authUrl(location.href, next)); setScreen(next); }
  function invalidate() {
    operation.current++; const cleared = service.clear(); onboarding.current = null; challenge.current = null;
    pendingRef.current = false; setPending(null); setCode(''); setError(cleared ? null : 'unavailable'); setMessage(null);
  }
  function returnToLogin() { setContact(onboarding.current?.contact ?? contact); invalidate(); navigate('login'); }
  function openRecovery() {
    invalidate(); recoveryReceipt.current = null; storageSet(authStorageKeys.recovery, null); setReplyEmail(''); navigate('recovery');
  }
  function logout() {
    enabled.current = true; storageSet(authStorageKeys.enabled, '1'); const cleared = storageSet(authStorageKeys.session, null);
    session.current = null; invalidate(); setContact(''); setDraft({ ...emptyRegistration }); navigate('login');
    if (!cleared) setError('unavailable');
  }
  function expireProfile(failure: AuthErrorCode) {
    setContact(onboarding.current?.contact ?? contact); invalidate(); navigate('login'); setError(failure);
  }
  useEffect(() => {
    const guard = () => {
      session.current = session.current && readAccountSession(sessionStorage, localStorage);
      try { onboarding.current = service.resumeOnboarding(); } catch { onboarding.current = null; setError('unavailable'); }
      const requested = new URLSearchParams(location.search).get('screen');
      const next = resolveAuthScreen(requested, enabled.current, Boolean(session.current), Boolean(challenge.current), Boolean(recoveryReceipt.current), Boolean(onboarding.current));
      if (pendingRef.current && next !== screenRef.current) {
        operation.current++; service.cancelPending(); challenge.current = null;
        pendingRef.current = false; setPending(null); setCode(''); setError(null); setMessage(null);
      }
      if (enabled.current && requested !== next) history.replaceState(null, '', authUrl(location.href, next));
      setScreen(next);
    };
    window.addEventListener('popstate', guard); window.addEventListener('pageshow', guard);
    return () => { window.removeEventListener('popstate', guard); window.removeEventListener('pageshow', guard); operation.current++; service.cancelPending(); };
  }, [service]);
  useEffect(() => { if (screen === 'recovery-result') title.current?.focus(); else if (screen === 'register') document.getElementById('register-name')?.focus(); else if (screen !== 'home') input.current?.focus(); }, [screen]);
  useEffect(() => {
    if (screen !== 'code' && screen !== 'register') return;
    const timer = setInterval(() => {
      setNow(Date.now());
      if (screen === 'register') {
        try { if (!service.resumeOnboarding()) expireProfile('expired'); } catch { expireProfile('unavailable'); }
      }
    }, 250);
    return () => clearInterval(timer);
  }, [screen, service]);
  function updateDraft(next: RegistrationDraft) {
    setDraft(next); setError(null);
    try { service.saveProfileDraft(next); } catch (failure) {
      const reason = failure instanceof AuthError ? failure.code : 'unavailable';
      if (reason === 'expired') expireProfile(reason); else setError(reason);
    }
  }
  function enterHome(verifiedSession: RegisteredSession) {
    if (!storageSet(authStorageKeys.session, JSON.stringify(verifiedSession))) {
      session.current = null; challenge.current = null; onboarding.current = null; setContact(verifiedSession.contact); setCode(''); navigate('login'); setError('unavailable'); return;
    }
    session.current = verifiedSession; onboarding.current = null; challenge.current = null; setCode(''); setDraft({ ...emptyRegistration }); navigate('home');
    if (document.documentElement.lang !== locale) location.reload();
  }
  async function run(kind: 'request' | 'verify' | 'resend' | 'recovery' | 'profile') {
    if (pendingRef.current) return;
    setError(null); setMessage(null);
    if (kind === 'recovery') {
      if (!contact.trim() || !replyEmail.trim()) { setError('recovery-required'); (!contact.trim() ? input : replyInput).current?.focus(); return; }
      if (!normalizeContact(contact)) { setError('invalid-contact'); input.current?.focus(); return; }
      const reply = normalizeContact(replyEmail);
      if (!reply || !reply.includes('@')) { setError('invalid-reply'); replyInput.current?.focus(); return; }
    }
    if (kind === 'profile') {
      if (!draft.name.trim() || (draft.type === 'business' && (!draft.organization.trim() || !draft.registrationNumber.trim()))) {
        setError('registration-required'); document.getElementById(!draft.name.trim() ? 'register-name' : !draft.organization.trim() ? 'register-organization' : 'register-registrationNumber')?.focus(); return;
      }
    }
    if (kind === 'request' && !normalizeContact(contact)) { setError('invalid-contact'); input.current?.focus(); return; }
    if (kind === 'verify' && !normalizeCode(code)) { setError('invalid-code'); input.current?.focus(); return; }
    // A new access attempt must never retain another account's wallet context.
    if (kind === 'request' || kind === 'recovery') {
      session.current = null;
      if (!storageSet(authStorageKeys.session, null)) { setError('unavailable'); return; }
    }
    const currentChallenge = challenge.current;
    if ((kind === 'verify' || kind === 'resend') && !currentChallenge) { navigate('login'); return; }
    pendingRef.current = true; setPending(kind); const generation = ++operation.current;
    try {
      if (kind === 'recovery') {
        const receipt = await service.requestRecovery(contact, replyEmail);
        if (generation !== operation.current) return;
        recoveryReceipt.current = receipt; storageSet(authStorageKeys.recovery, JSON.stringify(receipt)); navigate('recovery-result');
      } else if (kind === 'profile') {
        const result = await service.completeRegistration(draft); if (generation !== operation.current) return; enterHome(result);
      } else if (kind === 'verify') {
        const result = await service.verifyCode(currentChallenge!, code);
        if (generation !== operation.current) return;
        challenge.current = null; setCode('');
        if (result.kind === 'local-onboarding') {
          onboarding.current = result; setContact(result.contact); setDraft({ ...emptyRegistration, contact: result.contact }); navigate('register'); setDraft(service.readProfileDraft());
        } else enterHome(result);
      } else {
        const result = kind === 'request' ? await service.requestCode(contact) : await service.resendCode(currentChallenge!);
        if (generation !== operation.current) return;
        onboarding.current = null; challenge.current = result; setNow(Date.now()); setCode('');
        if (kind === 'resend') { setMessage('resent'); input.current?.focus(); } navigate('code');
      }
    } catch (failure) {
      if (generation === operation.current) {
        const reason = failure instanceof AuthError ? failure.code : 'unavailable';
        if (kind === 'profile') {
          let confirmation = null; try { confirmation = service.resumeOnboarding(); } catch { /* Remain fail closed. */ }
          if (!confirmation) { expireProfile(reason); return; }
        }
        setError(reason);
      }
    } finally { if (generation === operation.current) { pendingRef.current = false; setPending(null); } }
  }
  if (screen === 'home') return renderHome(logout, session.current);
  const isCode = screen === 'code', isRegistration = screen === 'register';
  const isRecovery = screen === 'recovery' || screen === 'recovery-result', isResult = screen === 'recovery-result';
  const seconds = remainingSeconds(challenge.current?.retryAt ?? 0, now);
  function submit(event: FormEvent) { event.preventDefault(); void run(isRecovery ? 'recovery' : isCode ? 'verify' : isRegistration ? 'profile' : 'request'); }
  function changeLocale(next: Locale) {
    const url = new URL(location.href); url.searchParams.set('lang', next);
    try { localStorage.setItem('oraclepay.locale', next); } catch { /* Language remains usable in memory. */ }
    history.replaceState(null, '', url); document.documentElement.lang = next; setCurrentLocale(next);
  }
  const profileFields = isRegistration ? draft.type === 'business' ? ['name','organization','registrationNumber'] as const : ['name'] as const : [];
  return <div className="auth-shell" data-auth-screen={screen}>
    <header className="auth-header"><div className="auth-languages" role="group" aria-label={t.language}>{(['ru', 'en'] as const).map(lang => <button key={lang} aria-pressed={lang === currentLocale} onClick={() => changeLocale(lang)}>{lang.toUpperCase()}</button>)}</div><span>{t.header}</span></header>
    <main className="auth-main" aria-labelledby="auth-title" data-node-id={isRegistration ? '34:105' : isRecovery ? '34:175' : isCode ? '34:150' : '34:78'}>
      {isRecovery && <button className="auth-back" aria-label={t.back} onClick={returnToLogin}><Icon name="back" size={20}/></button>}
      <h1 id="auth-title" ref={title} tabIndex={-1}>{isRegistration ? t.registrationTitle : isResult ? t.recoveryResultTitle : isRecovery ? t.recoveryTitle : isCode ? t.codeTitle : t.title}</h1>
      <p className="auth-subtitle">{isRegistration ? t.registrationSubtitle : isResult ? t.recoveryResultBody : isRecovery ? t.recoverySubtitle : isCode ? <>{t.sent} <bdi>{challenge.current?.contact}</bdi>.</> : t.subtitle}</p>
      {!isResult && <form className="auth-form" onSubmit={submit} noValidate aria-busy={pending !== null}>
        {isRegistration ? <>
          <div className="auth-confirmed-contact"><span>{t.verifiedContact}</span><bdi>{onboarding.current?.contact}</bdi><button className="auth-link" type="button" onClick={returnToLogin}>{t.change}</button></div>
          <div className="auth-account-types" role="group" aria-label={t.accountType}>{(['personal','business'] as const).map(type => <button type="button" key={type} disabled={pending !== null} aria-pressed={draft.type === type} onClick={() => updateDraft({ ...draft, type })}>{t[type]}</button>)}</div>
          {profileFields.map(field => <div className="auth-field" key={field}><label htmlFor={`register-${field}`}>{t[field]}</label><input id={`register-${field}`} name={field} value={draft[field]} maxLength={254} required autoComplete={field === 'name' ? 'name' : field === 'organization' ? 'organization' : 'off'} readOnly={pending !== null} aria-invalid={error === 'registration-required' && !draft[field].trim()} aria-describedby={error ? 'auth-error' : undefined} onChange={event => updateDraft({ ...draft, [field]: event.target.value })}/></div>)}
        </> : <div className="auth-field"><label htmlFor="auth-input">{isRecovery ? t.recoveryContact : isCode ? t.code : t.contact}</label><input ref={input} id="auth-input" key={screen} type="text" value={isCode ? code : contact} onChange={event => { if (isCode) setCode(event.target.value); else setContact(event.target.value); setError(null); }} name={isCode ? 'code' : 'contact'} inputMode={isCode ? 'numeric' : 'text'} autoComplete={isCode ? 'one-time-code' : 'username'} autoCapitalize="none" spellCheck={false} maxLength={isCode ? 32 : 254} aria-invalid={isRecovery ? error === 'invalid-contact' || (error === 'recovery-required' && !contact.trim()) : Boolean(error)} aria-describedby={error ? 'auth-error' : undefined} required readOnly={pending !== null}/></div>}
        {isRecovery && <><div className="auth-field"><label htmlFor="auth-reply">{t.replyEmail}</label><input ref={replyInput} id="auth-reply" name="replyEmail" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} value={replyEmail} onChange={event => { setReplyEmail(event.target.value); setError(null); }} required aria-invalid={error === 'invalid-reply' || (error === 'recovery-required' && !replyEmail.trim())} aria-describedby={error ? 'auth-error' : 'recovery-explanation'} readOnly={pending !== null}/></div><p className="auth-message" id="recovery-explanation">{t.recoveryExplanation}</p></>}
        {error && <p className="auth-error" id="auth-error" role="alert">{t.errors[error]}</p>}
        <button className="auth-primary" type="submit" disabled={pending !== null}>{pending === 'recovery' ? t.recoverySubmitting : isRecovery ? t.recoverySubmit : pending === 'profile' ? t.creating : isRegistration ? t.create : pending === 'request' ? t.requesting : pending === 'verify' ? t.confirming : isCode ? t.confirm : t.request}</button>
        {!isRecovery && !isRegistration && (isCode ? <button className="auth-link auth-resend" type="button" disabled={seconds > 0 || pending !== null} onClick={() => void run('resend')}>{pending === 'resend' ? t.resending : seconds > 0 ? t.retry(seconds) : t.resend}</button> : <button className="auth-link" type="button" onClick={openRecovery}>{t.recovery}</button>)}
        {message && <p className="auth-message" role="status">{t[message]}</p>}
      </form>}
      {!isRecovery && (isCode ? <div className="auth-secondary"><button className="auth-link" onClick={returnToLogin}>{t.change}</button><button className="auth-link" onClick={openRecovery}>{t.recovery}</button></div> : isRegistration && <button className="auth-link auth-register" onClick={returnToLogin}>{t.existing}</button>)}
    </main>
  </div>;
}
