# 04c — unified entry: verification record

Scope: user-approved contact → OTP → existing Home / new profile, replacing the earlier separate signup entry. Local green/cards and orange/columns only. Historical Figma source IDs are provenance, not a claim of unchanged source order or pixel parity.

## Independent review

Executor: `/root/unified_auth_impl`. Read-only reviewer: `/root/unified_auth_qa`; orchestrator owns integration and actual browser checks. Reviewer inspected service, persistence, routing, UI transitions, registration tests and permission context. Found logout ignored failed storage deletion. Executor added deletion/write-null fallback, confirmation deletion fallback and regressions; reviewer independently reran the final 29 tests and production build successfully. No remaining blocking defect reported for this local scope.

## Actual checks

- Orchestrator fresh `npm --prefix frontend test`: 29/29 pass; `npm --prefix frontend run build`: pass.
- Chromium `frontend/qa/unified-entry/browser_flow.py`: 34 named assertions pass. Green/RU personal and orange/EN business: legacy URL guard, invalid contact, wrong OTP, cooldown, confirmed profile, required fields, reload, per-contact draft isolation, contact change, expiration, fresh confirmation, actual owner, no fixture balances, no money actions, reload/sign-out/relogin, no duplicate account, no browser exceptions.
- `browser_edges.py`: 18 named assertions pass across both themes: resend restart, expired OTP, fresh-code continuation, OTP reload guard, recovery receipt without session, corrupt lookup rejected rather than treated as signup, retry after recovery of storage, denied session writes and inaccessible registry fail closed.
- `browser_matrix.py`: four combinations pass (each theme at RU/390 and EN/768): international phone normalization, spaced OTP pasted through keyboard submission, profile focus, locale switch retaining the confirmed contact, no horizontal document overflow.
- Profile screenshots captured at desktop 1440 and mobile 320, plus 390/768. Orchestrator visually inspected green mobile and orange mobile/desktop: readable labels, wrapped long content, contained forms and themed actions. This is Chromium emulation, not a claim of testing real iOS/Safari/Android devices.
- Impeccable static detector on auth JSX/CSS: one existing `overused-font` warning for Inter. Retained approved project typography; no unrelated font redesign. Detector findings are not a usability study.

Evidence and reproducible scripts: `frontend/qa/unified-entry/` (`browser-results.json`, `edge-results.json`, `matrix-results.json`, PNGs). Initial browser-script attempts used the wrong English logout label and omitted opening mobile navigation; those test selectors were corrected before the passing full run. They were not application failures.

## Limits and open dependencies

OTP `123456`, five-minute lifetimes and local account registry are test fixtures. No SMS/email is delivered; no server authentication/session, real recovery, account lookup API, rate limiting or KYC/KYB provider is verified. Browser storage is editable and cannot establish identity/security. New users remain restricted with zero balances/history; verification is not represented as complete.

If a browser permits reads but denies both writes and deletions, client-only revocation cannot persist across reload. Current instance clears access and reports failure; real revocation must be server-side. No independent human usability observation was performed. No Figma/approval export synchronized for this approved local-flow change; existing exports still document the historical sequence. No commit, push or publish.

Next separately scoped package: verification flow 04g after inspecting current source and defining provider-independent states and backend responsibilities. Do not mark it complete from this entry-flow verification.
