# Access — independent source audit

2026-11-03. Package 00, read-only audit of the saved baseline. No Figma/UI calls, runtime clicks, variable setters or edits to shared ledgers were performed. This report maps source behavior for the main executor to observe in Present. It does not accept a flow, security policy, integration or package.

## Evidence and interpretation

Sources under `figma-work/migration-baseline/raw/`: `hierarchy.json`, `product-properties.jsonl.gz`, `graph-ordered-actions.json.gz`, `decoded/nodes.jsonl.gz`, and `decoded/active-variables.json`. Paths below are relative to the root reaction `prototypeInteractions/0`; line numbers refer to decoded JSONL. The graph is used to locate actions, then original assignment values are read from decoded nodes. The saved file is not an independently matched current cloud revision.

Current root reactions must be distinguished from historical `symbolData.symbolOverrides`. For example, login `79:534` contains an old password/authenticator override, while its root reaction uses email/phone plus a one-time code. Do not revive password behavior from the override. Runtime observations remain necessary to confirm effective execution.

A1–A4 are canonical frames `34:78`, `34:105`, `34:150`, `34:175`. D1 is `34:262`; the shared external-process overlay is O3 `34:1473`; support is H1 `34:1287`; settings S1 `34:1387`. O2 `34:1463` includes the scenario menu as well as confirmation uses; do not assume every O2 visit is a product-facing scenario picker.

## Entry and reset behavior

- D1 `Navigation / Sign out` `2709:1320`, reaction `2160:299`, line11224: actions0–4 set `contactEditing=false`, `UX/contactCodeStep=false`, `UX/contactEntryStep=true`, `UX/signedIn=false`, `feedbackVisible=false`; action5 unconditionally navigates to A1 with scroll reset. It does not perform a clean scenario reset. Its icon `2709:1322` has a separate MOUSE_ENTER swap-state animation (~160ms); a missed click near viewer chrome is not proof the frame's handler failed.
- A1 single registration entry `79:539` has 730 ordered actions. Navigation to A2 is action627; additional state synchronization follows it. Early defaults are overwritten later: KYC becomes `Не начата` at548, account state `Ожидает проверки` at547, final personal context is set beginning563, and KYB becomes `Не требуется` at568. Name/contact are cleared at27/28; organization fixtures are populated at30/31. Never stop reading at the first `kycStatus=Подтверждена` assignment or at navigation.
- A2 personal `79:558` (line653) and business `79:560` (654), with clickable outline counterparts `99:420`/`99:423`, change account type in place and recalculate access. They do not navigate. Personal sets `isBusiness=false`, `UX/isPersonal=true`, KYB `Не требуется`; business sets the opposite type and owner context. These handlers do not clear organization/name/contact fields. Repeated switching and hidden-field preservation require observation.

## A1 — sign in

| Source | Guard / assignments | Destination or visible result to verify |
| --- | --- | --- |
| `79:522` Login identifier, line632 | action0 snapshots whether `authEmail` equals `contactEmail`. If equal, action1/branch0 writes `UX/authPhone`; otherwise action2/branch0 writes `contactEmail`. Clears auth issue and feedback. | In-place fixture toggle; not free typing. Verify both labels and subsequent delivery context. |
| `79:534` auth:login, line637 | action0: identifier equals email OR phone fixture. Valid branch sets purpose `Подтвердите вход`, help=identifier, code empty, issue flags false, timer30, resend label30. | A3 at `actions/1/conditionalActions/0/actions/12`. Invalid branch at2 shows `Укажите телефон с кодом страны или электронную почту.` |
| `79:536` go:A4, line638 | Resets auth issue, feedback, recovery message/ready/completed, reply email. | A4 at action7; request visibility recalculated after navigation. |
| `79:539` start:personal, line640 | Full reset/context described above. | A2 at action627. |

Saved email fixtures are `alex.morozov@severstudio.ru`, phone `+996 555 123 456`. Saved values do not establish the current Present session's state.

