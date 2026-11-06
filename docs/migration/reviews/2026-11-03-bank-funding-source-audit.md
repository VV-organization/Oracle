# Bank funding — independent saved-source audit, 2026-11-03

Package 00 only. This is static evidence from the saved baseline, not an observed Present run, backend contract, or implementation approval. No UI/Figma actions, frontend changes, or shared-ledger edits were performed.

## Sources and notation

Sources under `figma-work/migration-baseline/raw/`: `graph-ordered-actions.json.gz`, `hierarchy.json`, `product-properties.jsonl.gz`, `decoded/nodes.jsonl.gz`, `decoded/active-variables.json`. Action paths below start at `prototypeInteractions/0/actions`; `N/b0/M` means action N → `conditionalActions/0/actions/M`. All cited reactions are active (`isDeleted=false`). Complete action trees, including actions after navigation, were inspected. Variable names identify the active-variable GUIDs; saved defaults are distinguished below from handler writes.

Canonical journey: `34:431` P0 → `34:505` P1 → **overlay `34:1473` O3 / External process** → `34:918` T2 → history. Do not substitute standalone `2363:687` P1c / Bank funding instructions: its copied controls contain extensive fixture resets that do not belong to the canonical O3 controls.

## Entry, controls and return context

| Role | Active node / reaction | Raw JSONL line | Source behavior |
|---|---|---:|---|
| P0 funding row | `80:767` / `2160:336` | 836 | Action 1 snapshots canMove; 2/b0 sets feedback false, paymentReturn=P0, NAVIGATE P1. Blocked branch 3 recalculates history and navigates D1. |
| P0 row button | `80:771` / `2160:339` | 840 | Same permitted destination at 1/b0/2, blocked D1 at 2/b0/13. |
| P1 main | `80:842` / `2160:379`, `2160:380` | 877 | Click/Escape close all dropdown variables; not a form reset. |
| Amount field | `80:865` / `2160:416` | 890 | Click clears formError/formIssue/formCorrection/feedback; there is no arbitrary monetary input action in this handler. |
| Currency trigger | `478:304` | 2368 | Toggles fiatMenu after closing other menus. |
| Country trigger | `2001:302` | 2402 | Toggles P1 Country list open; closes method menus. |
| Method trigger | `459:569` | 2335 | Toggles P1 Payment method open; closes country/currency and other menus. |
| Primary | `80:883` / `2560:432` | 901 | Full 353-action tree described below. |
| P1 back | `301:285` / `2628:1199` | 2256 | Card fundingReturn takes precedence (actions 0–12); otherwise paymentReturn D1 → D1 at29/b0/0, P0 → P0 at33/b0/0. Other retained origins have their own branches; do not replace with an unconditional P0 link. |
| O3 close | `257:445` / `2160:875` | 2182 | CLOSE only, no variables reset. |
| O3 Escape | `34:1473` / `2160:874` | 253 | CLOSE only. Backdrop closing is not established by these handlers. |
| O3 copy | `257:472` / `2160:876` | 2204 | fundingCopyLabel=«Реквизиты скопированы», feedbackVisible=false. No clipboard API proof. |
| O3 primary | `80:2305` / `2384:440` | 1585 | Funding branch 67–69 hides feedback, derives fee visibility, NAVIGATE T2. Does not credit balance or complete payin. |
| T2 instruction link | `2384:467` / `2384:469` | 7668 | Restores saved audit/funding snapshot then OVERLAY O3 at15. |
| T2 status check | `80:1549` / `2761:1127` | 1250 | Applies scenario outcome and persists slot; detailed below. |
| D1 payin row | `80:573` / `2176:284` | 787 | Loads saved UX/payin fields, operationReturn=D1 at1; NAVIGATE T2 at33, further derived-state writes at34–37. |

T2 back `2020:534` (`2160:657`, line2628) routes by operationReturn: D1 at1/b0/12, T1 at2/b0/12, L3 at3/b0/0, fallback T1 at4/b0/12. D1/T1 branches recompute visibility using retained filters rather than resetting them. P1 primary explicitly sets operationReturn=T1, even when form was reached from P0/D1. Thus form back and operation back have different source contexts.

## Currency, country and method choices

