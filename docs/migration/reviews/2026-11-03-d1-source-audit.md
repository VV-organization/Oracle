# D1 independent static source audit — 2026-11-03

Read-only source check for package 00. No Figma or UI edits and no runtime assertions. This report maps the saved baseline; the main agent must compare it with the fresh Present walkthrough.

## Sources and reference convention

All paths below are under `figma-work/migration-baseline/raw/`: `d1-interaction-inventory.json`, `hierarchy.json`, `graph-index.json`, `graph-ordered-actions.json.gz`, and `decoded/nodes.jsonl.gz` via `decoded/query.py`. Node/reaction IDs and raw JSONL line numbers identify the exact source. Every action path below is relative to reaction `prototypeInteractions/0`; ordered action trees are retained in `graph-ordered-actions.json.gz` for that node/reaction. Deleted reactions were checked: every listed reaction is active (`isDeleted=false`).

## All 18 account money actions

Every destination below is `NAVIGATE`, guarded by `UX/canMove [76:1918]` at branch 0; the following else branch has no actions. Do not assume the guard is true or that preceding variable assignments are harmless. Follow the complete ordered tree when comparing context and blocked states.

| Account/action | Node (reaction; raw line) | Destination | Ordered destination path |
|---|---|---|---|
|  EUR / Пополнить | `2709:861` (2761:1004; line 11120) | `34:505` P1 / Fiat funding | `actions/312/conditionalActions/0/actions/0` |
|  EUR / Перевести | `2709:866` (2761:1005; line 11125) | `34:653` P4 / Send bank transfer | `actions/312/conditionalActions/0/actions/0` |
|  USD / Пополнить | `2723:972` (2761:1008; line 12934) | `34:505` P1 / Fiat funding | `actions/312/conditionalActions/0/actions/0` |
|  USD / Перевести | `2723:977` (2761:1009; line 12939) | `34:653` P4 / Send bank transfer | `actions/312/conditionalActions/0/actions/0` |
|  GBP / Пополнить | `2723:991` (2761:1012; line 12951) | `34:505` P1 / Fiat funding | `actions/306/conditionalActions/0/actions/0` |
|  GBP / Перевести | `2723:996` (2761:1013; line 12956) | `34:653` P4 / Send bank transfer | `actions/306/conditionalActions/0/actions/0` |
|  CHF / Пополнить | `2723:1010` (2761:1016; line 12968) | `34:505` P1 / Fiat funding | `actions/306/conditionalActions/0/actions/0` |
|  CHF / Перевести | `2723:1015` (2761:1017; line 12973) | `34:653` P4 / Send bank transfer | `actions/306/conditionalActions/0/actions/0` |
|  USDC / Пополнить | `2709:940` (2761:1020; line 11137) | `34:706` P5 / Crypto deposit | `actions/126/conditionalActions/0/actions/0` |
|  USDC / Перевести | `2709:945` (2761:1021; line 11142) | `34:756` P6 / Crypto withdrawal | `actions/126/conditionalActions/0/actions/0` |
|  BTC / Пополнить | `2723:1374` (2761:1024; line 12988) | `34:706` P5 / Crypto deposit | `actions/126/conditionalActions/0/actions/0` |
|  BTC / Перевести | `2723:1379` (2761:1025; line 12993) | `34:756` P6 / Crypto withdrawal | `actions/126/conditionalActions/0/actions/0` |
|  ETH / Пополнить | `2723:1393` (2761:1028; line 13005) | `34:706` P5 / Crypto deposit | `actions/126/conditionalActions/0/actions/0` |
|  ETH / Перевести | `2723:1398` (2761:1029; line 13010) | `34:756` P6 / Crypto withdrawal | `actions/126/conditionalActions/0/actions/0` |
|  SOL / Пополнить | `2723:1412` (2761:1032; line 13022) | `34:706` P5 / Crypto deposit | `actions/126/conditionalActions/0/actions/0` |
|  SOL / Перевести | `2723:1417` (2761:1033; line 13027) | `34:756` P6 / Crypto withdrawal | `actions/126/conditionalActions/0/actions/0` |
|  XRP / Пополнить | `2723:1431` (2761:1036; line 13039) | `34:706` P5 / Crypto deposit | `actions/126/conditionalActions/0/actions/0` |
|  XRP / Перевести | `2723:1436` (2761:1037; line 13044) | `34:756` P6 / Crypto withdrawal | `actions/127/conditionalActions/0/actions/0` |

## All-history entry and D1 row operations

