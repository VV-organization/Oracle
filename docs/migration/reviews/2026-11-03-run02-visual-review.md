# Run02 — independent saved-image visual review

Date: 2026-11-03. Scope: package 00 evidence, not package acceptance.

## Method and limits

Independently inspected the local JPG captures listed below, in sequence, before reading `2026-11-03-d1-source-audit.md`. No browser, app UI, or Figma tools were used by this reviewer. Action descriptions come from `figma-work/migration-baseline/evidence/run-02/actions.json`; screenshots establish visible resulting states, not independently replayed clicks. Applied scoped Impeccable review guidance; its context loader ran successfully. No UI or prototype was changed.

This is a desktop Russian prototype evidence review. It does not establish frontend equivalence, mobile behavior, English content, keyboard/focus access, clipboard contents, backdrop/Escape dismissal, input handling, financial submission, timing, or full screen/transition coverage. No independent first-time user usability observation was performed. No numeric accessibility/performance score is justified by these images.

Evidence directory: `figma-work/migration-baseline/evidence/run-02/`.

## Per-capture observations

| ID / JPG | Independent visible observation | Result / limit |
| --- | --- | --- |
| 01-eur-selected-requisites | Dimmed Main behind EUR requisites dialog; EUR outline visible. Recipient Алексей Морозов, EUR, IBAN DE62 7814 2060 0083 7419 52, BIC NRBKDEB2, Nordrhein Bank, bank address, adjacent copy icons, top-right X, copy-all action. Underlying EUR history includes OP-IN-002 pending and OP-IN-001 credited. | Correct visible EUR context; actual copy and dismissal interaction not replayed. |
| 02-eur-filter-after-close | Dialog gone; EUR outline retained, balance 12 450,00 EUR; heading «Операции · EUR» with pending OP-IN-002 250,00 EUR, Ирина Соколова 250,00 EUR «Уточняем статус», completed OP-IN-001 +247,50 EUR «Зачислено». | Consistent with close preserving EUR filter and row set. |
| 03-history-from-eur | History page; source EUR, «Все статусы» strong outline, same three EUR rows with distinct labels/statuses. | All-history entry retains EUR context. |
| 04-history-pending-details | OP-IN-002, «Ожидаем поступление», money not yet received; gross 250,00 EUR, fee 2,50 EUR, expected net 247,50 EUR, WAL-EUR-001, creation 23 Oct 2026 10:32, provider number expected. | Pending semantics explicit, no false completion. Gross differs from expected net for stated fee. |
| 05-history-after-pending-back | History source EUR, «Все статусы» outlined; same three rows as03. | Visible origin/account/status preservation. |
| 06-history-eur-completed | Source EUR, «Завершённые» strong outline; only OP-IN-001 +247,50 EUR «Зачислено», 22 Oct 09:15. | Completed filtering observable. |
| 07-completed-operation-details | OP-IN-001, «Зачислено», receipt confirmed and counted in balance; gross250, fee2.50, credited247.50 EUR; WAL-EUR-001; TOPUP-001; provider PZ-261023-IN-001; creation22 Oct2026 09:15. | Different operation identity/date/provider state from04 despite equal gross/net values; completion and details share one page. |
| 08-history-completed-back | Source EUR, completed outlined, only OP-IN-001 credited. | Both account and completed filter preserved. |
| 09-main-after-history | Main active; EUR card still strongly outlined, but heading «Последние операции по всем счетам» and USDC pending/completed rows visible beside EUR rows. | **Discrepancy:** selection appearance contradicts all-account history context. Preserve as source defect evidence; do not silently redesign. |
| 10-eur-transfer-entry | «Перевести другому», debit EUR12 450,00; destination Germany, receiving EUR, SEPA; Ирина Соколова, IBAN,250 EUR; fee2.50, total252.50 EUR at lower edge. | EUR transfer entry correct. Lower form/action extends beyond capture, so whole-form fit/action accessibility not established. |
| 11-back-from-eur-transfer | Main EUR outline, «Операции · EUR», original EUR rows. | Consistent account return. |
| 12-usd-fund-entry | «Пополнить себе», USD13 935,29; Germany, bank transfer, SWIFT selected;250 USD, fee2.50, net247.50 USD; «Получить инструкции». | USD funding entry correct. Does not verify options or primary action. |
| 13-back-from-usd-fund | Main USD outline, «Операции · USD», «Операций пока нет». | Account selection and appropriate empty history agree. |
| 14-usd-transfer-entry | Not used for verdict: capture identified by executor as transitional. | Navigation failure must not be inferred from this image. Settled state15 used. |
| 15-usd-transfer-settled | Debit USD13 935,29; receiving USD; SWIFT shown as plain method detail;250 USD, fee2.50, total252.50 USD; Continue partly visible at bottom. | Correct settled USD transfer context. Primary action fully visible only with further viewport/scroll evidence. |
| 16-back-from-usd-transfer | Main USD outline, USD history empty. | Consistent return. |
| 17-gbp-fund-entry | Not used for verdict: capture identified by executor as transitional. | Navigation failure must not be inferred; settled18 used. |
| 18-gbp-fund-settled | GBP10 424,14; Germany; bank transfer/SWIFT;250 GBP, fee2.50, expected247.50 GBP, instructions action. | Correct settled GBP funding context. |
| 19-back-from-gbp-fund | Main GBP outline, «Операции · GBP», empty history. | Consistent account return. |
| 20-gbp-transfer-entry | Debit GBP10 424,14; receiving GBP; SWIFT plain detail;250 GBP, fee2.50, total252.50 GBP; Continue partly below bottom. | Correct GBP transfer context; same capture boundary limit as15. |
| 21-back-from-gbp-transfer | Main GBP outline, «Операции · GBP», empty history. | Consistent account return. |