Saved defaults: EUR, Germany, SEPA; amount250,00 EUR, fee2,50 EUR, net247,50 EUR. The variable named `copy/fiatZeroFee [2017:413]` is **not zero**. `UX/payinExists [76:2108]`, Visible, Complete, Pending and Applied all default false; payinRef defaults empty; payinOutcome defaults success. These are not proof of the current running session, whose launcher or previous actions may have assigned them.

Currencies EUR `478:309` (line2371), USD `478:312` (2373), GBP `478:315` (2375), CHF `478:318` (2377) set respective WAL-{currency}-001, 250 gross /2.50 fee /247.50 net and then recompute eligibility/method. Initial default-method writes at51 (EUR/USD) or45 (GBP/CHF) are overwritten by later branches77–79 or71–73. Read final method after those branches, not the first assignment.

Country options: Germany `2001:306`, Austria `2001:308`, Netherlands `2001:310`, Switzerland `2001:312`, USA `2078:493`, Egypt `2521:445`, China `2521:454`, Benin `2610:427`, Botswana `2610:438`, DR Congo `2610:449`, Congo–Brazzaville `2610:460`, Côte d’Ivoire `2610:471`. The generic country handlers set selected country, close list, compute eligibility and select a default method. France appears in eligibility expressions but no France option was found among the active P1 country nodes; do not silently replace Netherlands with France.

Generic eligibility and final default selection (e.g. Germany handler actions11–20):