## A2 — registration

| Source | Exact source behavior | Result / limitation |
| --- | --- | --- |
| `79:562` Name, line655 | `regName='Алексей Морозов'` | Click substitution. |
| `79:566` Registration contact, line656 | Toggle `regEmail` between contactEmail and authPhone using a snapshotted equality guard; clear registration issue. | No arbitrary contact syntax validation is defined. |
| `79:575` Organization, line658 | `orgName='Студия «Север»'` | Click substitution. |
| `79:579` Registration, line659 | `orgNumber='02810202610387'` | Click substitution; actual national formats are unspecified. |
| `79:588` register:continue, line665 | action0 name and contact both nonempty; action1 business flag; action2 organization and number both nonempty. | Business-valid A3 at `actions/3/conditionalActions/0/actions/12`; personal-valid A3 at `actions/5/conditionalActions/0/actions/12`. |
| Same continue | Name/contact present, business=true, organization data missing. | action4 error: `Укажите название и регистрационный номер организации.` No navigation. |
| Same continue | Name or contact missing. | action6 error: `Укажите имя и телефон или электронную почту.` No navigation. |
| `79:590` auth:existingBusiness, line666 | Clears auth issue/text and feedback. | A1 at action3. Despite historical internal name, it is the existing-account path; inspect current visible label. |

Both valid branches set purpose `Подтвердите контакт`, help=registration contact, code empty, timer30, and clear issues. Organization fields may already be fixture-filled after entering registration; therefore a missing-business-data branch in source is not proof it is reachable with the available click toggles. Do not manufacture reachability by editing persistent defaults.

## A3 — confirmation, resend and context-sensitive return

- Code field `79:606`, line676: sets `confirmCode='123 456'` and clears code error. This is a mock fixture, not a real OTP or a typing/format specification.
- Confirm `79:614`, line681, has 356 ordered actions. At0, `g0=(confirmCode=='123 456')`; at3, `g1=(confirmPurpose=='Подтвердите контакт')`.
- Valid registration (`g0 && g1`) copies registration identity/contact, sets signed-in/private-support context, retains personal/business distinction, recalculates access/history, then navigates to D1 at `actions/99/conditionalActions/0/actions/0`.
- At100, `g2=(confirmPurpose=='Подтвердите новый контакт')`. Valid new-contact confirmation (`g0 && !g1 && g2`) changes the chosen email/phone and returns S1 at `actions/111/conditionalActions/0/actions/0`. This is an adjacent settings dependency, not a substitute for auditing trusted-contact step-up separately.
- Valid ordinary login (`g0 && !g1 && !g2`) sets signed-in context, recalculates access/history, then D1 at `actions/186/conditionalActions/0/actions/0`.
- Invalid/empty code: actions187/188 show `Код неверен или устарел. Проверьте его или запросите новый.` No destination follows that invalid branch. Recalculation actions189–355 still follow, so guard variables cannot be interpreted as immutable.
- Back `79:619`, line683, clears code/error/feedback. Purpose `Подтвердите контакт` → A2 at4/branch0/action1; new contact → S1 at6/branch0/action1; otherwise recoveryMessage=true → A4 at8/branch0/action1; otherwise → A1 at9/branch0/action1. Check return identity and values, not only screen title.
- Access-support `79:621`, line684, resets recovery request state/reply email and navigates to A4 at7, then recalculates request visibility.

Resend is an interactive component. Instance `213:322` (line2069) and components `212:33` TickA / `212:35` TickB run AFTER_TIMEOUT with timeout1. Each decrements `otpResendSeconds`, sets labels for1–29 and swaps to the other tick while >0; otherwise clamps0 and swaps to Ready `212:37`. Ready's ON_CLICK reaction (line2066) clears code/error, sets resend feedback, timer30 and label30, then swaps to TickA at action8. Early tick states have no ON_CLICK resend reaction in this source. Observe early click, ticking, readiness, resend reset and preservation of purpose/contact independently; no exact wall-clock or delivery guarantee follows from these declarations.