## Findings and source cross-check

The highest-value discrepancy in this reviewed set is09: EUR appears selected while history has reset to all accounts. This can mislead users about which account the visible operations belong to. Treat it as an unresolved prototype selection/filter synchronization discrepancy, not a failed Main navigation.

The static source audit was read after the independent observations above. Its distinction between filter reset variables and separate EUR border variables provides a plausible source mechanism for09; this reviewer did not independently query those source properties. Its expected EUR requisites fields and close preservation agree with01–02. Its warning to compare row identity and complete return context agrees with03–08: OP-IN-002 is pending250 gross/247.50 expected, whereas OP-IN-001 is credited247.50 from250 gross; they are not the same operation changing status.

Visible positive evidence is limited to these captured states: EUR dialog close context, EUR history pending/completed details and returns, currency-specific EUR/USD/GBP money entry, and corresponding Main returns. These observations do not close package00 or authorize implementation/styling.


## Additional independent inspection: CHF22–32

These saved images were inspected directly without UI control. The executor separately clarified that29/30 captured an attempted click near the Figma toolbar, not a successful activation of the product back control; the images support the absence of navigation, but do not independently establish event targeting.

| ID / JPG | Independent visible observation | Result / limit |
| --- | --- | --- |
| 22-chf-fund-entry | Funding form CHF0.00; Germany, bank transfer/SWIFT,250 CHF, fee2.50, expected247.50 CHF, instructions primary action. | Correct CHF funding context. Zero balance does not prevent receiving money. |
| 23-back-from-chf-fund | Main CHF outlined, «Операции · CHF», empty history. | Consistent CHF return. |
| 24-chf-transfer-entry | Transfer form debitCHF0.00, receivingCHF, Germany, SWIFT plain detail, recipient/IBAN retained,250 CHF, fee2.50, debit252.50 CHF. | Correct selected currency; Continue partly below viewport. |
| 25-chf-transfer-bottom | Scrolled form displays complete «Продолжить» and total252.50 CHF while balance0.00 remains visible. | Confirms lower primary action is reachable in this captured CHF form. Does not retroactively prove all other form scrolling. |
| 26-chf-insufficient-error | Form remains; «Проверьте данные»: insufficient funds for amount and commission, fund account or reduce amount; recovery button partly below edge. | No review/success screen or operation completion implied. Error matches0.00 available versus252.50 required. |
| 27-chf-insufficient-recovery | Scrolled lower state shows full error panel, «Исправить данные» and «Продолжить». SameCHF data and totals. | Recovery affordance is visible and error retains form context. The screenshot alone does not establish repeated Continue behavior. |
| 28-chf-fix-data | Error panel absent; originalCHF form values and totals remain, Continue restored in normal lower form position. | Consistent with correction clearing error while preserving entered data. No value was actually changed in reviewed evidence. |
| 29-back-from-chf-transfer | Same correctedCHF form remains, Figma toolbar appears over upper back-control position. | Attempt did not navigate; do not classify as broken product back without a correctly targeted activation. |
| 30-chf-back-settled | SameCHF form after observation, no navigation. | Confirms29 was not merely a delayed successful transition. Executor attributes missed activation to Figma toolbar context. |
| 31-chf-form-top | Page scrolled to top; product back arrow clearly exposed below chrome, CHF0.00 and form data intact. | Provides visible usable back target for next step. |
| 32-back-from-chf-transfer-top | MainCHF outlined, «Операции · CHF», empty history and balance0.00. | Successful return after top-position activation, with correct account context and no new operation. |

CHF sequence adds evidence of insufficiency validation and a visible correction route, while preserving amounts/currency/recipient. It also resolves the earlier capture-boundary uncertainty for the CHF primary action:25 and27 show the relevant lower controls after scrolling.29/30 should remain recorded as unsuccessful walkthrough attempts caused or affected by viewer chrome;32 supplies the successful return evidence. No frontend or package00 acceptance follows.


## Additional independent inspection: crypto33–52

