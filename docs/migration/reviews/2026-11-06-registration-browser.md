# 04b — browser verification, 6 November 2026

Result: local registration slice verified with simulated authentication. Full access flow remains partial: real authentication/account creation, delivery and verification provider (04g) are not connected. No production security or absence-of-all-bugs claim. No publication or independent human usability session.

## Source and scope

Fresh Figma A2 `34:105`, business fields `79:575` / `79:579`, verification actions `79:711` / `79:723`, and D1 `34:262` inspected. Existing run-03 restricted personal/business observations and access source audit provide restriction context; fresh base D1 render alone is not evidence of every hidden restriction. Applied approved green/orange styling; no claim of complete pixel parity.

## Executed against localhost

Chromium headless, isolated contexts, no external delivery. Python scripts and PNGs retained in `frontend/qa/registration/`.

- `browser_smoke.py`: 22 assertions. Green/cards personal and orange/columns business, 1440×1000. Required-field focus, business fields and switching preservation, OTP return with draft, invalid/correct code, actual owner, no seeded balances or money actions, reload, receiving dialog without copy/issued details, Escape, logout/relogin. No page errors observed in these two runs.
- `browser_edges.py`: 18 assertions. Both themes at 320px EN and 390px RU: complete business form → OTP → reload/draft → confirmation → restricted Home. No document horizontal overflow. Enter submits. Injected essential session-write failure returns to login with contact and error, without Home. Blocked localStorage property getter still renders registration and fails with visible error.
- `browser_regression.py`: four assertions. Corrected 320px English type labels remain unwrapped; direct Home after logout is guarded; duplicate registration keeps entered values and transfers contact to sign-in; recovery regression creates no authenticated session.
- Final `npm --prefix frontend test`: 21/21 PASS. Includes cancellation, duplicate request, expired/resend OTP, adapter failures, corrupt registry/session and restrictions. Final production build PASS. `git diff --check` PASS.

Counts are scoped assertions, not proof of exhaustive flow coverage. OTP expiry/resend races and retry cases were tested at adapter level; not every timing permutation was repeated in the browser. No real server or provider checks ran.

## Findings and fixes

Independent reviewer found fail-open corrupt registry loading, unguarded browser storage getters/startup locale access, and swallowed essential session-write failure. Executor fixed them; adapter and browser failure injections confirm scoped outcomes. Main browser review found business sidebar incorrectly labelled personal and English type button wrapping at320px; both fixed and the changed states rechecked. Initial smoke run stopped because test sought «Реквизиты» while the column layout's selected USDC correctly exposed «Адрес»; locator corrected, not an app fix.

Visually inspected orange desktop registration, green mobile restricted Home and orange320 English form before/after fix. Other captured states were structurally checked; these captures do not establish Safari/Firefox/device parity. Reduced-motion contexts used for most smoke captures; motion is not certified by this run.

## Open dependencies

«Начать проверку» is disabled with an explicit unavailable explanation. New account requisites are unissued and never copy the preview user's data. These are deliberate visible boundaries until 04g. Unknown contacts in the existing local login adapter still open the historical preview fixture; real account lookup and server authorization are backend work. Local storage is test persistence, not an authentication boundary. Only fictional test contacts were used.

Run scripts with Vite on127.0.0.1:5173 and Python Playwright installed. Evidence outputs are written alongside each script. Broader device/browser checks and real API integration remain required before release.
