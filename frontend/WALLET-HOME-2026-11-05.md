# Home visual redesign — 5 November 2026

Status: local review candidate. This is the active themed Home implementation; the earlier neutral Figma baseline remains separate. No other screen was migrated in this pass.

## User direction

The user rejected the colored wireframe and authorized careful composition changes on Home, real reference-led visual decisions, and entrance motion. Preserve financial data, account-context actions, filtering, receiving dialogs and Iconity. This direction is not a claim of Figma 1:1 geometry or final design approval.

## References actually inspected

- Live oracle.oasdwlr.com/app/overview: Manrope Variable headings, Inter Variable interface text, compact shell and balance hierarchy. Existing OraclePay implementation was not replaced with that site's code.
- Pulse dashboard: active-account material and translucent circular controls; neutral surrounding surfaces. Existing approved jade/orange gradients reused; mixed was subsequently rejected and removed.
- Emerald24 wallet/history: currency identity, prominent balance and quiet service details, compact transaction presentation.
- Budgetly home: differentiated type hierarchy and account grouping.
- Solithic and Zaptix desktop references: restrained canvas and separation between active accents and supporting content.

Source reference images remain in figma-work/reference-images/behance-2026-11-03.

## Implementation

- `src/wallet/WalletDashboard.tsx` contains the themed presentation, composed from account identity, balance, contextual actions and ledger components.
- `src/wallet/copy.ts` contains RU/EN presentation copy. Names and stored transaction data remain language-independent.
- `src/wallet/wallet.css` owns scoped Home styles. `src/themes.css` retains the two supported material palettes. Existing neutral components remain unchanged.
- Manrope is bundled from @fontsource-variable/manrope 5.3.0 under SIL OFL; Cyrillic and Latin are available. Inter remains bundled locally.
- Desktop green: equal-width account cards, steady amount baselines, only selected account colored.
- Desktop orange: 72px account rows, selected panel equals the four fiat rows, history equals the five crypto rows. Measurements at 1440: fiat/panel y243–555; crypto/history y615–1007. Desktop content and owner have 40px inset from the available content edge.
- At 900px and below, every palette uses contextual cards so actions appear inside the selected account rather than below nine accounts. Phone cards remain equal at176px.
- History shows recipient/type first, quiet date/time, status with a dot, amount right-aligned. Existing fixture precision and selected-account filtering remain intact.
- Entrance (revised after user feedback): each object reveals on its first viewport entry with opacity 0→1 and 12px upward travel over 480ms; sibling stagger 45ms capped at180ms. Existing nodes do not replay on filtering. Focus reveals immediately; reduced motion shows everything immediately; missing IntersectionObserver leaves content visible. No animation dependency added.
- Only green/cards and orange/columns are supported. Mixed CSS removed; legacy mixed URLs canonicalize to the supported theme for the layout. Earlier mixed screenshots below are historical evidence only.
- Text and underlines in service links are slightly translucent at rest; hover restores opacity without changing thickness.

## Verification

- Browser inspected: green/orange/mixed desktop; green tablet768; green and orange phone390; English labels.
- Pointer EUR/CHF selection, empty CHF, keyboard Enter on BTC, BTC address dialog, Escape dismissal, reset to all accounts.
- Mobile menu traps Tab, closes with Escape and restores focus; background becomes inert while open.
- No horizontal document or card overflow in measured390/768 states. Full-page browser captures sometimes omit the scrollbar-width strip; explicit viewport screenshots used for edge inspection.
- Independent read-only review of code/screenshots: mobile action distance, small action labels and card density were identified and corrected. Follow-up reported no blocking observations. This was agent review, not independent user observation.
- `npm run build` passes; `npm test` passes4 existing domain/receiving tests.
- Impeccable detector reported only generic Inter-font warning. Inter is intentional from the user's specified reference and paired with Manrope.
- Reduced-motion implementation inspected in code; OS reduced-motion mode was not emulated by the available browser tool. Contrast spot checks informed link opacity; this is not a complete accessibility certification.

Evidence: docs/migration/evidence/dashboard/wallet-{green,orange,mixed}-desktop.jpg and wallet-{green,orange}-mobile.jpg.

## Limits

Local only, not published. Sending/funding, transaction details and navigation to other screens still use the existing not-yet-migrated boundary. No backend integration, no fabricated total across currencies, no new rates or analytics. Figma/PDF approval snapshots were not updated to this unapproved visual candidate.

### Card content order correction

User restored the cards layout order: identity at top left, visible Account details / Address at top right, contextual actions in the middle, balance anchored at the bottom in both selected and unselected states. Shared AccountTile applies this to all themes and compact layouts. At narrow mobile widths the redundant currency stamp is omitted to retain readable labels. Wrapper layers pass pointer events through to account selection; actual action buttons remain interactive.

