# Run03 — independent ledger integration review

2026-11-03. Read-only check of integrated run03 evidence and ledgers. Only this report was written. No Figma/UI operation, screenshot capture, source change or shared ledger edit was performed. The visual facts below were cross-checked against the independent image review, not independently replayed here.

## Integrity and linkage checks

- Run03 has 53 JPG files, exactly matching its 50 observed records and three non-acceptance captures in `observations.json`.
- Run03 records are identical to their corresponding objects in the global `states.json`.
- `02-signout` and `03-signout-settled` are unsuccessful navigation attempts; `38-business-registration-entry` is a transient capture. None is included in accepted observation counts or state coverage rows.
- Totals agree across source metadata and ledgers: 69 saved PNG frame records, 117 observed Present records and seven non-acceptance captures = 193 image records. Native captures total124 JPG.
- All193 state IDs, evidence paths and manifest paths are unique. The manifest path set exactly equals the combined state-evidence path set. Every file exists; all193 independently recomputed SHA-256 hashes and byte sizes match.
- Two previously recorded pairs remain byte-identical: saved `478-300.png`/`478-321.png`, and run02 `50-back-from-xrp-fund.jpg`/`52-back-from-xrp-transfer.jpg`. Run03 adds no duplicate hash. Unique IDs and paths do not imply unique visual states.
- All117 observed-state references in `screens.json` resolve, match the parent screen's source node, and cover the observation set exactly once. Every previous-observation link resolves; every named independent-review file exists.
- Coverage has298 unique IDs:181 role rows plus117 observed-state rows. The state subset exactly equals the observation set. All code targets remain blank, consistently with no frontend implementation. Every evidence path exists, including individually checking the semicolon-separated evidence lists on role rows.
- The original `.fig` SHA-256 remains equal to the immutable archive hash in `source.json`.

## Semantic cross-check

Compared run03 `observedResult` records, progress/discrepancies and source counts with `2026-11-03-run03-visual-review.md` and the access source audit.

| Evidence | Integration conclusion |
| --- | --- |
|02/03 versus13|Failed initial logout attempts are not promoted to a product defect; successful text-click logout is independently represented by13.|
|04/37|Figma Restart is distinguished from normal product navigation and from a fully verified variable reset.|
|06–10 and15/16|Timer labels, early-click result, resend message/code clearing are documented; exact wall-clock performance and email/SMS delivery are not accepted.|
|14–17|Phone selection → fixed email recipient label is B00-016, still open. Returning through «Изменить контакт» preserves the identifier; no settings credential change is claimed.|
|18–22|Recovery completion means the prototype displays a request confirmation, not ownership restored or a real notification sent.|
|23–30|Personal registration retains its blank-field error, fixture substitution, contact-confirmation back path and initial restricted account.|
|31–36|KYC modal dismissal preserves not-started state; simulated external step, pending state and later visible money actions remain distinct. Record36 explicitly avoids claiming a visible confirmed badge where the verification block disappears.|
|39–45|Business organization fields are already fixture-filled. Missing-organization validation is not claimed; personal/business toggling preserves the presented values.|
|48/49|KYB confirmation with KYC still not started does not expose money actions. The stale future-result explanation is B00-017, explicitly open and not represented as failed KYB or a permission bypass.|
|50–53|Business KYC completes after KYB in the prototype. Record53 claims visible money actions on nine zero balances, preserved business context and empty history; it does not accept successful financial operations or a real verification provider.|

The16 special fixture entry paths remain source mappings only. Expired/duplicate/technical, blocked/suspended/closed/provider, additional documents/declined, arbitrary input, full prohibited-navigation coverage, keyboard/focus, backend policy, real uploads, exact timer timing and external providers remain outside the observed pass. Package00 remains in progress; no frontend equivalence or full product acceptance is stated.

## Documentation presentation note

At initial inspection, `discrepancies.md` had a blank line between B00-015 and B00-016, separating16/17 from the Markdown table. The coordinator was notified to remove that separator. This is a rendering issue, not missing discrepancy data or a ledger-integrity failure. This reviewer did not change the file.

## Result

No blocking ledger inconsistency found. Counts, evidence integrity, references and selected semantic boundaries are consistently integrated. This review accepts only those ledger checks; it does not close package00 or any payment/verification integration.
