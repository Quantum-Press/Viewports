---
version: "0.9.12"
last_updated: "2026-04-19"
project: "Quantum Viewports"
ai_context: true
---

# Skills — Quantum Viewports

## Projektübersicht

**Quantum Viewports** ist ein WordPress-Plugin, das den Gutenberg Block Editor um viewport-spezifische (responsive) Stil-Kontrollen erweitert. Redakteure können Block-Styles für Desktop, Tablet und Mobile separat definieren — direkt im Editor, ohne eigenes CSS.

- **Version:** 0.9.12
- **Typ:** WordPress-Plugin
- **Autor:** Sebastian Buchwald / Quantum-Press
- **Lizenz:** GPLv2 oder später
- **Repository:** https://github.com/Quantum-Press/Viewports
- **Website:** https://quantum-press.com
- **PHP:** 7.4+ / 8.0+
- **Architektur:** Modular (inpsyde/modularity), PSR-4, Mozart Dependency Isolation
- **Frontend:** TypeScript, React, SCSS, Webpack
- **Store:** Redux-like via `@wordpress/data`

---

## CRITICAL: Viewport-Attribut-Datenmodell

Dies ist das zentrale Konzept des Plugins. Jeder Block speichert viewport-spezifische Styles in einem `viewports`-Attribut.

### Block-Attribut-Schema

```
{
  style: {                          // WordPress Default-Styles (Viewport 0)
    spacing: { padding: "20px" },
    border: { radius: "5px" }
  },
  viewports: {                      // Viewport-spezifische Overrides
    360: {                          // Mobile (360px)
      style: {
        spacing: { padding: "10px" }
      }
    },
    780: {                          // Tablet (780px)
      style: {
        spacing: { padding: "15px" },
        border: { radius: "3px" }
      },
      to: 1359                      // optional: max-width Grenze
    },
    1360: {                         // Desktop (1360px)
      style: {
        spacing: { padding: "30px" }
      }
    }
  }
}
```

**Schlüssel-Konzepte:**
- `style` = WordPress-Standard-Block-Styles (Viewport 0 / Default)
- `viewports` = Map von Viewport-Pixelbreiten zu Style-Overrides
- Jeder Viewport-Eintrag hat ein `style`-Objekt (gleiche Struktur wie WordPress `style`)
- Optionales `to`-Feld definiert max-width für Media-Query-Range
- Viewport-Keys sind **Pixel-Zahlen** (0, 360, 780, 1360, 1920)

### Viewport-Definitionen & Breakpoints

**Standard-Distribution (default):**

| Key | Label | Bereich |
|-----|-------|---------|
| `0` | Default | Basis-Styles ohne Media Query |
| `360` | WordPress - Mobile | Mobile (≤ 779px) |
| `780` | WordPress - Tablet | Tablet (780px – 1359px) |
| `1360` | VP - Desktop small | Desktop (≥ 1360px) |
| `1920` | VP - Desktop large | Desktop large (≥ 1920px) |

**Extended Distribution (konfigurierbar):**

| Key | Label |
|-----|-------|
| `0` | Default |
| `320` | VP - Mobile small |
| `360` | WordPress - Mobile |
| `375` | VP - Mobile medium |
| `425` | VP - Mobile large |
| `540` | VP - Tablet tiny |
| `768` | VP - Tablet small |
| `780` | WordPress - Tablet |
| `820` | VP - Tablet medium |
| `1024` | VP - Tablet large |
| `1180` | VP - Tablet xlarge |
| `1280` | VP - Desktop tiny |
| `1360` | VP - Desktop small |
| `1650` | VP - Desktop medium |
| `1920` | VP - Desktop large |
| `2560` | VP - Desktop xlarge |
| `3440` | VP - Desktop xxlarge |

**Range-Erkennung:**
- Mobile: `viewport <= 779` (tabletBreakpoint - 1)
- Tablet: `780 <= viewport <= 1359`
- Desktop: `viewport >= 1360`

### Generierte Media Queries