Verified at 1440px desktop and 390px mobile (RU/EN), including selected CHF, receiving details dialog, equal card heights, bottom alignment and no header/action/balance overlap. Build passed. Evidence: `../docs/migration/evidence/dashboard/wallet-card-order.jpg`.

## Solithic / Zaptix spacing refinement — 5 November 2026

The user requested a focused Home refinement from the two Behance cases. Reviewed the live cases visually and the saved desktop images in `figma-work/reference-images/behance-2026-11-03/`. Solithic informs the contrast between a lightweight page title, quiet labels and anchored amounts. Zaptix informs the shared grid, compact supporting controls and spacing between content groups. The numeric dimensions below are adaptations for OraclePay, not measurements from perspective mockups.

- Desktop title 40/48 at weight 500; utility header 64px; existing Manrope/Inter and Cyrillic support retained.
- Section spacing 32px, card gaps 12px, group heading to cards 12px. Desktop workspace and owner inset remain 40px.
- Cards: removed the duplicate currency stamp; code/name at top left, receiving action top right, balance at bottom. Fiat amount 30/38, crypto 23/32; all cards retain 180px height and selected actions remain in the middle.
- Column layout: account label 12px, description 11px, amount 21/28; 72px row retained. Shared section-gap token preserves both column alignments. Panel padding 32px; ledger padding 24px and column headings 12px.
- Green and orange material, selection, filtering and reveal behavior are preserved. No new pages, analytics or product claims added.

Verification: build and four existing tests pass. Browser checked at 1440px desktop and 390px mobile in RU/EN: account selection with keyboard, BTC receiving dialog and Escape, empty CHF history, filter reset, full BTC precision, single-line statuses, no horizontal page overflow. At desktop orange: fiat and panel y244–556; crypto and ledger y624–1016. Owner right inset is 40px from the content viewport (excluding scrollbar). Reference screenshots saved under `docs/migration/evidence/dashboard/reference-spacing-{green,orange}.jpg` after reveal completes. Impeccable mechanical check only flags existing Inter usage; retained intentionally for the approved bilingual system. This remains a local frontend refinement; no new independent user usability study or Figma/PDF synchronization was performed.

## Entrance coverage correction — 5 November 2026

Added reveal coverage for the history surface and the selected account heading, balance and action buttons. Currency changes remount only the changing panel content for a short 240ms entrance; existing cards do not replay. Initial entrances use keyframes so they also run when IntersectionObserver fires before the first paint. Completed and focused elements settle permanently, including focused ancestors, preventing a second entrance on blur. Mobile menu and backdrop fade in over 180ms. Reduced-motion rules disable all these animations.

Verified locally in the browser: green and orange initial opacity progresses to 1; orange currency switching animates the updated content; keyboard EUR → USD leaves previous cards settled without animation; mobile history reveals after scrolling and menu closes with Escape. No visible reveal target remained transparent after completion. Reduced-motion handling inspected in source, not emulated in the browser. Independent code review caught and resolved focus replay and premature fade assignment. Variant exports rebuilt and four existing tests pass. These corrections are local and have not been pushed to GitHub. Still screenshot: `../docs/migration/evidence/dashboard/reveal-orange-complete.jpg` (completed layout, not a recording of motion).


## Theme isolation — 5 November 2026

Decorative colour always follows the active theme. Currency stamps, incoming/outgoing icon backgrounds, positive amounts, language controls, sidebar, filter, hover, focus, dialogs and mobile overlays consume theme tokens or neutral white/black. Green is allowed in orange only for explicit completed-status text/dot (or its dedicated status background), never because a transfer is incoming or an amount is positive. Pending/unknown retain semantic colours. Both wallet palettes are explicit; shared component rules must not hardcode one palette as a fallback.

Source audit covered wallet, global themes, receiving dialogs and Iconity. Replaced the shared green literals and orange's green-biased strong colour. Rules recorded in project AGENTS.md. Browser verification covers desktop initial/selected/unselected accounts, orange BTC hover, currency selection with keyboard, empty CHF, bank/crypto receiving dialogs, and both theme palettes. At 390px, visually checked both mobile menus and neutral backdrops; the orange rendered-colour scan found no green outside completed statuses. At desktop, the same orange scan and the inverse green scan found no cross-theme decorative colours. Independent source/cascade review found no remaining blockers. Rebuilt standalone variants locally; four tests and git diff --check pass. Rules also saved in ~/.codex/AGENTS.md. Evidence: theme-isolation-orange.jpg and theme-isolation-green.jpg in docs/migration/evidence/dashboard. Publication status is unchanged.
