# 04b — independent QA, 6 November 2026

Scope: report-first review of registration state, adapter, persistence, permissions and Home integration. Local source only. No production authentication/security claim. No browser/E2E was executed by this reviewer; the orchestrator owns rendered desktop/mobile, both themes, RU/EN and keyboard checks. No independent human usability observation or external account creation occurred.

## Executed on final reviewed source

- `npm test`: **21 passed, 0 failed** after the executor's fixes, including corrupt/inaccessible registry and blocked Storage property getter regressions.
- `npm run build`: **passed** TypeScript and Vite after those fixes.
- Independent Node assertions: malformed registry and throwing registry reads both reject OTP completion with `AuthError('unavailable')`; neither returns a preview session.
- Independent Node assertion: throwing `window.localStorage` property getter returns an unavailable adapter; requesting registration rejects with `unavailable` instead of treating storage as an empty registry.
- Independent Node startup probe: throwing global localStorage getter no longer makes `readLocale()` throw.

## Findings returned and disposition

| Finding | Initial evidence | Final disposition |
| --- | --- | --- |
| Corrupt/inaccessible registry could fall back to unrestricted local-preview identity | Initial code review of forgiving `readAccounts` use in login | Executor introduced strict `loadAccounts` before independent reproducer; independently verified rejection and final regression test passes |
| P2: blocked browser Storage property getter could prevent mounting | Independent Node probe originally confirmed synchronous `createLocalAuthService()` exception; PreviewApp acquired globals before guarded readers | Fixed via `browserStorage`; independent adapter probe and regression test pass. Startup `readLocale` also guarded after QA follow-up; independent startup probe passes. Actual blocked-store UI is still orchestrator browser coverage |
| P2: essential session write failure silently entered Home, then lost identity on reload or language-triggered reload | Code review of swallowed `storageSet` result and Home navigation | Fixed in `PreviewApp.tsx`: failed session write keeps login with unavailable error and verified contact; no Home/reload. Registry profile remains, so retry sign-in can recover same restricted identity. Code-reviewed; browser fault-injection retest remains orchestrator-owned |

No remaining blocking defect was identified in this bounded code/adapter review. That statement does not close unexecuted browser cases.

## Reviewed invariants and coverage gaps

- Personal/business identity, required business fields, normalization, duplicate rejection, delayed challenge cancellation, one-use OTP, expiry/resend and registry-write-before-session are adapter-tested. No real delivery, OTP protection/rate policy or API integration is covered.
- `dashboardForSession` replaces owner, zeros fixture accounts and empties operations for a registered session. The test asserts one fixture account; the real nine-account rendered zero state remains browser coverage.
- Hidden money controls are supplemented by Main's central event permission gate. Receiving details deliberately remain discoverable: `ReceivingDialog` receives `issued=false`, uses unavailable details and renders no bank/address fixture or copy controls for the new account. This was code-reviewed, not clicked by this reviewer.
- Draft restoration and route helper assertions are not executed reload-at-every-step tests. Logout, Back/BFCache, relogin, stale tab state, locale during pending verification, keyboard focus and duplicate Enter must be validated in the browser.
- No independent browser fault-injection was performed for session write failure, failed registry write recovery, stale responses or expiry UI. Node adapters verify the relevant state rules; UI transitions still need observable evidence.
- Missing registry is deliberately treated as empty and unknown-contact login retains the prior local-preview fixture. This preview behavior cannot establish real access control. Cross-tab registry writes have no server transaction/unique constraint; backend integration must own those guarantees.
- Source fixture retention is code-reviewed: registered identity uses derived zero-account/empty-history data; original preview fixture is unchanged. Stored identity/requisites/operation data are not translated.

Status: **local code/adapter review complete; browser acceptance pending orchestrator evidence**. KYC/KYB execution remains dependency 04g. No commit, push, publication or approval export.
