# Own-card funding — independent saved-source audit, 2026-11-03

Package 00 evidence for the own-card part of future package 07б. Static saved source only: no Present run, frontend/Figma mutation, backend verification or passed runtime tests. The separate card-number transfer and local methods remain separate bounded scenarios.

Sources: `figma-work/migration-baseline/raw/graph-ordered-actions.json.gz`, `hierarchy.json`, `product-properties.jsonl.gz`, `decoded/nodes.jsonl.gz`, `decoded/active-variables.json`. Paths start at `prototypeInteractions/0/actions`; `N/b0/M` means action N → conditionalActions/0/actions/M. Reactions below are active, not deleted. Full ordered reactions were read, including writes after navigation. Shared outcome/history details are also documented in `2026-11-03-bank-funding-source-audit.md`; those are source evidence, not inherited runtime acceptance.

## Canonical entry and category

Canonical frame `34:505` P1 / Fiat funding, primary `80:883` (raw line901, reaction `2560:432`). P0 row/button `80:767`/`80:771` reach P1 when canMove; paymentReturn=P0. Direct launcher button **`79:491` / start:fiatFunding**, raw line612, reaction `2761:1043`, is the repeatable source-defined reset entry. Its actions347–373 clear the payin slot and restore outcome=success; action14 and554 set isBusiness=false, action187 clears formError, action608 resets EUR12450, action650 navigates P1, then actions689–698 recompute eligible/default method. Do not stop reading at navigation: the final default is bank funding, so select own card afterward. An existing Present restart must be observed, not assumed to replay this button automatically. Active-personal launcher `79:480` / reaction2761:1041 also resets payin at347–373 but navigates Dashboard at690.

Category radio **`2550:453` / Со своей карты**, raw line8773, reaction **`2608:479`**: action0/b0 executes only when fundCard && fundCard && !cardCategorySelected. It selects `P1 / Method=Банковская карта`, displayed payment method «Карта», ETA «Будет указан при подтверждении», selectedCard=true, fundingCard=true, fundingBank=false, primary «Продолжить», then closes method menu. Re-clicking the selected category does not run that selection block: preserves the current subtype, including card-number transfer. Actions1–16 still recompute category/adjacent selection styles.

Card category group `2521:471` binds VISIBLE to `Meeting/459:572/Банковская карта [2521:478]`; it contains `2521:477` and the two distinct options. Card option **`2078:533`**, raw line3200, click reaction **`2608:488`**, actions0–24 make the same own-card selection without the category guard. Its own VISIBLE binding is fundCard `[2078:430]`; generic country/currency eligibility writes fundCard=!isBusiness. Category opacity alone is not a disabled-state proof. Pointer enter/leave reactions2608:489/490 only update hover.

Card selection writes IBAN/BIC fixture labels and values at14–17, but action18 overwrites receiveNumber with **«Карта выбирается на странице оплаты»**. FundingBank=false hides the instruction panel. Persisted BIC `NRBKDEB2` remains in a variable: check actual T2 details for leakage rather than asserting no stale bank field from variable state alone.

## Different paths sharing a category

- **Own card2078:533:** fundingCard=true; fundingBank=false; continuation O3 generic panel.
- **Transfer to card number2550:436**, raw line8758, reaction2608:491: Method «Перевод по номеру карты», display «Перевод на номер карты»; fundingCard=false, fundingBank=true, primary «Получить инструкции», receiveLabel «Номер карты», receiveNumber `4000 1234 5678 9021`, bankCodeLabel «Получатель», bankCode «Алексей Морозов». This is an instruction path, not the own-card payment-page path. Re-clicking the category retains it.
- Apple Pay2521:423 and Google Pay2521:434 belong to local methods, not the own-card pair. Do not include them merely because their handlers share fundingCard logic. Package07в owns local-method coverage.

## Primary, O3 and external return

Let G = canMove && !formError && !fundNone. P1 primary80:883 has353 ordered actions, shared by bank/card methods:

