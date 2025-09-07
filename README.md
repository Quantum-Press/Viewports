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

**Viewports** extends the Gutenberg editor with viewport-specific controls for standard blocks. It allows editors and developers to adjust block properties such as **margin, padding, and other style attributes** independently for **desktop, tablet, and mobile**, without needing separate CSS or media queries.

The plugin is designed to integrate seamlessly into the block editor workflow while providing a **developer-friendly API** for extending style rendering to custom blocks.

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

## Status

This plugin is currently in **early-access / beta**. Features are functional but some behaviors may change as the plugin evolves. It is intended for testing and experimentation rather than production-critical sites.

**Note:** Certain workarounds exist for limitations in Gutenberg or specific blocks, but the plugin is designed to remain stable and usable.

---

## Requirements

- WordPress with **Gutenberg / Block Editor** enabled
- Standard blocks for full functionality (third-party blocks may need extra configuration)

---

## Installation

Currently, Viewports is **not in the WordPress plugin repository**. Use one of the following methods:

1. **Download / Clone** the repository to `wp-content/plugins/viewports`.
2. Activate the plugin via the WordPress admin panel.
3. Open the editor and check for the new viewport controls in block settings.

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

Viewports also delivers a **`registerRenderer`** function to register custom style attributes.
Once registered the change detection will also watche the registered Attribute

```js
const customStyleRenderer = (styles, { selector }) => {
  const { value } = styles.opacity || {};
  if (value === undefined) return '';
  return `${selector} { opacity: ${value / 100}; }`;
};

dispatch('quantumpress/viewports').registerRenderer(
  'customOpacity',        // property name
  customStyleRenderer,    // renderer callback
  20,                     // optional priority
  { panel: '.opacity-panel', label: '.opacity-panel .components-panel-header' }
);