The all-history link is `2723:1800` (2723:1808; line 13262) → `34:859` (T1), `actions/13`, unconditional. Actions 0–12 precede navigation and recalculate visibility; it is not proof that all filters reset. Compare the visible account/search/status/direction context in Present.

| D1 row | Node (reaction; raw line) | Destination and exact action path / guard |
|---|---|---|
| Transaction row / record:qr | `154:554` (2320:889; line 1742) | `2320:738` Q3 / QR payment result at `actions/33`; unconditional |
| Transaction row / record:phone | `154:561` (2279:379; line 1749) | `2274:850` N3 / Phone transfer result at `actions/33`; unconditional |
| Transaction row / record:bank | `80:558` (2176:281; line 772) | `34:918` T2 / Operation details at `actions/35`; unconditional |
| Transaction row / record:payout | `80:563` (2186:262; line 777) | `34:918` T2 / Operation details at `actions/35`; unconditional |
| Transaction row / record:withdraw | `80:568` (2252:343; line 782) | `2241:399` P6b / Crypto transfer result at `actions/33`; unconditional |
| Transaction row / record:payin | `80:573` (2176:284; line 787) | `34:918` T2 / Operation details at `actions/33`; unconditional |
| Transaction row / record:iban | `80:578` (2176:285; line 792) | `34:918` T2 / Operation details at `actions/33`; unconditional |
| Transaction row / record:deposit | `80:583` (2263:425; line 797) | `2241:488` P5a / Crypto received at `actions/41/conditionalActions/0/actions/0`; UX/depositComplete [76:2180]<br>`2263:354` P5b / Crypto awaiting network confirmation at `actions/41/conditionalActions/1/actions/0`; else |
| Transaction row / history:crypto | `401:301` (2263:423; line 2323) | `2241:488` P5a / Crypto received at `actions/36`; unconditional |
| Transaction row / history:unknown | `80:593` (2761:1048; line 807) | `34:918` T2 / Operation details at `actions/483`; unconditional |
| Transaction row / history:completed | `80:588` (2176:289; line 802) | `34:918` T2 / Operation details at `actions/28`; unconditional |

Rows assign operation data before navigation and may assign more after it. For example QR uses navigation at action 33 but continues through 37; do not cut the recipe at navigation. Row visibility depends on selected account and session data; this table does not assert that all rows are visible together or that filtering leaves operation data unchanged. `record:bank` explicitly sets `navigation/operationReturn [248:313]` to `D1` before navigating. Verify every clicked row identity, amount, status and context against its returned details.

## Detail back controls

All six detail families reached above have the same four destination guards using `navigation/operationReturn [248:313]`. Order matters: these are separate conditional actions, not an assumed router.

