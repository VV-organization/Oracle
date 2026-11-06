# OraclePay — compact UX revision
User-approved objective: reduce the oversized prototype and redesign around usable end-to-end tasks. Russian visible UI; English layer/component names.
## Structure
29 primary frames including one review launcher, plus 3 reusable overlays; prior 117-frame version archived.
G0 launcher; A1 sign-in; A2 registration with Individual/Business choice; A3 contact/2FA confirmation; A4 recovery; V1 verification hub; D1 overview; W1 accounts; W2 contextual account; P0 payment choices; P1 fiat funding; P2 fiat withdrawal; P3 receiving bank details; P4 bank transfer; P5 crypto deposit; P6 crypto withdrawal; P7 operation review; T1 unified history; T2 contextual operation details; L1 links; L2 link creation; L3 link details; L4 external payer result; C1 cards; Q1 QR; N1 phone transfer; H1 help and request form; H2 request; S1 settings.
Inline copy/status feedback; O2 action confirmation and review state chooser; O3 external process boundary; O4 transaction confirmation.
## UX contract
- Each primary screen has one task and one clear primary action.
- Optional Payment Link return URLs under expandable additional settings.
- Copy uses inline feedback, preserves context and never creates a new financial outcome.
- Payment Link creation, active/failed attempt/paid/expired/cancelled states use same list/detail bindings.
- Navigation does not reset Link state. Scenarios reset only via review launcher.
- Payment initiation produces pending, never success. Unknown status check preserves operation ID and no duplicate.
- Support copies the current operation/link reference; generic support starts with empty reference.
- Form review/edit/back preserve values; submit twice opens the existing operation.
- KYC and KYB independent. New account remains restricted until confirmed verification; no support bypass.
- No inferred production countries, methods, fees, provider or timing. Fixture amounts are declared in launcher.
- Cards/QR/phone remain V1; provisional UX proposals are annotated outside the product frames. Do not pretend unsupported service is connected.
## Validation
Check text/clipping, primary action destinations, reachability, variable bindings and conditional actions. Exercise Link copy/list/details, payment review/edit/submit/status/support, restricted onboarding and overlay dismissal in presentation. No claim of usability validation with real users.