```css
/* Viewport 360 (nur min-width) */
@media (min-width: 360px) { .wp-block-xyz { padding: 10px; } }

/* Viewport 780 mit to-Feld (min + max) */
@media (min-width: 780px) and (max-width: 1359px) { .wp-block-xyz { padding: 15px; } }

/* Viewport 1360 (nur min-width) */
@media (min-width: 1360px) { .wp-block-xyz { padding: 30px; } }
```

---

## Unterstützte Style Properties

### Native WordPress Properties (via `wp_style_engine_get_styles`)

| Property Key | CSS-Bereiche | Inspector Group |
|-------------|-------------|-----------------|
| `background` | background-color, background-image, gradient | `background` |
| `border` | border-width, border-color, border-radius, border-style | `border` |
| `dimensions` | width, height, min-width, min-height, max-width, max-height | `dimensions` |
| `shadow` | box-shadow | `border` |
| `spacing` | margin, padding | `dimensions` |

### Custom Properties (qp-Prefix)

| Property Key | CSS-Bereich |
|-------------|-------------|
| `qpBackground` | Erweiterte Background-Optionen |
| `qpBoxShadow` | Erweiterte Box-Shadow-Kontrolle |
| `qpClipPath` | clip-path |
| `qpColumn` | column-count, column-gap |
| `qpDimensions` | Erweiterte Dimensions |
| `qpFilter` | filter, backdrop-filter |
| `qpFlex` | flex, flex-grow, flex-shrink, align-self |
| `qpOpacity` | opacity |
| `qpOverflow` | overflow, overflow-x, overflow-y |
| `qpPosition` | position, top, right, bottom, left, z-index |
| `qpTextShadow` | text-shadow |
| `qpTransform` | transform, transform-origin |
| `qpVisibility` | visibility, display |

### Selector Mapping (Block-spezifische Remaps)

Einige Blocks brauchen CSS auf Kinder-Elemente statt auf den Wrapper:

```typescript
// Beispiel: core/image — border und shadow auf <img> statt auf den Block-Wrapper
'core/image': {
  border: '> img',
  shadow: '> img'
}
```

Das Mapping wird sowohl in JS (Store) als auch in PHP (Parser) angewandt.

---

## SpectrumSet — Zentrales Rendering-Konzept

Ein **SpectrumSet** ist ein optimiertes Array von `Spectrum`-Objekten, das CSS-Regeln über alle Viewport-Breakpoints darstellt. Es ist die zentrale Zwischenrepräsentation zwischen Block-Attributen und CSS-Output.

### Spectrum-Objekt Struktur

```typescript
interface Spectrum {
  from: number;          // Start-Viewport (min-width in px)
  to: number;            // End-Viewport (max-width in px)
  media: string;         // Media Query String
  type: string;          // 'attributes' | 'inline'
  property: string;      // Style Property Key (z.B. 'spacing')
  selector: string;      // CSS Selector
  declarations: string;  // CSS Declarations
  css: string;           // Komplette CSS Rule
  changes: BlockStyles;  // Ungespeicherte Änderungen
  hasChanges: boolean;
  saves: BlockStyles;    // Gespeicherte Styles
  hasSaves: boolean;
  removes: BlockStyles;  // Zu löschende Styles
  hasRemoves: boolean;
  blockName: string;
}
```

### Generierungsprozess

```
Block Attributes
  → findBlockSaves() → ViewportStyleSets
  → Generator.generateRuleSet() → RuleSet
  → Generator.getSpectrumSet() → SpectrumSet (collapsed/optimiert)
```

Benachbarte Viewports mit identischen Styles werden zu einem Spectrum zusammengefasst (collapsed), um die CSS-Ausgabe zu optimieren.

---

## Redux Store Architektur

**Store Name:** `'quantumpress/viewports'`

### State Struktur