### Reported runtime discrepancy: delivery recipient label

Main reported run03 phone selection followed by A3 still naming email (captures14–16). This report did not inspect those images, but source directly explains a matching discrepancy candidate:

- Login `79:534` correctly assigns `confirmHelp=authEmail` at `actions/1/conditionalActions/0/actions/1`.
- Delivery text `180:349`, line1957, is literal `Отправили одноразовый код на alex.morozov@severstudio.ru`.
- `product-properties.jsonl.gz` shows `bindings={}` for this node. Original `textData.styleOverrideTable` only makes the address Inter Semi Bold; it contains no variable alias. No node-level variable/parameter consumption binding is present.

The current visible recipient label therefore does not consume confirmHelp in the saved source. Record the runtime discrepancy, preserve evidence and resolve it before implementing this behavior. Do not silently keep a fixed email in a newly working phone-login flow or silently fix the source during inventory.

## A4 — recovery request

| Source | Guard / action | Expected observation to verify |
| --- | --- | --- |
| `79:637` Email, line696 | Same authEmail email/phone toggle as A1; clears auth issue/feedback. | Account credential fixture changes in place. |
| `193:322` Recovery reply email, line1981 | reply=`alex.morozov@northmail.ru`, clears auth issue. | Reply contact is distinct from account identifier. |
| `79:642` recovery:send, line698 | action0 requires both identifier and reply email nonempty. Valid branch sets recoveryCompleted=true, recoveryReady=false, hides error/feedback; final action3 recomputes request visibility. | In-place request-completed presentation, no destination and no source proof of restored access, replaced credential or delivered email. |
| Same send, invalid | action2 shows `Укажите контакт аккаунта и доступную почту для связи.` | Request remains incomplete; verify visible error and correction. |
| `2020:502` Navigation/Back, line2600 | feedback=false; action1 NAVIGATE A1. | Return to login; recovery completion is not equivalent to successful login. |

## D1 — KYC/KYB and financial restrictions

The main permission expression is:

`kycStatus == 'Подтверждена' && (!isBusiness || kybStatus == 'Подтверждена') && providerClear && accountState == 'Активен'`.

It determines canMove/cannotMove and related indicators when recomputed. Links additionally require linkEntitled. needsVerification separately uses `verificationAllowed && (KYC not confirmed || (business && KYB not confirmed))`; a lack of verification UI is not proof money movement is allowed.

| Source / line | Condition and action path | Result to verify |
| --- | --- | --- |
| `79:711` verify:kyc /716 | KYC=`Отклонена` → action5/branch0/action1 H1; otherwise action6/branch0/action6 O3. | Declined opens support with refusal topic; other states open identity-check overlay with externalKind=kyc. |
| `79:723` verify:kyb /726 | KYB=`Отклонена` → same paths to H1/O3. | Organization-specific support or externalKind=kyb. |
| `80:2305` external:advance /1585 | Non-funding and externalStarted=false: actions158/159 set started=true and `Вернуться в OraclePay`; body changes at162/165 by kind. | First step is an in-overlay mock of the external process, not an external service call. |
| Same advance, already started | KYC pending assignment at86/branch0/action0; close at114/branch0/action0. KYB pending at116/branch0/action0; close144/branch0/action0. Guards additionally require non-funding, externalStarted, matching kind. | Second step returns from mock process with `На рассмотрении`, pending flags and restrictions. Do not interpret the earlier funding-only KYC branch as the ordinary KYC path. |
| `79:714` KYC status /718 | If KYC pending, action1 sets `Подтверждена`; when verification combination is sufficient, accountState becomes `Активен` at3. Access recalculated at7–15. | Local fixture progresses pending → confirmed. No real KYC provider verified. |
| `79:726` KYB status /728 | Same structure for KYB. | Business still needs both KYC/KYB plus provider/account conditions. |
| `79:730` File /731 | Sets verificationFile=`документ.pdf`. | Fixture selection only, no OS upload or real file validation. |
| `79:735` resubmit /733 | Checks exact filename fixture at0; target=kyb at1. Valid assignment to KYB pending at2 or KYC pending at3, hides additional-doc action; invalid path15 prompts to choose file. | Verify empty-file error, selected filename, pending feedback and correct target. |
| `79:747` support:verification /735 | needsVerification routes with topic `Проверка данных` at5/branch0/action1; otherwise topic `Ограничения аккаунта` at10/branch0/action1. | H1 contextual support; not a money-action bypass. |