- SEPA eligible when currency EUR and country Germany/Austria/**France**.
- Local bank eligible when USD+USA.
- Card eligible when NOT isBusiness.
- SWIFT eligible unless GBP+USA.
- Generic writes set fundNone=false, fundMultiple=true, fundSingle=false; these are assignments, not a computed count of visible methods.
- Default precedence: USD+USA → local bank; otherwise EUR+Germany/Austria/France → SEPA; otherwise SWIFT. Consequently GBP+USA can assign SWIFT while its eligibility flag is false: inspect this as a source inconsistency, not an approved offer.

SEPA `459:573` (`2608:482`, line2338) writes method, ETA «До 1 рабочего дня», bank=true/card=false, IBAN `DE62 7814 2060 0083 7419 52`, BIC `NRBKDEB2`. SWIFT `459:575` (`2608:485`, line2340) uses the same fictional IBAN/BIC, ETA «До 3 рабочих дней». Local `2078:540` (line3207) uses account `000123456789`, bank code `021000021`; default ETA «Будет указан при подтверждении». Country and currency handlers also update adjacent P2/P3 method data, so they are not isolated P1 state setters.

Bank radio `2550:446` (`2608:478`, line8767) chooses eligible SEPA first, otherwise SWIFT, only when bank category was not selected; group expansion `2521:464` is separate. Other method nodes remain distinct: Card `2078:533`, Apple Pay `2521:423`, Google Pay `2521:434`, Alipay `2550:416`, WeChat Pay `2550:426`, transfer-to-card-number `2550:436`.

Product visibility bindings confirm SEPA→fundSepa, SWIFT→fundSwift, local→fundLocal, card/card-number→fundCard, Alipay/WeChat→Meeting/China selected. Apple/Google have no direct VISIBLE binding on their option node; parent visibility must also be considered. Existence of an active click handler does not prove the option is reachable in every context.

## Ordered primary handler: create, reuse and overwrite

For brevity G=`canMove && !formError && !fundNone`. Conditions are stored as separate actions, not one atomic transaction.

1. **Actions0–8 run unconditionally**, before G: overwrite `audit/bankInstructionsAvailable [2384:455]` and `audit/funding/* [2384:456–463]` from current form. Even a blocked/invalid attempt can alter the snapshot used by a previously existing operation.
2. Actions9–18 run when !fundNone: labels, operationReturn=T1, guards canMove/formError, validation feedback and snapshot of payinExists into flowGuard2.
3. If G and existing payin: actions19–52 reuse saved type/ref/date/owner, complete/pending/unknown/applied/delta/outcome, **but overwrite asset/amount/fee/total/account/requisites/method/ETA from the current form**; status text becomes «Ожидаем поступление», explanation/effect become waiting text. Action54/b0/0 NAVIGATEs T2. This is not a compare-by-amount/currency idempotency key.
4. If G and no payin: actions55–87 establish pending=true, unknown=false, complete=false, applied=false, terminal=false; slot=payin, ref=**OP-IN-002**, owner=current owner, account/current displayed form values, fixed date23 Oct2026 10:32, serverOutcome=success. Numeric delta is fixed **247.5** at76, independently of the displayed string. Action85 first sets submitted=false, then action88 overwrites it true.
5. Actions88–96 run for G on either branch: submitted=true, kind=funding, detail/generic visibility from selected method, copy feedback empty, instruction title/body.
6. Actions97–324 successively test each opSlot and persist the operation to its one named session slot. Payin segment:185 recalculates flowGuard2=(opSlot==payin), 186 sets payinExists=true,187 Visible=true,188–212 copy all current operation fields and flags into UX/payin. Thus an existing slot can be rewritten with current form data while retaining its ref and old flags.
7. **Action325/b0/0 OVERLAYs O3 for G on both branches, including after existing-branch NAVIGATE at54.** Runtime must decide the final observed result; do not assume navigation stops the handler. Actions326–339 are blocked-access feedback/visibility/D1 navigation. Actions340–352 continue deriving started/button label/fee/gross state. Final funding button label becomes «К операции» unless fundingCard then «Перейти к оплате».

There is one payin storage slot and fixed OP-IN-002. Repeating the entry is structurally prevented from appending a second independent record, but this is not backend idempotency and does not ensure identity or amounts remain immutable. After a completed payin, repeating form submission can combine saved complete/applied flags with newly assigned pending text and different asset/account. Record the discrepancy; do not silently implement it as business policy.

## Pending, history, reopening and status checks

O3 «К операции» funding branch preserves pending state: it only changes feedback/fee visibility and navigates. O3 close preserves the created slot; closing instructions is not cancel/delete. Funding instructions panel binds to fundingDetailsVisible.

T2 frame `34:918`, reaction `2384:471` (line241), AFTER_TIMEOUT≈0.01s: `audit/showFundingInstructions = slot==payin && !opComplete && audit/bankInstructionsAvailable`. Link2384:467 visibility binds to this variable. Reopening restores snapshot fields at0–7, sets kind/title/body/details visible, generic hidden, button «К операции», started=false, then overlays O3 at15. It does not explicitly clear fundingCopyLabel: copy feedback can persist after reopening. It also does not create a new payin or credit balance.

History row80:573 copies saved payin data, not current P1 fields. Visibility requires exists; selected account matches/all; status all or pending+payinPending or complete+payinComplete; direction all or in+positive delta; query empty or exact ref or exact recipient. A missing row can therefore be filtering rather than lost creation. Compare ref, amount, status and account, not row count alone.

T2 check80:1549 has a large outcome tree; it is a prototype scenario transition, not a real provider request:

- Actions0–12: if outcome=success and !opApplied, add delta once to the matching currency balance, then applied=true. Success branch later assigns external ref `PZ-261023-PAYIN-002` (133/b0/0), status «Выполнена», pending=false, unknown=false, complete=true, terminal=true, ETA completed at142; effect credit available when delta>0. Payin persistence153/b0 copies results/flags. Guard snapshot prevents repeated credit in the same retained state.
- failed/declined/cancelled/expired branches produce terminal non-complete statuses «Не выполнена»/«Отклонена»/«Отменена»/«Срок истёк» and pending=false. unknown/technical/loading produce «Уточняем статус»/«Не удалось обновить статус»/«Получаем данные» with pending=true. Each outcome has its own slot persistence; following history must show the same saved result.
- Actions container80:1548 is visible through opPending; the check button is hidden when terminal. To verify double-credit prevention, re-open the completed row and inspect balance rather than expecting a visible repeat-check control.

The check handler’s CHF action7/b0/0 has empty targetVariableData in the saved raw source (unlike other currency addition expressions). Treat CHF credit as unresolved source behavior; do not infer a correct numeric update. All arithmetic is prototype fixture logic, not a production financial calculation contract.

## Bounded Present recipe for main-agent run05

Use a known restart/launcher state and record its actual initial data; do not modify variables through hidden tools. Screenshot each transition and retain frame URL/session context.

1. P0: capture own-bank funding versus IBAN receiving catalog entries; click own-bank row/button. P1: capture EUR/Germany/SEPA, gross/fee/net and initial balance context. Back→P0, re-enter: verify form return and data.
2. Open each of currency/country/method lists once; capture expanded choices, select Austria then Netherlands and observe SEPA→SWIFT distinction. Restore Germany/EUR/SEPA. Click amount and determine whether it merely clears validation or permits actual typing; do not claim arbitrary input from visual appearance.
3. Get instructions: capture final frame/overlay after full reaction, dimming, values/ref/button. Copy once, capture adjacent feedback. Close icon: inspect retained form. Click primary again; capture whether existing branch ends at T2+O3 and whether same OP-IN-002 survives.
4. Click «К операции»: capture T2 pending with same amount/fee/net/account/status. Reopen instructions, compare all values; note retained copy feedback. Test Escape; separately observe backdrop behavior.
5. T2 back should reach T1 for form submission. Find OP-IN-002 with neutral filters, open, compare pending identity. Back preserves history filters; D1 row entry should set return D1 independently.
6. Return to T2 and run visible status check once. Capture outcome and balance; revisit same history row: same ref/status, no second credit. Do not assert real funds/provider confirmation.
7. Separate bounded negative probe: with payin already present, return P1 and change currency/country before primary; capture ref, amount/account, flags visible and reopened instructions. After completed state, repeat only if the source inconsistency needs isolation. Treat differences as evidence, not intended policy.

No runtime, keyboard focus-trap, arbitrary input, clipboard contents, mobile layout, independent human usability, backend idempotency or external confirmation was verified by this static audit. Run05 evidence must be linked separately before package acceptance.

## Runtime handoff reported by main agent (not independently observed here)

Main reports run05 steps17–24: first primary opens O3 over P1; X returns P1; P1 back returns P0; D1 shows new OP-IN-002 pending and EUR12450 unchanged; history details pending; reopening instructions retains «Реквизиты скопированы» from the earlier copy. This agrees with source reset asymmetry: copy257:472 action0 sets `fundingCopyLabel [210:538]`; close257:445 and Escape34:1473 only CLOSE; reopen2384:467 actions0–15 never assign210:538. Initial P1 primary80:883 action92/b0/0 does clear210:538 when G succeeds. Run05 media and acceptance remain the main agent’s responsibility.

## Source confirmation after run05: B00-020 and B00-022

Reviewed the completed independent visual report `docs/migration/reviews/2026-11-03-run05-visual-review.md` (01–41), integrator RESULTS36–41 and discrepancy entries B00-020–023. Their claims agree with the saved-source findings above. This comparison reads the independent report and main-agent handoff; it is not an independent replay or direct observation of runtime variables. Integrator and shared discrepancy ledger were not changed in this follow-up.

**B00-020, completed-operation overwrite.** Main agent and independent visual report describe run05/32–35 as completed OP-IN-002 with credited EUR12697.50; after selecting SWIFT and obtaining instructions36–39, the same ID/date/service reference show waiting text, and40–41 retain that waiting text without a second balance increase. Exact source support: `80:883` reaction `2560:432` snapshots payinExists at18; existing branch copies saved ref21, external33, date34, complete37, pending38, unknown39, applied40 and delta41, while method28 and ETA42 come from the current form, status29 is overwritten with «Ожидаем поступление» and effect32 with «Деньги ещё не поступили». The later payin-slot writes185–212 persist the combined state. This explains how old completed/applied flags and old provider reference can coexist with new SWIFT/waiting presentation. In particular, retained pending=false explains why the check-action container bound to opPending can be absent while the heading says waiting. These are prototype source assignments, not evidence of backend behavior or an approved rule for new funding requests.

**B00-022, instruction-link visibility after completion.** T2 entry reaction `2384:471` computes `audit/showFundingInstructions [2384:454]` from `slot==payin && !opComplete && audit/bankInstructionsAvailable` after approximately10ms. The link `2384:467` binds VISIBLE to that variable. Status check `80:1549` reaction `2761:1127` sets opComplete=true in its success branch142/b0/4 and persists it, but its complete action tree does not assign audit/showFundingInstructions. Therefore the saved source supports a stale entry-derived visibility value after in-place completion, followed by recomputation on re-entry. Reported runtime32 has the link immediately after completion and34 lacks it after reopening, consistent with that mechanism. The intended availability policy remains unresolved; no source change was made.

B00-021 is independently supported by the exact missing reset described above (reopen does not clear210:538, primary does). B00-023 is correctly scoped to the visible single-SWIFT selection styling and the generic fundMultiple/fundSingle assignments; no separate click behavior or product eligibility approval is established by that finding. RESULTS40 correctly maps to T1 regardless of the image filename, and RESULTS41 maps to D1 with the reported repeated B00-015 outline/history discrepancy.