```typescript
{
  // Viewport-Konfiguration
  viewports: { [key: number]: string },  // z.B. { 0: 'Default', 360: 'Mobile', ... }
  viewport: number,                       // Aktuell ausgewählter Viewport (px)
  iframeSize: { width: number, height: number },
  iframeViewport: number,
  desktop: number,                        // Desktop Breakpoint (1360)
  tablet: number,                         // Tablet Breakpoint (780)
  mobile: number,                         // Mobile Breakpoint (360)

  // UI-Flags
  isActive: boolean,                      // Viewport-Simulation aktiv
  isLoading: boolean,
  isSaving: boolean,
  isAutoSaving: boolean,
  isRegistering: boolean,
  isEditing: boolean,                     // Editor-Modus aktiv
  isInspecting: boolean,                  // Keyframe-Inspector aktiv
  inspectorPosition: string,              // 'left' | 'right'

  // Block Style Data (pro clientId)
  saves: ClientViewportSets,              // Gespeicherte Viewport-Styles
  changes: ClientViewportSets,            // Ungespeicherte Änderungen
  removes: ClientViewportSets,            // Zum Löschen markierte Styles
  valids: ClientViewportSets,             // Aktuell gültig (merged: saves + changes - removes)

  // Rendering & CSS
  renderer: RendererPropertySet,          // Registrierte Style-Renderer
  cssSet: CSSViewportSets,                // Generiertes CSS pro Block
  spectrumSets: SpectrumSets,             // Optimierte Spectrum-Regeln

  // Meta
  inspect: object | boolean,
  lastEdit: number                        // Timestamp der letzten Änderung
}
```

### Wichtige Selektoren

```typescript
// Viewport-Konfiguration
getViewports(): { [key: number]: string }
getViewport(): number
getDesktop(): number
getTablet(): number
getMobile(): number

// Block-Daten
getBlockSaves(clientId): ViewportStyleSets
getBlockChanges(clientId): ViewportStyleSets
getBlockValids(clientId): ViewportStyleSets
hasBlockViewports(clientId): boolean
hasBlockSaves(clientId): boolean
hasBlockChanges(clientId): boolean

// CSS & Rendering
getCSS(clientId): string                  // Kompiliertes CSS für aktuelle Iframe-Breite
getGeneratedBlockSaves(clientId): ViewportStyleSets  // Bereinigte Saves für Attribut-Speicherung
getSpectrumSet(clientId): Spectrum[]      // Spectrum-Array für Property-Indikatoren
```

### Wichtige Actions

```typescript
// Block-Lifecycle
registerBlockInit(clientId, blockName, attributes)     // Block initialisieren
updateBlockChanges(clientId, blockName, attributes, viewport?)  // Änderungen verarbeiten
saveBlock(clientId, blockName)                          // Changes → Saves mergen
restoreBlockSaves(clientId, blockName, props, viewport) // Änderungen rückgängig machen
removeBlockSaves(clientId, blockName, props, viewport)  // Styles löschen markieren

// Renderer
registerRenderer(prop, callback, priority, groupId, panelId, mapping)

// Viewport
setViewport(viewport: number)
setViewportType(type: string)             // 'Desktop' | 'Tablet' | 'Mobile'
```

### Datenfluss: saves / changes / removes / valids

```
Block wird ausgewählt
  → registerBlockInit() liest viewports-Attribut → speichert in saves[clientId]

User ändert Style im Editor
  → updateBlockChanges() berechnet Diff → speichert in changes[clientId]
  → valids = saves + changes - removes (automatisch berechnet)
  → SpectrumSet + CSS wird neu generiert

User speichert Block
  → getGeneratedBlockSaves() → merge(saves + changes - removes) → bereinigt leere Viewports
  → setAttributes({ viewports: cleanedSaves })
```

---

## registerRenderer API — Vollständige Signatur

### JavaScript (Store Action)

```typescript
registerRenderer(
  prop: string,              // Property Key (z.B. 'qpCustomGradient')
  callback: Function,        // CSS-Generation Callback
  priority: number = 10,     // Ausführungs-Priorität (native: 5, custom: 10+)
  groupId: string = '',      // Inspector Panel Group ID
  panelId: string = '',      // Inspector Panel ID
  mapping?: RendererMapping  // Block-spezifisches Selector Mapping
): Action
```

