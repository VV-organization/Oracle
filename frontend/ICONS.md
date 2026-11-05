# OraclePay icons

The user selected Iconity for the whole project on 3 November 2026 and explicitly requested only archive icons, rather than retaining missing glyphs from the previous set.

All current slots, including both dashboard compositions and the historical composition, use `src/components/Icon.tsx`. Static images are rendered rest frames of the same Lottie assets; they are not another icon family. The 20px navigation slots and 16px compact-action slots remain unchanged.

| Product name | Iconity source | Rest frame |
| --- | --- | --- |
| home | Building / Home_1 | 0 |
| payments | Arrows / exchange | 0 |
| cards | General / Coupon | 0 |
| history | File & Folder / receipt | 0 |
| help | Multimedia / headphones | 0 |
| settings | General / Setting | 0 |
| logout | General / log_out | 0 |
| plus | General / Add_Circle, circle removed per 5 November request | 0 |
| transfer | Arrows / arrow_right_Up | 18 |
| close | General / Close_Circle | 0 |
| copy | General / copy_1 | 0 |

The archive has no banking-card glyph or plain plus. Coupon is the closest horizontal card-like silhouette. On 5 November the user explicitly requested a plain plus: derive it from Add_Circle by removing only the circle shape group, retaining its parent transform/animation. This remains an Iconity-derived glyph; the translucent white button circle stays unchanged. Keep the accompanying text labels.

The transfer source begins and ends transparent. Frame18 is its visible resting arrow; playback goes from18 to the end, then0 to18. Other sources use their initial frame. Completed and interrupted playback returns to the rest frame. Each cycle lasts approximately280ms and never loops or delays an action.

Animations load on the first fine-pointer hover using the local JSON and a lazy `lottie-web` light SVG renderer. JSON promises are shared, with per-instance cloned animation data and players. No remote animation service or archive HTML is executed. Keyboard focus and touch remain static. The reduced-motion media query prevents playback; changing that preference or hiding the tab stops an active animation. A static export remains available if JSON or the renderer fails to load.

Source archive: `540-animated-and-static-icons-iconity_NjlkY2Q2ODAwNWM4NzYwMDM5M2U2Yzdk.zip`, supplied by the user. Only the eleven used JSONs and their static SVG exports are included. `public/assets/iconity/manifest.json` records exact archive paths, hashes and rest frames. Source JSONs are unchanged except the documented plus derivative. Its original archive hash is retained as sourceSha256; sha256 identifies the served derivative. Static SVGs were exported from the local Lottie renderer at those frames. The plus/transfer exports and animation share normalized view boxes in Icon.tsx: visible bounds12×12px and stroke1.75px in the16px slot; centres are normalized too. The plus stroke is adjusted to the arrow’s optical weight. No separate license text was present in the archive; no license for Iconity is inferred. Lottie is an independent npm dependency with its own license.

5 November: receiving dialogs add close and copy in24px slots within44px controls. `copy_1` has two overlapping rounded squares at rest; the other `copy` source contains a checkmark at rest and was rejected to avoid implying success before copying.

To add an icon, choose its semantic source from the archive, add its JSON and static rest-frame export, update `IconName` and the manifest, then verify the actual 16/20px glyph, hover interruption, keyboard and reduced-motion behavior. Do not inline unrelated glyphs in screen components.

Renderer API reference: [official lottie-web usage](https://github.com/airbnb/lottie-web/wiki/Usage).
