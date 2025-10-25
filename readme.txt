=== Quantum Viewports ===
Contributors: 0verscore, quantumpress, conversionmedia
Tags: responsive, controls, mobile, breakpoints, viewports
Requires at least: 6.7
Tested up to: 6.8
Stable tag: 0.9.10
Requires PHP: 8.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Extend your BlockTheme to make standard block styles responsive!

---

== Description ==

**Quantum Viewports** extends the native Gutenberg blocks with responsive style controls – no extra blocks required.
Unlike other plugins that add custom blocks or duplicate components, Quantum Viewports integrates directly with the **standard block components**.

**Key Features:**
- **Works with all Block Themes** out-of-the-box
- Adds responsive controls (mobile, tablet, desktop) directly into block styles for **margin, padding, border, shadow, background, and custom properties**
- Wraps all generated styles into **CSS classes** for clean frontend output
- Built with a **mobile-first approach**: settings are applied to the appropriate viewport depending on which viewport is active while editing
- Includes a **Keyframe-style UI** to preview, reset, or manage responsive styles per viewport
- Includes a **developer-friendly API** (`registerRenderer`) to attach custom style components *(currently JavaScript only)*


= Early Access – Feedback Welcome =

Quantum Viewports is currently in **active Early Access**.
The responsive style engine already works well with many Block Themes, but we are still gathering **real-world feedback** to ensure **broader compatibility across different themes and editor configurations**.

If you encounter something unexpected – a great success story, a bug, or a theme setup that behaves differently – we would love to hear from you.
Every report helps us shape a reliable and truly native solution for responsive Block Styles in the WordPress ecosystem.


== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/quantum-viewports` directory, or install via the Plugins screen in WordPress.
2. Activate the plugin through the ‘Plugins’ screen in WordPress.
3. Open the block editor (Gutenberg) and edit any block. You will see new **responsive controls** in the block inspector.
4. Switch between desktop, tablet, and mobile views to style your blocks per viewport.


== Getting Started ==

= Example: Adjusting paragraph spacing with mobile-first and breakpoints =

1. **Insert a Paragraph block**
   - Open the Block Editor and add a Paragraph block.

2. **Mobile View (base, 0px)**
   - Select the Paragraph → open **Styles panel → Spacing → Margin → Bottom**.
   - Set margin to **20px**.
   - This applies from **0px up**, used as the baseline for all viewports.

3. **Tablet View (override, min-width tablet)**
   - Switch to **Tablet viewport**.
   - Change bottom margin to **40px**.
   - This applies **from the tablet breakpoint upwards**, including Desktop.
   - A **Keyframe marker** appears for Tablet.

4. **Desktop View (optional, min-width only)**
   - Switch to Desktop viewport.
   - To apply changes **only to Desktop**, toggle **“Edit on min-width”**.
   - Set bottom margin to **60px**.
   - Now a Media Query is generated for Desktop only.
   - Tablet margin remains 40px, Mobile margin remains 20px.

5. **Frontend Result**
   - Save and preview.
   - Margins adapt: Mobile 20px, Tablet 40px, Desktop 60px.
   - All styles are wrapped in CSS classes, mobile-first, optimized for any Block Theme.


== Frequently Asked Questions ==

= Does it work with all block themes? =
Yes! Quantum Viewports extends standard block components, so it works with any Block Theme right away.

= Does it add new blocks? =
No. Quantum Viewports does **not** create duplicate blocks. It enhances the existing standard block styles with responsive controls.

= Can developers extend it? =
Yes. Developers can register their own style components using the provided `registerRenderer` API.

= Can I uninstall the plugin without issues? =
Yes. You can remove the plugin at any time. Basic style settings will remain.

== Feedback and Issues ==
GitHub Repository: https://github.com/Quantum-Press/Viewports
Contact: https://quantum-press.com/en/contact
