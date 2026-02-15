## Version 0.9.11
### 🚀 New & Changed
- Implemented php style engine
	- Removed attribute inlineStyles to render css by php in frontend
	- Replaced incrementing frontend classes with hashes from css properties
	- Added selector mapping to remap css properties inline
	- Added more depth to ignore inline property removal on block save
- Indicator injection via ToolsPanelItems
	- Added InspectorPanelItem component to handle external implementations
	- Added groupId and panelId parameters on registerRenderer api
	- Removed selectors parameter on registerRenderer api
	- Updated native style property renderers
	- Temporarily deactivated highlight property function
	- Shifted block register component
	- Adjusted indicator position in ui
- Performance and Optimizations
	- PHPCS optimizations with syde/phpcs standard
	- Streamlined TS + PHP syntax and indentation optimizations
	- Implemented useStyleOverride to render css in block edit and preview
	- Further optimized viewport management
	- Runtime optimizations for useDeviceType + useResizeEditor
	- Adjusted store dependencies on block edit
	- Activate keyframes on indicator device-type click when its viewport is unreachable
	- Removed isReady from store
	- Removed initial setting viewports attribute
	- Removed translation .mo and .po files to load via wordpress.org
- Implemented inpsyde/modularity
	- Registered styles module as base for block rendering and saving in php
	- Registered parser and processor as service of styles
	- Registered editor module to load scripts first
	- Updated existing php files to handle services
	- Replaced plugin constants with plugin services
### 🐛 Fixes
- Fixed insecure useSelect dependencies
- Fixed issue on spectrumSet generation with undefined values
- Fixed empty key notices
- Fixed has states on spectrumSets
- Fixed reducer updating lastEdit
- Fixed wrong min-width in editing toggle
- Fixed useDeviceType init
- Fixed keyframe controls handling clientId
- Fixed hickup with removes on spectrumSets

## Version 0.9.10
### 🚀 New & Changed
- Hotfixed composer autoloading.
- Updated TypeScript structure from referencing to aliasing.

## Version 0.9.9
### 🚀 New & Changed
- Removed Wikimedia CSS Sanitizer due to conflicts with code policies.
- Added `wp_strip_all_tags()` to properly escape CSS, aligning with WordPress core behavior for custom CSS.
- Updated Inpsyde PHPCS to Syde PHPCS.
- Updated PHP codebase to comply with new PHPCS policies.
- Improved PHP documentation patterns.

## Version 0.9.8
### 🚀 New & Changed
- Renamed plugin from “Viewports” to **“Quantum Viewports”** to meet WordPress.org directory requirements.
- Integrated Wikimedia CSS Sanitizer parser for improved CSS validation and security.
- Added `react-json-view` integration (forked from `mac-s-g/react-json-view`) for enhanced JSON debugging and inspection.
- Updated all PHP code to conform to `inpsyde/php-coding-standards`.

### 🐛 Fixes
- Fixed localization files that were previously hard-included.
- Multiple CSS fixes and refinements in the Style Inspector.

## Version 0.9.7
### 🚀 New & Changed
- Added localization for both PHP and TypeScript.
- Fixed WordPress plugin-check issues.
- Split CSS and JS assets.
- Streamlined text domains.
- Removed unnecessary test error throws.

### 🐛 Fixes
- Fixed an issue where localized TypeScript strings were bypassed by the ignore-mangling process during compression.