**Callback-Funktion:**
```typescript
(styleValue: any, valids?: any): string => {
  // Muss gültigen CSS-String zurückgeben:
  // Entweder Declarations: "color: red; padding: 10px;"
  // Oder mit Selector: ".my-selector { color: red; }"
  return 'background: linear-gradient(...)';
}
```

**Beispiel:**
```typescript
dispatch.registerRenderer(
  'qpCustomGradient',
  (styleObj) => `background: linear-gradient(${styleObj.direction}, ${styleObj.colors.join(', ')});`,
  15,
  'design',
  'customGradients',
  { 'core/image': '> img.gradient-overlay' }
);
```

### PHP (Filter-basiert)

```php
// Nativer Renderer-Override
add_filter('quantum_viewports_register_renderer_spacing', function($css, $blockName, $value) {
    // Custom CSS für spacing generieren
    return $customCss;
}, 10, 3);

// Für custom properties
add_filter('quantum_viewports_register_renderer_qpCustom', function($css, $blockName, $value) {
    return "opacity: {$value['opacity']};";
}, 10, 3);
```

---

## PHP Style Engine — Parser & Processor

### Datenfluss (PHP-seitig)

```
Post wird gespeichert / gerendert
  → Processor.preparePostContent() iteriert Blöcke
  → Parser.parseAttributes() liest style + viewports aus Block-Attributen
  → Parser.parseViewportRules() generiert CSSRule pro Viewport
  → Parser.parseStyleAttribute() generiert CSS pro Property
    → Native Properties: wp_style_engine_get_styles() + Filter
    → Custom Properties: quantum_viewports_register_renderer_[property] Filter
  → Parser.remapSelectors() mapped CSS auf Kinder-Elemente
  → CSSRuleSet sammelt alle Rules
  → CSS wird im Frontend ausgegeben (inline oder enqueued)
```

### CSSRule Struktur (PHP)

```php
{
  type: 'attributes' | 'inline',
  property: string,         // z.B. 'spacing'
  selector: string,         // z.B. '.wp-block-image'
  declarations: array,      // ['padding' => '20px', 'margin' => '10px']
  media: 'screen',
  minWidth: int,            // z.B. 780
  maxWidth: int,            // z.B. 1359
  css: string               // Generierter CSS-String
}
```

### Wichtige PHP Hooks & Filter

| Hook / Filter | Typ | Beschreibung |
|---------------|-----|--------------|
| `quantum_viewports_init` | Action | Plugin initialisiert, Container verfügbar |
| `quantum_viewports_migrate` | Action | Plugin installiert oder aktualisiert |
| `quantum_viewports_migrate_on_update` | Action | Nur bei Update (nicht Fresh Install) |
| `quantum_viewports_native_properties` | Filter | Native Properties Array [background, border, dimensions, shadow, spacing] |
| `quantum_viewports_register_renderer_[property]` | Filter | CSS-Generierung pro Property überschreiben |
| `quantum_viewports_ignore_properties` | Filter | Properties die nicht in Inline-HTML geschrieben werden |
| `quantum_viewports_selector_mapping` | Filter | Block-spezifisches Selector Remapping |
| `quantum_viewports_selector_prefix` | Filter | CSS-Selector-Prefix anpassen (v0.9.12) |
| `quantum_viewports_block_blacklist` | Filter | Blocks von Viewport-Verarbeitung ausschließen |

### PHP Namespaces & Services

```php
QP\Viewports\                     // includes/
QP\Viewports\Vendor\              // lib/packages/ (Mozart-isoliert)
QP\Viewports\Styles\              // modules/styles/src/
QP\Viewports\Editor\              // modules/editor/src/

// Kernklassen
QP\Viewports\Styles\Services\Parser       // CSS Parsing & Generierung
QP\Viewports\Styles\Services\Processor    // Block-Verarbeitung
QP\Viewports\Styles\CSSRule               // Einzelne CSS-Regel
QP\Viewports\Styles\CSSRuleSet            // Regel-Sammlung
QP\Viewports\Styles\Block                 // Block mit Viewport-Styles
```