1. Actions0–8 unconditionally overwrite audit/funding snapshot; for own card bankInstructionsAvailable=false. Invalid or blocked submissions can overwrite this snapshot too.
2. Actions9–18 set detail labels, operationReturn=T1, canMove/formError guard snapshots and payinExists snapshot. Validation feedback15–17 is «Выберите доступный способ» plus formIssue.
3. Existing payin branch19–54 preserves ref/date/owner and saved complete/pending/unknown/applied/delta/outcome, but replaces current form amount/asset/fee/net/account/method/requisites; pending wording is assigned. Action54 navigates T2. This shares the **same payin slot as own-bank funding**, not an independent card record.
4. New branch55–87 creates payin OP-IN-002, pending=true, complete=false, unknown=false, applied=false, terminal=false; fixed date23 Oct2026 10:32 and delta247.5; serverOutcome=success. Display defaults are gross250,00 EUR, fee2,50 EUR, net247,50 EUR. Monetary strings are fixtures, not an arbitrary input/production pricing contract.
5. For G, action88 submitted=true;89 externalKind=**funding**;90 fundingDetailsVisible=fundingBank=false;91 externalGenericVisible=fundingCard=true;92 clears copy feedback;93 title «Продолжить пополнение»;95 body «Продолжите оплату выбранным способом на платёжной странице. Возврат в OraclePay сам по себе не подтверждает зачисление.»
6. Slot persistence185–212 stores payin. Action325/b0/0 overlays **34:1473 O3 / External process**, even after existing-branch navigation54. Later340 resets externalStarted=false;343 first assigns «К операции»; final352 overwrites button **«Перейти к оплате»** when fundingCard=true. Final runtime frame/overlay needs observation.

O3 primary **80:2305**, raw line1585, reaction **2384:440**: action0 flowGuard0=(externalKind==funding), so own-card funding takes branch67–69: hide feedback, derive fee visibility, **NAVIGATE T2 34:918 at69/b0/0**. It neither credits the balance nor sets complete nor calls an external URL. The later generic two-click mock block158–171 is guarded by !flowGuard0 && !externalStarted and therefore does **not** run for externalKind=funding. Own-card label «Перейти к оплате» thus leads directly to pending T2 in saved source; do not promise a separate payment-page/mock-return screen. Record the observed label/result discrepancy.

O3 X `257:445`/2160:875 and frame Escape34:1473/2160:874 only CLOSE; creation is retained. Backdrop dismissal is not established. T2 timeout2384:471 sets showFundingInstructions=(slot==payin && !complete && bankInstructionsAvailable); own-card sets that last flag false. Therefore bank instruction link2384:467 should be absent for a clean own-card attempt. Existing bank→card submission can change the same snapshot and operation: isolate this probe from clean first creation.

## Outcome, history and error boundaries

T2 check **80:1549**, reaction2761:1127, applies the prototype scenario outcome. Success actions0–12 credit delta once when !opApplied, later133 assigns external ref PZ-261023-PAYIN-002, complete=true/pending=false/terminal=true, persists payin at153. O3 arrival itself remains pending. Reopening completed row must retain same ref/amount/account/status and no extra credit. Check container80:1548 is opPending-bound, so terminal states may hide repeat check.

Same handler covers failed/declined/cancelled/expired terminal non-complete statuses; unknown/technical/loading remain pending with «Уточняем статус»/«Не удалось обновить статус»/«Получаем данные». This audit does not establish a visible own-card UI control selecting these outcomes. Do not manipulate hidden variables or report negative outcomes tested without a reachable fixture/launcher. CHF credit action7/b0/0 has empty targetVariableData: unresolved source behavior.

D1 row80:573 loads saved payin and sets operationReturn=D1 before T2. Visibility depends on exists plus retained account/status/direction/query filters; one missing row does not establish missing storage. P1 submission sets operationReturn=T1; T2 back2020:534 routes accordingly. P1 back301:285 preserves its separate paymentReturn and cardFundingReturn precedence. These contexts must be retained rather than replaced with unconditional P0 navigation.

## Bounded Present recipe

1. Use actual restart/launcher G0; click fiat-funding launcher79:491. Record starting balance, defaults, locale and session URL. Choose «Со своей карты»2550:453; capture selected category, «Карта», amount/fee/net and «Продолжить». Re-click category; verify retained subtype/values. Keep card-number and local methods outside this run.
2. Continue80:883. Capture O3 dimming, exact title/body/primary, absence of bank instruction panel/IBAN/copy controls. Close X; confirm P1 retained. Re-enter and observe same OP-IN-002 versus second record, including actual final frame after all ordered actions.
3. Click O3 «Перейти к оплате». Capture actual destination and pending status. Do not describe a provider page unless one appears. Balance should remain unchanged until the visible status-check transition. Confirm instruction link absent in clean own-card path and inspect T2 requisites for stale BIC leakage.
4. Back→T1; find same operation with neutral filters; reopen and compare method/amount/fee/net/account/status. Separately D1 row should return D1. Capture preservation of filters.
5. Check status once; record completion and balance. Reopen saved operation, verify same record and no second credit. Reset through actual launcher before any independent card-number/local-method run.
6. Separate contamination probe after bank run05: enter own-card with existing payin; compare same ref and overwritten method/requisites versus retained result flags. Do not merge this into clean success evidence. If accessible error fixture exists, run one bounded outcome after a fresh reset and document the actual entry.

No runtime/keyboard/clipboard/mobile/provider/backend/idempotency or independent human usability checks were performed. This document is a source map and a run recipe; package acceptance remains open.