All twenty saved JPGs33–52 were viewed individually. Scope is entry and return only. No Continue, address copy, network menu, QR scan, validation, review, submission, completion or external network behavior was independently exercised. Visible fees and addresses are prototype content, not verified service terms or usable destination guarantees.

| ID / JPG | Independent visible observation | Result / limit |
| --- | --- | --- |
| 33-usdc-fund-entry | Receive screen USDC2 500.00, Polygon selector, network warning, QR/address with copy icon, WAL-USDC-001, history link. | Correct USDC receive entry. QR payload/copy/menu unverified. |
| 34-back-from-usdc-fund | Main USDC outlined, «Операции · USDC»; OP-CR-IN-002100 USDC awaiting network confirmation, plus separate credited+99 USDC row. | Correct account return. Does not demonstrate operation creation: the same pending ID/amount was already visible in09 before33. |
| 35-usdc-transfer-entry | Withdraw screen USDC2 500.00, Polygon selector, recipient address,100 USDC, fee1, debit101 USDC, Continue. | Correct USDC withdrawal entry; no debit or completion claimed. |
| 36-back-from-usdc-transfer | Main USDC outline/history, same pending100 and credited99 rows, balance2 500.00. | Entry/return preserves visible account context. |
| 37-btc-fund-entry | Receive BTC0.03115971; fixed Bitcoin network plain row; QR/address, WAL-BTC-001. | Correct BTC entry; single network visually distinguished from dropdown. |
| 38-back-from-btc-fund | Main BTC outline, «Операции · BTC», empty history, balance0.03115971. | Correct BTC return. |
| 39-btc-transfer-entry | Withdraw BTC0.03115971, fixed Bitcoin network; recipient address;0.001 BTC, fee0.00001, debit0.00101 BTC, Continue. | Correct BTC entry and internally consistent displayed total; full withdrawal untested. |
| 40-back-from-btc-transfer | Main BTC outlined, BTC empty history and unchanged displayed balance. | Correct BTC return. |
| 41-eth-fund-entry | Receive ETH1.071467; Ethereum plain network row; QR/address, WAL-ETH-001. | Correct ETH receive entry. |
| 42-back-from-eth-fund | Main ETH outlined, «Операции · ETH», empty history, balance1.071467. | Correct ETH return. |
| 43-eth-transfer-entry | Withdraw ETH1.071467, Ethereum fixed row, recipient address;0.01 ETH, fee0.0001, debit0.0101 ETH, Continue. | Correct ETH entry; no submission evidence. |
| 44-back-from-eth-transfer | Main ETH outlined, ETH empty history, unchanged displayed balance. | Correct ETH return. |
| 45-sol-fund-entry | Receive SOL24.6401; Solana fixed row; QR/address, WAL-SOL-001. | Correct SOL receive entry. |
| 46-back-from-sol-fund | Main SOL outlined, «Операции · SOL», empty history, balance24.6401. | Correct SOL return. |
| 47-sol-transfer-entry | Withdraw SOL24.6401, Solana fixed row, recipient address;1 SOL, fee0.01, debit1.01 SOL, Continue. | Correct SOL entry; complete withdrawal untested. |
| 48-back-from-sol-transfer | Main SOL outlined, SOL empty history, unchanged displayed balance. | Correct SOL return. |
| 49-xrp-fund-entry | Receive XRP1 922.50; XRP Ledger plain network row; QR/address, WAL-XRP-001; destination tag12850 explicitly displayed. | Correct XRP entry including receiving tag; QR contents and tag-copy behavior unverified. |
| 50-back-from-xrp-fund | Main XRP outlined, «Операции · XRP», empty history, balance1 922.50. | Correct XRP return. |
| 51-xrp-transfer-entry | Withdraw XRP1 922.50, XRP Ledger fixed row, different recipient address; destination tag field empty with placeholder «Введите тег назначения»;10 XRP, fee0.1, debit10.1 XRP, Continue. | Receiving tag12850 is not silently reused for another recipient. Blank-tag validation and progression untested; do not claim valid withdrawal. |
| 52-back-from-xrp-transfer | Main XRP outlined, XRP empty history, unchanged displayed balance. | Correct XRP return. |

No additional entry/return currency mismatch is visible in33–52. USDC network is presented as selectable; BTC/ETH/SOL/XRP single networks are plain details. Returns consistently align the selected card outline with the account-specific history heading. The OP-CR-IN-002 pending row after USDC funding entry is pre-existing visible scenario data:09 already showed the same ID100 USDC and network-confirmation status.33–34 therefore cannot support a claim that opening a receiving screen creates a deposit. XRP receiving tag12850 and empty withdrawal tag belong to distinct receiving/sending contexts; no validation inference follows.

Review coverage now ends at52. The unresolved09 Main outline/all-account-history discrepancy remains. Full money flows, all package00 state branches, frontend equivalence and package acceptance remain unverified.
