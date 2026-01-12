## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Status](#status)
- [Requirements](#requirements)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Developer API](#developer-api)

---

## Overview

**Quantum Viewports** extends the Gutenberg BlockEditor with viewport-specific controls for standard blocks. It allows editors and developers to adjust block properties such as **margin, padding, and other style attributes** independently for **desktop, tablet, and mobile**, without needing separate CSS or media queries.

---

## Features
- **Viewport-specific controls**
  Adjust block styles per viewport directly in the Gutenberg sidebar.
- **Keyframe-style UI**
  Each viewport has a “keyframe” view for inspecting the CSS generated for that viewport. Styles can be reviewed, deleted, or restored per viewport.
- **Developer extensibility**
  Add custom style renderers for blocks or themes via the `registerRenderer` API. You can control rendering order, CSS selectors, and panel/label hooks.
- **CSS output preview**
  Inspect the generated CSS for each block and viewport without leaving the editor.

---

## Early Access - Feedback Welcome

Quantum Viewports is currently in **active Early Access**.

The responsive style engine already works well with many Block Themes, but we are still gathering **real-world feedback** to ensure **broader compatibility across different themes and editor configurations**.

If you encounter something unexpected. A great success story, a bug, or a theme setup that behaves differently, we would love to hear from you.

Every report helps us shape a reliable and truly native solution for responsive Block Styles in the WordPress ecosystem.

---

## Requirements
- WordPress with **Gutenberg / Block Editor** enabled
- Standard blocks for full functionality (third-party blocks may need extra configuration)

---

## Installation

Quantum Viewports adds responsive style controls to the Gutenberg block editor for mobile, tablet and desktop viewports. It is available through the **official WordPress.org plugin directory** and can also be installed manually or from the plugin’s GitHub repository.

### Option 1 — Install via WordPress admin

1. Go to your WordPress dashboard → **Plugins → Add New**.
2. Search for **Quantum Viewports**.
3. Click **Install Now** and then **Activate**.
4. Open the Block Editor and select any block — responsive viewport controls will appear in the block inspector.

### Option 2 — Manual install from WordPress.org

1. Download the plugin ZIP from **WordPress.org** (Quantum Viewports page).
2. In the WordPress admin go to **Plugins → Add New → Upload Plugin**.
3. Choose the ZIP file and click **Install Now**.
4. Activate the plugin.

### Option 3 — Install from GitHub (Releases)

1. Download the latest ZIP from
   https://github.com/Quantum-Press/Viewports/releases
2. Extract the ```quantum-viewports-plugin.zip``` to
   `wp-content/plugins/quantum-viewports`
3. Activate the plugin via **Plugins → Installed Plugins**.


---

## Getting Started

1. **Select a block** in the editor.
2. **Open the block sidebar** to access block settings.
3. **Adjust styles** for the current viewport.
4. **Switch between viewports** (desktop, tablet, mobile) using the viewport toggle.
5. **Adjust styles per viewport** – changes are automatically applied for that screen size, effectively generating the necessary media queries.

---

## Usage
- Supports standard block properties like **dimensions, spacing, border, shadow**, and other configurable style attributes.
- Works best on desktop; preview behavior may vary on mobile previews.
- Changes are saved per viewport and applied automatically.

---

## Developer API

Quantum Viewports provides JavaScript and PHP APIs for registering custom style attributes.
Once registered, the built-in StyleEngine automatically tracks your custom attributes.

Documentation: https://quantum-press.com/en/documentation/