| Detail screen | Back node (reaction; raw line) | Ordered destinations and guards |
|---|---|---|
| `34:918` T2 / Operation details | `2020:534` (2160:657; line 2628) | `34:262` at `actions/1/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], D1)<br>`34:859` at `actions/2/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], T1)<br>`34:1086` at `actions/3/conditionalActions/0/actions/0` if EQUALS(navigation/operationReturn [248:313], L3)<br>`34:859` at `actions/4/conditionalActions/0/actions/12` if NOT(OR(EQUALS(navigation/operationReturn [248:313], D1), EQUALS(navigation/operationReturn [248:313], T1), EQUALS(navigation/operationReturn [248:313], L3))) |
| `2241:399` P6b / Crypto transfer result | `2241:420` (2160:657; line 5455) | `34:262` at `actions/1/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], D1)<br>`34:859` at `actions/2/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], T1)<br>`34:1086` at `actions/3/conditionalActions/0/actions/0` if EQUALS(navigation/operationReturn [248:313], L3)<br>`34:859` at `actions/4/conditionalActions/0/actions/12` if NOT(OR(EQUALS(navigation/operationReturn [248:313], D1), EQUALS(navigation/operationReturn [248:313], T1), EQUALS(navigation/operationReturn [248:313], L3))) |
| `2241:488` P5a / Crypto received | `2241:509` (2160:657; line 5513) | `34:262` at `actions/1/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], D1)<br>`34:859` at `actions/2/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], T1)<br>`34:1086` at `actions/3/conditionalActions/0/actions/0` if EQUALS(navigation/operationReturn [248:313], L3)<br>`34:859` at `actions/4/conditionalActions/0/actions/12` if NOT(OR(EQUALS(navigation/operationReturn [248:313], D1), EQUALS(navigation/operationReturn [248:313], T1), EQUALS(navigation/operationReturn [248:313], L3))) |
| `2263:354` P5b / Crypto awaiting network confirmation | `2263:375` (2263:421; line 5743) | `34:262` at `actions/1/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], D1)<br>`34:859` at `actions/2/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], T1)<br>`34:1086` at `actions/3/conditionalActions/0/actions/0` if EQUALS(navigation/operationReturn [248:313], L3)<br>`34:859` at `actions/4/conditionalActions/0/actions/12` if NOT(OR(EQUALS(navigation/operationReturn [248:313], D1), EQUALS(navigation/operationReturn [248:313], T1), EQUALS(navigation/operationReturn [248:313], L3))) |
| `2274:850` N3 / Phone transfer result | `2274:871` (2160:657; line 5942) | `34:262` at `actions/1/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], D1)<br>`34:859` at `actions/2/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], T1)<br>`34:1086` at `actions/3/conditionalActions/0/actions/0` if EQUALS(navigation/operationReturn [248:313], L3)<br>`34:859` at `actions/4/conditionalActions/0/actions/12` if NOT(OR(EQUALS(navigation/operationReturn [248:313], D1), EQUALS(navigation/operationReturn [248:313], T1), EQUALS(navigation/operationReturn [248:313], L3))) |
| `2320:738` Q3 / QR payment result | `2320:759` (2320:886; line 6561) | `34:262` at `actions/1/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], D1)<br>`34:859` at `actions/2/conditionalActions/0/actions/12` if EQUALS(navigation/operationReturn [248:313], T1)<br>`34:1086` at `actions/3/conditionalActions/0/actions/0` if EQUALS(navigation/operationReturn [248:313], L3)<br>`34:859` at `actions/4/conditionalActions/0/actions/12` if NOT(OR(EQUALS(navigation/operationReturn [248:313], D1), EQUALS(navigation/operationReturn [248:313], T1), EQUALS(navigation/operationReturn [248:313], L3))) |

The D1/T1 back branches perform twelve visibility assignments before their destination action; they must be compared with the original row set and filter, not just the page title. Required observable check: select an account → open a visible row → use its back arrow → same account selection and filtered history. Repeat after all-history navigation with its own origin.

## Selected EUR → requisites → close

- EUR account selection: `2709:857` (2761:1003; line 11116). It has no explicit destination edge: selecting the card must change selection/history in place, not invent an account page. Compare amount, selection outline and row identities before opening requisites.
- Requisites: `2723:915` (2761:1006; line 12925) → `2734:958` overlay, unconditional `actions/21`, after actions 0–20 populate bank/context fields and reset copy feedback. Saved values include EUR IBAN `DE62 7814 2060 0083 7419 52`, BIC `NRBKDEB2`, Nordrhein Bank. Opening the overlay does not assign the history filter variables referenced by selection.
- Close: `2734:962` (2160:879; line 14216) has `actions/0` of connection type `CLOSE`, with no variable assignments or destination. This supports an expectation that closing preserves the underlying EUR selection; runtime preservation still needs observation.
- Compare selected EUR, balance, filtered row identities and scroll position before and after the close icon. Confirm copy labels clear on fresh open and no stale USD/other context appears. Escape and backdrop behavior need separate observation; absence of destination edges is not evidence of either.

## Limits / independent coverage result

18/18 money actions and the all-history entry were mapped, plus all 11 interactive D1 row sources and six corresponding detail-back controls. No static destination was inferred from screen names. This review does not validate runtime condition evaluation, event propagation, keyboard/focus, timers, arbitrary input, monetary submission, or updated cloud revisions. Guarded navigation and assignments must be observed in Present; no package acceptance follows from this report.

## Follow-up: history → sidebar Main discrepancy

The main agent reported Present run02 step09 (`evidence/run-02/09-main-after-history.jpg`): EUR outline remained selected after EUR+Completed history → sidebar Main, while the title became «Последние операции по всем счетам» and USDC rows appeared. This is a reported live observation, not independently viewed here.

The source supports a concrete inconsistency candidate. D1 sidebar `2709:1284` (raw line 11203, reaction 0) sets `UX/filterAccount [76:1970]` to `all` at `actions/0`, `UX/filterStatus [76:1971]` to `all` at 1, direction `[76:1972]` to `all` at 5, and search `[76:1968]` to empty at 6. Its complete ordered tree references no `2018:*` variables. However, `product-properties.jsonl.gz`, node `2709:857`, binds all four EUR border weights to separate float variable `2018:426` through both variableConsumptionMap and parameterConsumptionMap. The account click handler writes those border variables, while this sidebar handler does not. Thus the filter reset and border state are separate mechanisms; stale EUR outline is consistent with that separation. Keep this as a source discrepancy and preserve evidence; do not silently fix the prototype or interpret outline as authoritative filter state.
