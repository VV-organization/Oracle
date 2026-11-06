# 04b — local registration and restricted account context

Historical sequence: superseded on 6 November 2026 by user-approved [04c unified entry](04c-unified-entry.md). Tests below describe the former profile-before-OTP order. Current flow confirms the contact before collecting profile fields.

Before implementation: A2 `34:105` fresh source inspected by orchestrator, plus A3 OTP and access audit. Entry: Login → Create account. Observable outcome: actual personal/business identity survives OTP, reload and sign-out/sign-in; nine zero balances, empty history, no seeded requisites or money movement; requisites remain discoverable and open an unissued-details state. Existing preview retains its fixture.

| Branch | Expected data/state | Verification |
|---|---|---|
| Personal / business | Name/contact required; business organization/registration number required; switching type retains draft | service tests; browser checks PASS (see browser report) |
| Invalid / duplicate / technical failure | No account/session; draft retained; duplicate offers sign-in with same contact | service tests; browser checks PASS (see browser report) |
| Request / double / cancel / stale | One current challenge; cancelled completion cannot create account | service tests; browser checks PASS (see browser report) |
| Wrong / expired OTP | No session; resend after 30s; changing contact restores full draft | adapter tests; relevant browser checks PASS; expiry/resend timing covered by adapter |
| OTP confirmed | New account, KYC not started; business KYB not started; restricted permissions | state tests; browser checks PASS |
| Reload form / OTP / home | Draft restored; OTP secrets not persisted; OTP reload returns to registration; validated account session restored | persistence tests; browser reload checks PASS |
| Logout / relogin | Session removed, registry retained; same account context restored after OTP | service tests; browser checks PASS (see browser report) |
| Direct/event action / requisites | Central permission gate prevents financial transitions; receiving dialog displays an unissued state with no Alex details | permissions tests; receiving browser checks PASS |
| Corrupt / inaccessible storage | Fail closed for session/registry, safe form fallback; no false registered session | persistence tests |

Confirmed source facts: two types, contact confirmation, 30s resend, draft preserved on return; business fields are required without country-specific format. Local adapter expiry (5 min) and OTP 123456 are QA fixtures, not server policy. Registry is local browser preview data, never a real account/backend. No OTP secrets persisted. Full verification/KYC/KYB provider flow remains dependency 04g: this package shows requirements and blocks financial actions; it does not invent verification completion.

Status: executor implementation complete for local registration slice; verification dependency04g remains partial; independent QA/browser results owned by orchestrator. No commit, push, publish, or approval export.

Safety adaptation: receiving links remain visible, but a new account opens an unissued-details dialog with no fixture IBAN, address, network, QR or copy action. Shared money actions are hidden; the event dispatch guard independently denies restricted actions. Fresh field labels refined to «Юридическое название» and «Регистрационный номер».

Implementation checks: `npm --prefix frontend test` (21 tests) and `npm --prefix frontend run build` pass. Service tests cover personal/business, required data, duplicate normalized contact, invalid/expired/resent OTP, cancel/stale/double request, injected delay failure/retry, persistence failure, corrupt/inaccessible registry, typed session recovery, empty balances/history and action permissions. Main agent owns browser/independent QA evidence; those are not claimed here.

04g dependency remains visible as disabled «Начать проверку» with adjacent «Проверка временно недоступна» for KYC and business KYB. Essential session-write failure does not enter Home: account registry may already have been confirmed, so UI returns to sign-in with the same contact and an unavailable error; retry sign-in restores the registered context after storage becomes writable. No real delivery, authentication, registration, verification or server permission enforcement is implemented.

Final review: independent code/adapter QA and orchestrator Chromium checks completed; see `../reviews/2026-11-06-registration-qa.md` and `../reviews/2026-11-06-registration-browser.md`. Verification dependency remains open, so the whole access package is not closed.
