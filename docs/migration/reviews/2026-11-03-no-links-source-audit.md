# noLinks fixture — independent source audit

2026-11-03. Read-only source check following main's reported run04 captures60–63. The source report does not independently inspect those images or execute the UI. No prototype or ledger was changed. Scope: why the noLinks fixture can display a normal L1, enter L2 and create the preset PL-1043 in L3.

Sources under `figma-work/migration-baseline/raw/`: `graph-ordered-actions.json.gz`, `hierarchy.json`, `product-properties.jsonl.gz`, `decoded/nodes.jsonl.gz`, `decoded/active-variables.json`. Action paths below are relative to root `prototypeInteractions/0` in the named node. Root reactions are active (`isDeleted=false`).

## Fixture does set the prohibition

`80:2231` / `Button / fixture:noLinks`, raw line1538, contains659 ordered actions. Examined the full root tree for assignments to `UX/linkEntitled [76:1922]`, `UX/canLinks [76:1920]`, `UX/cannotLinks [76:1921]` and `UX/linksReason [76:1928]`, including assignments after navigation.

- Early general reset: action140 canLinks=true,141 cannotLinks=false,142 linkEntitled=true,148 general available text.
- Later fixture-specific assignments supersede those defaults:539 linkEntitled=false;544 canLinks=false;545 cannotLinks=true.
- Action550 recomputes the full links guard: verified KYC, business KYB if relevant, providerClear, active account, **and linkEntitled**. Since entitlement was set false, its positive branch551 does not apply. Negative branch552 sets canLinks=false/cannotLinks=true. Action553 snapshots linkEntitled;555 sets «Платёжные ссылки не подключены для этого аккаунта. Доступные операции со счетами сохраняются.» for false entitlement.
- Action572 navigates to L1 `34:977`. The remaining actions through658 do not restore linkEntitled/canLinks/cannotLinks or replace linksReason. Thus reading only the early reset would give the wrong result: the final fixture vector does represent unavailable link creation.

This conclusion concerns the saved ordered source; it is not a direct runtime-variable read. It matches the intended fixture label and narrows the later mismatch to how the links UI consumes the permission state.

## L1 does not show or enforce that state

`80:1592` / `Notice / cannotLinks`, raw line1266, has `geometry.visible=false`, with empty variableConsumptionMap and parameterConsumptionMap entries. It is hidden statically rather than bound to cannotLinks. Its child explanation `80:1594`, line1268, still binds TEXT_DATA to linksReason, but a correct child string cannot make the hidden parent visible.

The actions container `80:1598` is visible=true with empty bindings. `80:1599` / `Button / link:new`, line1272, is visible=true and has only corner-radius bindings; neither it nor that actions container has a permission-visibility binding. The active click reaction has exactly four actions:

| Path | Effect |
| --- | --- |
|actions/0|ora14/formRef=`Счёт 1043`|
|actions/1|ora14/formMenu=false|
|actions/2|ora14/formCountryMenu=false|
|actions/3|Unconditional NAVIGATE to L2 `34:1017`|

There is no canLinks/linkEntitled guard in this root reaction. Parent Main `80:1583` is visible=true with no bindings. Therefore the reported normal list and working creation entry are consistent with the saved source despite the prohibition variables.

## L2 submit also lacks a permission guard

`2429:668` / `Button / Создать ссылку`, raw line8218, has25 root actions. It is visible=true with corner-radius bindings only. The root reaction references the `ora14/*` form/current-link variables, not canLinks, cannotLinks or linkEntitled.

- Actions0–3 unconditionally set newCreated=true, key=current, id=PL-1043 and its prototype URL.
- Actions4–11 copy form reference, amount, currency and country into link details and current-row data.
- Actions12–21 set «Ожидает оплаты», «Попыток пока нет», created message, paid=false, canClose=true, closeConfirm=false, copyVisible=false and unsettled wording.
- The only conditional branches22/23 distinguish EUR versus USD to assign displayed balance/fee/net fixtures. They are not authorization guards.
- Action24 unconditionally navigates to L3 `34:1086`.

L2 Main `80:1643` has click and Escape reactions that close dropdowns; those actions do not validate links permission. No timer or entry reaction in this inspected Main restores the entitlement. Thus the source directly supports the reported ability to create the preset row after choosing the noLinks fixture.

## Finding and boundaries

The reported60–63 observations plus this source map support B00-018 as a **prototype restriction mismatch**: unavailable-link fixture variables remain set, while the restriction notice is statically hidden and creation entry/submit bypass their intended condition. It is not evidence of a real backend authorization bypass, real published payment URL, real account change or payment.

Do not silently re-enable entitlement to explain the UI, remove this fixture from coverage, or fix the source while inventorying. Record the mismatch and decide the intended behavior before implementing the affected links package. Existing-link viewing and money movement may intentionally remain available; this report does not infer that all link-related actions must be hidden. No user approval of a correction is implied by this audit.