---

## Globale Konfiguration (Runtime)

Über `window.quantumViewportsConfig` (PHP → JS via wp_localize_script):

| Key | Wert | Beschreibung |
|-----|------|-------------|
| `distribution` | `'standard'` \| `'extended'` | Viewport-Set Konfiguration |
| `gutenbergVersion` | String | Gutenberg Version für Kompatibilitätsprüfungen |
| `blockBlacklist` | Array | Blocks die nicht viewport-fähig gemacht werden |

**Config-Zugriff (TypeScript):**
```typescript
import { getConfig, getConfigValue, isInBlockBlacklist } from './config';

const distribution = getConfigValue<string>('distribution', 'standard');
const isBlocked = isInBlockBlacklist('core/freeform');
```

---

## Block Integration — Wie Blocks viewport-fähig werden

### Registrierung (addFilter)

```typescript
// src/block/register.tsx
addFilter('blocks.registerBlockType', 'qp/viewports-block', (block) => {
  if (isInBlockBlacklist(block.name)) return block;
  return {
    ...block,
    edit(props) { /* Wrapper mit BlockEdit, BlockPreview, ToggleInspector */ },
    save(props) { /* Wrapper mit BlockSave (viewport styles anwenden) */ }
  };
});
```

### Block Edit Lifecycle

```
1. BlockEdit mount → registerBlockInit(clientId, blockName, attributes)
2. Attribute Change → updateBlockChanges(clientId, blockName, attributes)
3. Store berechnet: diffs → valids → spectrumSets → cssSet
4. getGeneratedBlockSaves(clientId) → bereinigte ViewportStyleSets
5. setAttributes({ viewports: cleanedSaves })
```

### Plugin Registration

```typescript
// src/plugins.tsx
registerPlugin('quantum-viewports-device-type', { render: DeviceTypeProvider });
registerPlugin('quantum-viewports-keyframes-toggle', { render: KeyframesToggle });
```

---

## Wichtige Custom Hooks

### useDeviceType

Synchronisiert Gutenberg `deviceType` (Desktop/Tablet/Mobile) mit dem Store Viewport:
- Lauscht auf `core/editor` Store → dispatcht `setViewportType()`
- Lauscht auf Store Viewport → dispatcht `setDeviceType()` an Editor
- Verhindert Endlos-Loops mit `ignore`-Flag

### useResizeEditor

Skaliert den Editor-Canvas auf die ausgewählte Viewport-Breite:
- ResizeObserver auf `.interface-interface-skeleton__content`
- Berechnet Scale-Faktor wenn `viewport > maxWidth`
- Wendet CSS Transform `scale()` auf Iframe an
- Dispatcht `setIframeSize()` mit gemessenen Dimensionen

### useStyleOverride

Rendert CSS im Block Edit und Preview Modus:
- Liest `cssSet` aus Store für aktuellen Block
- Injiziert CSS über WordPress `useStyleOverride` oder `<style>` Tags

---

## Verfügbare Befehle

| Befehl | Beschreibung | Kontext |
|--------|-------------|---------|
| `npm run build` | Production-Build (Webpack, minifiziert) | Assets für Distribution |
| `npm run dev` | Development-Build (Source Maps) | Während Entwicklung |
| `npm run watch:build` | Watch-Modus für Live-Recompilation | Echtzeit-Kompilierung |
| `npm run test` | Jest Test-Suite | Unit-Tests TypeScript/React |
| `composer phpcs` | PHP CodeSniffer mit Syde Standard | PHP Code-Style validieren |
| `npm install` | NPM Dependencies installieren | Nach package.json Änderungen |
| `composer install` | Composer Dependencies installieren | Nach composer.json Änderungen |

### Build-Prozess

