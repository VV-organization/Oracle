# Receiving details — local implementation, 5 November 2026

Source: fresh Figma2734:958; visible previews2736:958 and2736:1249; individual bodies2734:966 and2734:985. Nine context initializers on2723:2279 were read live without changing variable defaults. Source evidence: `../evidence/dashboard/receiving-live-2026-11-05.json`. Existing drawer2753:1615 remains an alternative.

Implementation: `frontend/src/receiving.ts`, `components/ReceivingDialog.tsx/.css`, shared event wiring inmain.tsx. Both Dashboard compositions and historical baseline reuse the dialog. Source values are fictional fixtures, not service credentials. Data provider integration remains for backend handoff.

Implemented contexts: EUR IBAN/BIC, USD domestic account/routing, unavailable GBP/CHF, USDC Polygon, BTC Bitcoin, ETH Ethereum, SOL Solana, XRP Ledger +12850 tag. No additional QR, network dropdown, or tag-copy action was invented.

Verified in browser at1440×1000: all9 contexts in cards +all9 in columns; selected history preserved; exact EUR720×478/body670×364, other crypto720×316 andXRP720×354; copy-allEUR (RU/EN), individualIBAN, USD leading zeroes andXRP address via real clipboard. Copy feedback clears on reopening and between individual/bulk actions. Native dialog, Escape, top-right close, backdrop retention and trigger focus return checked. Tab/Shift+Tab explicitly wrap; this was added after native Tab reached browser chrome. Images fromIconity loaded. Narrow390px dialog has no internal horizontal overflow; full product mobile composition remains unimplemented.

EN is translated catalog content pending copy approval, not a source-English1:1 claim. Clipboard-denied/error branch exists but was not forced in the browser. Reduced-motion support inherited fromIcon; OS emulation not performed. No independent human usability study. Source icon artwork intentionally replaced by user-selectedIconity. Browser JPGs are visual evidence, not lossless pixel-diff proof.

Independent review: receiving_audit confirmed data, lifecycle and source mapping; dashboard_themes reviewed renders and contrast. Technical verification: TypeScript/build and4 domain/data tests pass. Payment routes remain open dependencies.