O3 close `257:445` must also be observed before external start and after it to distinguish cancellation from simulated completion. Persisted status and repeated status actions require their own observations.

## Fixture entry map for non-default branches

G0 `34:2` button `79:499` states:menu → O2 at action10. O2 categories: access `80:2183`, verification `80:2185`. The following are fixture navigation paths, not ordinary customer actions or proof of runtime reachability. Full trees include hundreds of resets before the destination and subsequent synchronization; keep source order.

| Fixture | Node / raw line | Destination action → frame |
| --- | --- | --- |
| authInvalid | `80:2195` /1516 |559 → A1|
| codeExpired | `80:2197` /1517 |564 → A3|
| sessionExpired | `80:2200` /1519 |558 → A1|
| duplicate | `80:2202` /1520 |589 → A2|
| registerTechnical | `80:2205` /1522 |589 → A2|
| blocked | `80:2207` /1523 |586 → D1|
| suspended | `80:2210` /1525 |586 → D1|
| closed | `80:2212` /1526 |586 → D1|
| kybPending | `80:2216` /1529 |593 → D1|
| kycPending | `80:2218` /1530 |593 → D1|
| kycDocs | `80:2221` /1532 |595 → D1|
| kybDocs | `80:2223` /1533 |595 → D1|
| kybDeclined | `80:2226` /1535 |594 → D1|
| kycDeclined | `90:453` /1612 |583 → D1|
| provider | `80:2228` /1536 |593 → D1|
| noLinks | `80:2231` /1538 |572 → L1 `34:977`|

The table locates every relevant fixture for the next pass; its destination is established, but every fixture's complete final variable vector has not been independently evaluated here. Do not relabel these as observed or accepted scenarios.

## Suggested bounded Present sequence

1. Existing D1 → logout text → A1; email login → A3 empty-code error → code fixture → D1; logout. Phone toggle → A3; inspect recipient label, early resend, countdown, ready/resend, error clearing and back.
2. A1 recovery → submit missing reply email → fill reply fixture → request completion → back; distinguish request from restored access. A3 access-help should use the same A4 reset.
3. Registration reset entry → personal blank-name/contact error → fill fields → A3 → back and check preserved values → confirm → D1 unverified. Open/close KYC overlay, then mock start/return → pending → status update → confirmed; inspect canMove before/after.
4. Fresh registration entry → business → verify organization fields and switching preservation → confirm → D1 → KYC and KYB separately. Inspect financial restrictions with only one confirmed and after both.
5. Scenario menu: expired/duplicate/technical; blocked/suspended/closed/provider; KYC/KYB docs/declined. For each, verify visible explanation, permitted primary action, attempted blocked money navigation and return. Separate this fixture-audit pass from ordinary customer paths.

No arbitrary typing rules, OTP expiry duration, resend rate limit, delivery integration, real upload formats, provider outcome semantics, recovery identity policy or backend credential changes are established by the saved prototype. These require explicit implementation contracts. This report is source guidance; runtime findings and independent saved-image review belong in separate evidence records.

## Follow-up — stale KYB explanation after confirmation

Main reported run03 capture48 with business KYB pending, then49 after the KYB status action: KYB is confirmed, KYC not started, heading «Требуется проверка», but the explanation still says organization documents were sent and their result will appear. This follow-up did not inspect the images; it checks the reported behavior against exact saved assignments.