- **Entry Point:** `src/main.ts`
- **Webpack Config:** `webpack.config.js`
- **Output:** `build/` Verzeichnis
- **CSS Output:** `quantum-viewports.css` (via MiniCssExtractPlugin)
- **JS Output:** `core.js`

---

## Dateistruktur

```
quantum-viewports/
├── quantum-viewports.php        # Plugin Entry Point
├── bootstrap/
│   ├── bootstrap.php            # Container-Setup, Service Registration
│   └── modules.php              # Module-Registrierung (Styles, Editor)
├── includes/                    # Core PHP (QP\Viewports\)
│   ├── Plugin.php               # Main Plugin Class
│   ├── PluginModule.php         # Modularity Module Definition
│   ├── VPP.php                  # Static Container Accessor
│   ├── FilePathPluginFactory.php
│   └── services.php             # Service Definitionen
├── modules/
│   ├── styles/src/              # PHP Style Engine (QP\Viewports\Styles\)
│   │   ├── Services/
│   │   │   ├── Parser.php       # CSS Parsing, Viewport-Rule-Generierung
│   │   │   └── Processor.php    # Block-Verarbeitung, Post-Content Processing
│   │   ├── Block.php
│   │   ├── CSSRule.php
│   │   └── CSSRuleSet.php
│   └── editor/src/              # Editor Module (QP\Viewports\Editor\)
│       └── EditorModule.php
├── src/                         # TypeScript/React Frontend
│   ├── main.ts                  # Webpack Entry
│   ├── config.ts                # Runtime Config (quantumViewportsConfig)
│   ├── editor.scss              # Editor-only Styles
│   ├── plugins.tsx              # Gutenberg Plugin Registration
│   ├── portals.tsx              # React Portals Setup
│   ├── subscribes.ts            # Store Subscriptions
│   ├── block/                   # Block Integration
│   │   ├── register.tsx         # addFilter für blocks.registerBlockType
│   │   └── edit.tsx             # BlockEdit Component
│   ├── components/              # UI Components (React)
│   ├── hooks/                   # Custom Hooks
│   │   ├── use-device-type.tsx  # Gutenberg ↔ Store Viewport Sync
│   │   ├── use-resize-editor.ts # Editor Canvas Scaling
│   │   └── ...
│   ├── store/                   # Redux Store
│   │   ├── index.ts             # Store Registration
│   │   ├── default.ts           # Initial State
│   │   ├── reducer.ts           # Reducer (registerBlockInit, updateBlockChanges, ...)
│   │   ├── actions.ts           # Action Creators
│   │   ├── selectors.ts         # Selectors (getCSS, getBlockSaves, ...)
│   │   ├── generator.ts         # SpectrumSet Generator
│   │   └── utils.ts             # Store Utilities
│   ├── types/                   # TypeScript Type Definitions
│   │   └── store.ts             # ViewportStyleSets, Spectrum, etc.
│   ├── utils/                   # Utility Functions (pure)
│   ├── hacks/                   # WordPress/Gutenberg Workarounds
│   └── setup/                   # Initialization
├── config/
│   └── elements.json            # 112 erlaubte HTML-Elemente für Selector-Validierung
├── tests/                       # Test-Dateien
├── build/                       # Kompilierte Assets (generiert)
├── vendor/                      # Composer Dependencies
├── lib/                         # Mozart-isolierte Dependencies
├── languages/                   # i18n Translations
├── package.json                 # NPM (v0.9.12)
├── composer.json                # Composer (v0.9.12)
├── webpack.config.js
├── tsconfig.json
├── jest.config.ts
└── phpunit.xml
```

---

## Konventionen

### PHP
- **Standard:** Syde PHPCS (`composer phpcs`)
- **Namespace:** PSR-4 (`QP\Viewports\*`)
- **Typisierung:** `declare(strict_types=1)`, Type Hints bevorzugt
- **DI:** Service Container (inpsyde/modularity), Dependency Injection bevorzugt
- **Hooks:** Prefix `quantum_viewports_`

