# Run02 — independent ledger integration review

2026-11-03. Read-only check of integrated evidence and ledgers. Only this report was written. No Figma, UI, source ledger or coverage file was edited. This accepts ledger consistency for the checks below; it does not accept complete payment flows or package 00.

## Verified counts and evidence integrity

- `evidence/run-02/` contains 52 JPG files. Its `observations.json` has 48 observed records and four non-acceptance captures, exactly matching their corresponding objects in `states.json`.
- 14/17 are `transient-capture`; 29/30 are `unsuccessful-navigation-attempt`. None is included in the 67 observed states or runtime coverage rows.
- Combined `states.json` contains 69 saved frame states + 67 observed states + four non-acceptance captures = 140 evidence records. There are 71 native JPG captures (19 first-run + 52 run02) and 69 PNG frame exports. `source.json` reports the same counts.
- All 140 state IDs, evidence paths and manifest paths are unique. Manifest paths exactly equal the state evidence path set. All files exist; independently recomputed SHA-256 and byte sizes match every manifest record.
- Hashes are not all unique, and should not be described as such: `screens/478-300.png` and `screens/478-321.png` are byte-identical; run02 `50-back-from-xrp-fund.jpg` and `52-back-from-xrp-transfer.jpg` are byte-identical. Separate records/paths are legitimate; identical pixels are not independent evidence of different state content.
- All `previousObservedStateId` references resolve. All `screens.json` state IDs resolve, match the parent screen's source node ID, and total 67 references.
- `coverage.csv` has 248 unique coverage IDs: 181 role-inventory rows and 67 state-observation rows. Every observed state has a coverage row; all four non-acceptance records are excluded. Every coverage evidence path exists. Screen inventory has 181 unique IDs.

## Selected semantic cross-checks

Compared integrated `observedResult` records with the independent saved-image review `2026-11-03-run02-visual-review.md` and the prior source audit. No new screenshot inspection or click replay was performed for this integration review.

| Records | Integration check |
| --- | --- |
| 01–02 | EUR receiving details and close preserve selected EUR/history; consistent with the independent image review and source expectation. |
| 03–08 | All-history retains EUR; OP-IN-002 pending and OP-IN-001 credited remain distinct operations; completed-details back preserves EUR + Completed. No claim that one operation changed status. |
| 09 | General history/USDC rows coexist with EUR outline. Recorded as B00-015, not as successful filter preservation or a repaired behavior. |
| 14/15, 17/18 | Transitional captures excluded from acceptance; settled states retained separately. |
| 26–28 | CHF insufficient-funds error and correction remain on the form; not accepted as completed transfer. |
| 29–32 | Two unsuccessful return captures remain separate from the eventual observed CHF return after scrolling. Event interception cause is not represented as proven. |
| 33–34 | Pending USDC operation was already visible at09; entry to receiving instructions is not represented as creating a deposit. |
| 51 | Empty XRP destination tag is recorded with no claim of successful validation or withdrawal. |

`progress.md`, `discrepancies.md`, baseline README and source status retain the partial-work boundary. B00-015 explicitly remains open. The discrepancy text appropriately says the audited handler was D1 sidebar and the exact T1 handler was not separately matched; the static candidate mechanism is not promoted to a proven runtime cause.

## Result and limits

No blocking integration inconsistency found in these checks. The run02 evidence classes, counts, links, checksums and selected semantics are consistently integrated. Identical hashes above are disclosed rather than treated as unique visual states. Full money flows, clean replay, guard-false branches, arbitrary input validation, keyboard/focus, frontend equivalence, approval/PDF parity and package 00 acceptance remain open. This report adds no payment or package acceptance.

## D1 entry matrix follow-up

Checked all 18 rows of `docs/migration/d1-entry-matrix.md` against the saved ordered graph and this source audit: account/action names, source button IDs and destinations all match exactly. All 36 entry/return link labels resolve to observed state IDs and their exact evidence paths; all Markdown links exist. Settled15/18 replace transitional14/17, and CHF return uses32 rather than unsuccessful29/30. The matrix retains its entry/return-only scope and leaves B00-015 open. No matrix correction was needed.
