=== Viewports ===
Contributors: 0verscore, quantumpress, conversionmedia
Tags: responsive, controls, mobile, breakpoints, viewports
Requires at least: 6.7
Tested up to: 6.8
Stable tag: 0.9.7
Requires PHP: 8.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Extend your BlockTheme with Viewports to make standard block styles fully responsive!

---


== Description ==

**Viewports** extends the native Gutenberg blocks with responsive style controls – no extra blocks required.
Unlike other plugins that add custom blocks or duplicate components, Viewports integrates directly with the **standard block components**.

**Key Features:**
- **Works with all Block Themes** out-of-the-box
- Adds responsive controls (mobile, tablet, desktop) directly into block styles for **margin, padding, border, shadow, background, and custom properties**
- Wraps all generated styles into **CSS classes** for clean frontend output
- Built with a **mobile-first approach**: all settings are assigned to the correct viewport depending on user interaction and the selected viewport
- Provides a **Keyframe-style UI** to preview, reset, or manage responsive styles per viewport
- Offers a **developer-friendly API** (`registerRenderer`) to attach your own style components *(currently JavaScript only)*

With Viewports, you keep your BlockTheme clean, lightweight, and future-proof.


== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/viewports` directory, or install via the Plugins screen in WordPress.
2. Activate the plugin through the ‘Plugins’ screen in WordPress.
3. Open the block editor (Gutenberg) and edit any block. You will see new **responsive controls** in the block inspector.
4. Switch between desktop, tablet, and mobile views to style your blocks per viewport.


== Getting Started ==

= Example: Adjusting paragraph spacing with mobile-first and breakpoints =

**Insert a Paragraph block**
   - Open the Block Editor and add a Paragraph block.

2. **Mobile View (base, 0px)**
   - Select the Paragraph → open **Styles panel → Spacing → Margin → Bottom**.
   - Set margin to **20px**.
   - This applies from **0px up**, i.e., it is the baseline for all larger viewports.

3. **Tablet View (override, starts at tablet breakpoint)**
   - Switch to **Tablet viewport**.
   - Change bottom margin to **40px**.
   - This applies **from tablet breakpoint upwards**, including Desktop.
   - A **Keyframe marker** appears for Tablet.

4. **Desktop View (optional, min-width specific)**
   - Switch to Desktop viewport.
   - To apply changes **only to Desktop**, toggle **“Edit on min-width”**.
   - Set bottom margin to **60px**.
   - Now a Media Query is generated for Desktop only.
   - Tablet margin stays 40px, Mobile margin remains 20px.

5. **Frontend Result**
   - Save and preview.
   - Margin adapts perfectly: Mobile 20px, Tablet 40px, Desktop 60px.
   - All styles are wrapped in CSS classes, mobile-first, and clean for any BlockTheme.


== Frequently Asked Questions ==

= Does it work with all block themes? =
Yes! Viewports extends the standard block components, so it works with any Block Theme right away.

= Does it add new blocks? =
No. Viewports does **not** create duplicate blocks. It enhances the existing standard blocks with responsive controls.

= Can developers extend it? =
Yes. Developers can register their own style components using the provided `registerRenderer` API.

= Can i deinstall the plugin without issues? ==
Yes. You can simply remove the plugin, the basic style settings will still remain.