### TypeScript/React
- **Components:** PascalCase (z.B. `ViewportSelector.tsx`)
- **Hooks:** camelCase mit `use`-Prefix (z.B. `useDeviceType.tsx`)
- **Types:** PascalCase in `src/types/`
- **Utils:** camelCase, pure Functions, keine Side Effects
- **Store:** `@wordpress/data` Pattern mit Selectors + Actions

### CSS/SCSS
- **Klassen:** BEM mit `qp-` Prefix (z.B. `qp-viewport-selector__trigger--active`)
- **Variables:** `--qp-` Prefix
- **Editor-only:** `src/editor.scss` — Frontend-CSS wird dynamisch via PHP generiert

---

## Abhängigkeiten

### PHP (Production)
- **psr/log** ^1.1 — PSR-3 Logging
- **wikimedia/composer-merge-plugin** ^2.0 — Module composer.json Merge
- **wp-oop/wordpress-interface** — WordPress Type Hints
- **dhii/versions** — Version Parsing
- **inpsyde/modularity** ^1.12 — Plugin Architecture (via Mozart isoliert in `/lib/`)

### JavaScript (WordPress APIs)
- **@wordpress/data** — Store/State Management
- **@wordpress/element** — React Integration
- **@wordpress/primitives** — UI Primitives
- **@wordpress/style-engine** — CSS Generation
- **@webkinect/react-json-view** — JSON Viewer (Fork)

### Build Tools
- **TypeScript** ^5.x, **Webpack** ^5.x, **Babel**, **SCSS/Sass**, **Jest**

---

## Bekannte Einschränkungen

1. **Block Editor Viewport-Preview:** WordPress rendert immer im Default-Viewport. Workaround: `useResizeEditor` skaliert den Canvas via CSS Transform.
2. **Highlight Property:** Temporär deaktiviert (seit v0.9.11).
3. **Third-Party Blocks:** Funktionieren grundsätzlich, brauchen aber ggf. Custom Renderer und Selector Mapping.
4. **Mobile Preview:** Vorschau-Verhalten kann auf mobilen Geräten variieren.
5. **CSS-Volumen:** Viele Viewports × viele Properties × viele Blocks = potenziell großes CSS. Mitigation: SpectrumSet-Collapsing.

---

## Aufgaben-Leitfaden für KI-Assistenten

### Neuen Custom Renderer hinzufügen
1. JavaScript: `registerRenderer()` via Store Dispatch
2. PHP: Filter `quantum_viewports_register_renderer_[property]` registrieren
3. Optional: Selector Mapping über `mapping`-Parameter definieren
4. Tests schreiben

### Neuen Viewport hinzufügen
1. Distribution-Konfiguration anpassen (PHP-seitig: `window.quantumViewportsConfig`)
2. Store `viewports` Default-State aktualisieren (`src/store/default.ts`)
3. Range-Detection Funktionen prüfen (`isInMobileRange`, `isInTabletRange`, `isInDesktopRange`)

### Block-Support erweitern
1. Prüfen ob Block in `blockBlacklist` → ggf. entfernen
2. Selector Mapping für den Block definieren wenn CSS auf Kinder-Elemente muss
3. ggf. Custom Renderer für block-spezifische Properties

### PHP Service hinzufügen
1. Klasse in `includes/` oder `modules/*/src/` erstellen (PSR-4 Namespace)
2. In `services.php` oder `*Module.php` registrieren
3. Type Hints für Dependencies
4. PHPUnit Tests

---

## Merge-Hinweise

Dieser Skill kann mit folgenden Skills kombiniert werden:

- **wp-plugin-rules** — Definiert Code-Standards und Analyse-Workflow. SKILLS.md hat Vorrang bei Viewport-spezifischer Logik.
- **documentation-rules** — Stellt Dokumentationspflege sicher. Dokumentationsstruktur hat documentation-rules Vorrang.
- **viewports-analyzer** — Nutzt SKILLS.md als Kontext für Code-Audit und Optimierungsanalyse.