The explanation is D1 text `79:701` (raw line706), whose TEXT_DATA is bound to `UX/accessReason [76:1927]` in both variableConsumptionMap and parameterConsumptionMap. Its raw placeholder text is not the runtime source. The heading is driven separately by `verificationHeading [44:7]`.

1. In the ordinary non-funding, already-started KYB return branch, O3 advance `80:2305` writes KYB=`На рассмотрении` at `actions/116/conditionalActions/0/actions/0`. When KYC=`Не начата`, `actions/118/conditionalActions/0/actions/0` sets accessReason to «Документы организации отправлены. Результат появится в блоке проверки организации. Пройдите также проверку личности.» The alternative119 omits the final KYC instruction when KYC is not in that initial state.
2. D1 KYB status `79:726` (line728) snapshots pending at0 and writes KYB=`Подтверждена` at `actions/1/conditionalActions/0/actions/0`.
3. Its action2 tests whether KYC is confirmed and business KYB is satisfied; accountState becomes active at3 only when that combination passes. With KYC still not started, that test is false. At7, the full canMove expression is also false; action9 sets the restricted permission indicators.
4. The **only** assignment to accessReason anywhere in this 37-action root handler is `actions/8/conditionalActions/0/actions/5`: «Проверки завершены. Финансовые операции доступны.» It runs only when the full canMove guard is true. The restricted branch9 does not write a replacement explanation.
5. The heading is reset unconditionally at17 to «Требуется проверка», then overridden for pending/documents/provider/account/fully-verified cases at19/21/23/25/27. After KYB confirmation with KYC not started, neither verification is pending and money movement remains blocked, so this heading can remain «Требуется проверка» while accessReason retains the old pending message.

This supports a stale-message discrepancy: status/heading are recomputed, but the explanation is left from the earlier submission when another verification still blocks access. It does not indicate that money movement was allowed. Keep this finding separate from the earlier fixed-recipient label and from actual backend verification behavior. No handler, variable or source file was changed.

## Run04 follow-up: document selection retains the prior warning (B00-019)

Read-only source check, 2026-11-03. This explains main's reported run04 observations 39→40→41 (KYC) and 44→45→46 (KYB); it does not replace their runtime screenshots or visual review.

- `79:730` **Field / File**, raw `decoded/nodes.jsonl.gz` line 731, has exactly one active root `prototypeInteractions[0]` ON_CLICK action: `actions/0` sets `verificationFile` (`33:106`) to literal `документ.pdf`. It neither clears nor updates `feedbackVisible` (`40:2`), `toastTitle` (`33:91`) or `toastBody` (`33:92`). No separate notice-reset action is present in this field's active root handler.
- `79:735` **Button / verify:resubmit**, raw line 733, `actions/0` computes `UX/flowGuard0` (`80:390`) as exact equality `verificationFile == "документ.pdf"`. `actions/1` distinguishes KYB through `UX/flowGuard1` (`80:391`), comparing the verification target with `kyb`.
- If the exact filename guard is false, `actions/15/conditionalActions/0/actions/0..2` writes `toastTitle = "Добавьте документ"`, `toastBody = "Выберите файл перед отправкой."`, `feedbackVisible = true`.
- After clicking the file preset, those three variables retain these previous values because `79:730` changes only the filename. This directly explains the warning still being visible beside a now-selected preset document in both KYC and KYB.
- On the next submit with the preset filename, `actions/14/conditionalActions/0/actions/0..2` replaces the notice with `"Документ отправлен"` / `"Повторная подача не требуется."` and keeps `feedbackVisible = true`; the false branch at action 15 does not run. This matches the subsequent observed success message.

Conclusion: the active source does **not** currently clear the notice on file selection. The observed persistence is therefore explained by the handler, rather than a missed click or a real upload failure. Whether to clear it immediately is a UX decision to record for later; no source or behavior was changed. The filename is a Figma preset, and this path provides no evidence of an actual upload or provider review.
