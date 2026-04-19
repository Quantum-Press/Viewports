---
version: "0.9.12"
last_updated: "2026-04-19"
project: "Quantum Viewports"
---

# Briefing — Quantum Viewports

## Zusammenfassung

Quantum Viewports ist ein WordPress-Plugin für die Gutenberg Block Editor, das Blöcke mit viewport-spezifischen (responsive) Style-Kontrollen erweitert. Das Plugin ermöglicht es Editoren und Entwicklern, Block-Eigenschaften wie Margin, Padding und andere Style-Attribute unabhängig für Desktop, Tablet und Mobile anzupassen, ohne separate CSS oder Media Queries manuell zu schreiben.

**Status:** Early Access (v0.9.12)
**Lizenz:** GPLv2 oder später
**Repository:** https://github.com/Quantum-Press/Viewports

---

## Themengebiet: Responsive Style Engine

Der Kern des Plugins ist die PHP-basierte Responsive Style Engine, die CSS pro Viewport generiert, speichert und ausliefert.

### Anforderungen

- **REQ-RSE-001** CSS-Generierung pro Block und Viewport
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11 (PHP Style Engine)
  - Die Processor/Parser-Services in `modules/styles/src/Services/` erzeugen CSS-RuleSets aus Block-Attributen
  - Viewport-Daten werden aus `attrs.viewports` gelesen und in Media Queries umgewandelt
  - CSSRuleSet generiert Hash-basierte Klassen (`vp-[hash]`) statt inkrementeller Nummern

- **REQ-RSE-002** Inline-CSS-Rendering auf dem Frontend
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - CSS wird via `wp_add_inline_style()` in den Frontend ausgegeben
  - Verwendung von `wp_strip_all_tags()` für CSS-Escaping (WordPress-Core-konform)
  - StylesModule registriert CSS per Block-Render und enqueued sie in `wp_enqueue_scripts`

- **REQ-RSE-003** Media Query und Viewport-Management
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - Viewports werden anhand von Breakpoints (z.B. `1360px`) definiert
  - CSS wird mit Min-Width Media Queries generiert (Mobile-First)
  - Viewport-Daten sind strukturiert als `viewports: { [breakpoint]: { style: {...} } }`

- **REQ-RSE-004** CSS-Validation und Sanitization
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.9
  - Removed Wikimedia CSS Sanitizer (Policy-Konflikt), jetzt auf `wp_strip_all_tags()` basierend
  - Safe-Style-Filter registriert erlaubte CSS-Properties (z.B. `display`, `background-repeat`)
  - Block-Save wird gefiltert via `render_block` Hook mit CSS-Rendering

- **REQ-RSE-005** CSS-Kompression und Hash-Optimierung
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - CSSRuleSet::compress() entfernt redundante/doppelte Properties
  - Hash-basierte Klassennamenvergabe (`vp-[hash]`) statt inkrementeller Zähler
  - Selector-Mapping für CSS-Property-Zuordnung

### Entscheidungen

- [2025-11-01] PHP Style Engine mit `wp_strip_all_tags()` statt Wikimedia CSS Sanitizer für bessere WordPress-Kompatibilität und Policy-Einhaltung (v0.9.9)
- [2025-10-01] Wechsel zu Hash-basierten Klassen (`vp-[hash]`) für deterministisches CSS und bessere Performance (v0.9.11)
- [2025-09-01] InlineStyles-Attribute in Frontend-Rendering entfernt; CSS wird vollständig via PHP generiert (v0.9.11)

---

## Themengebiet: Block Editor Integration

Die Integration in den Gutenberg Block Editor erfolgt über React/TypeScript-Komponenten im Editor und Hooks für Block-Registrierung.

### Anforderungen

- **REQ-BEI-001** Block-Filter und Register-Wrapper
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - `blocks.registerBlockType` Hook in `/src/block/register.tsx` wrapping alle Blöcke
  - Block-Blacklist-Filtering (z.B. `cloudcatch/light-modal-block`)
  - BlockEdit/BlockSave/BlockPreview Komponenten werden um Block herum gechaped

- **REQ-BEI-002** Inspector Panel und Viewport-Toggle
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - `ToggleInspector` Komponente im BlockControls/ToolbarGroup
  - Viewport-Auswahl (Desktop, Tablet, Mobile) in Inspector
  - InspectorPanelItem Komponente für externe/native Property-Renderer

- **REQ-BEI-003** Keyframe-ähnliches UI für CSS-Inspektion
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Keyframe View zeigt generiertes CSS pro Viewport
  - Style-Liste mit Möglichkeit, CSS pro Viewport zu löschen/zurückzusetzen
  - Highlight-Funktion zur Visualisierung von aktiven Properties

- **REQ-BEI-004** Viewport-spezifische Kontrollen in der Sidebar
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - Standard-Block-Properties (Dimensionen, Spacing, Border, Shadow, etc.) sind viewport-enabled
  - useStyleOverride Hook rendert CSS im Block-Edit und Preview
  - useDeviceType Hook detectiert aktuellen Editor-Viewport

- **REQ-BEI-005** Block-Blacklist und Config
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Config in `src/setup/config.ts` mit Block-Blacklist und Viewport-Breakpoints
  - `quantumViewportsConfig` wird via `wp_localize_script()` in Editor injiziert
  - Filterable via `quantum_viewports_block_blacklist` Hook

### Entscheidungen

- [2025-08-01] Block-Register Wrapper statt einzelner Block-Hooks für globale viewport-Unterstützung (v0.9.11)
- [2025-07-01] InspectorPanelItem für native Style-Property Renderer via groupId/panelId Parameter (v0.9.11)
- [2025-06-01] Shift von Block-Register-Komponente für bessere Hook-Verwaltung (v0.9.11)

---

## Themengebiet: Developer API

Die registerRenderer API ermöglicht Entwicklern, Custom Style Renderer für Blöcke und Themes zu registrieren.

### Anforderungen

- **REQ-API-001** registerRenderer JavaScript API
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - Funktion im globalen Store (`src/store/`) zum Registrieren von Custom Renderern
  - Parameter: `blockName`, `propertyName`, `priority`, `groupId`, `panelId`, optional `css` Template
  - Reducer-basiert mit Priority-Sorting für Rendering-Order

- **REQ-API-002** Custom CSS-Rendering und Selector-Mapping
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - CSS-Template mit Placeholder-Unterstützung (`%{...}`)
  - Selector-Mapping zum Remappen von CSS-Properties auf Block-Attribute
  - Frontend CSS-Generierung via Processor/Parser PHP-Services

- **REQ-API-003** PHP Style-Renderer Extension Points
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Hooks: `quantum_viewports_modules` zum Hinzufügen/Entfernen von Modulen
  - Hooks: `quantum_viewports_block_blacklist` zum Filtern der Blockierungsliste
  - Hooks: `quantum_viewports_invalid_post_types` für Post-Type-Ausschuss
  - Hooks: `quantum_viewports_selector_prefix` zur Anpassung des Selector-Prefix (v0.9.12)
  - Hooks: `quantum_viewports_migrate` / `quantum_viewports_migrate_on_update` für Versionsverwaltung

- **REQ-API-004** Block- und Theme-Extensibility
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Custom Renderer können blockspezifisch oder global registriert werden
  - Panel- und Label-Hooks für UI-Customization
  - Support für externe Block-Libraries via registerRenderer

### Entscheidungen

- [2026-03-18] `quantum_viewports_selector_prefix` Filter eingeführt, um den CSS-Selector-Prefix anpassbar zu machen (v0.9.12)
- [2026-03-14] Block-Default-Handling in Parser/Processor überarbeitet; rcb-Post-Types werden beim Save ignoriert (v0.9.12)
- [2025-05-01] registerRenderer mit separaten groupId/panelId statt `selectors` Parameter für bessere UI-Kontrolle (v0.9.11)
- [2025-04-01] Priority-basiertes Sorting von Renderern für vorhersagbare Rendering-Order (v0.9.11)

---

## Themengebiet: Architektur & Modularität

Das Plugin nutzt inpsyde/modularity für eine saubere, modularisierte Architektur mit PSR-4 Autoloading und Mozart für Dependency Isolation.

### Anforderungen

- **REQ-ARCH-001** Inpsyde/Modularity Basis-Struktur
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - Package-basierte Architektur mit `bootstrap/bootstrap.php`
  - Module registrieren sich via `bootstrap/modules.php`
  - Styles Module und Editor Module als Haupt-Module

- **REQ-ARCH-002** Service Container und Dependency Injection
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - PSR-Container für Service-Registrierung
  - Services: `vp.plugin`, `vp.version`, `vp.path`, `vp.url`, `vp.textdomain`
  - Styles Module registriert `vp.styles.processor` und `vp.styles.parser`

- **REQ-ARCH-003** PSR-4 Autoloading und Namespace-Struktur
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - Namespace: `QP\Viewports\*` für Haupt-Plugin
  - Namespace: `QP\Viewports\Styles\*` für Styles Module
  - Namespace: `QP\Viewports\Editor\*` für Editor Module
  - Vendor-Autoloading via Composer (`vendor/autoload.php`)

- **REQ-ARCH-004** Mozart Dependency Isolation
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Externe Dependencies in `lib/packages/` (z.B. inpsyde/modularity, psr/container)
  - Namespace Rewriting via Mozart für Konflikt-Vermeidung
  - Vendor-Prefixing mit `QP\Viewports\Vendor\`

- **REQ-ARCH-005** Module-Interface Implementation
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - StylesModule implementiert ServiceModule und ExecutableModule
  - EditorModule implementiert ExecutableModule
  - Module registrieren Services, Hooks und Filter

- **REQ-ARCH-006** Plugin-Initialization und Version-Management
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - `plugins_loaded` Hook für Plugin-Bootstrap
  - `init` Hook für Version-Check und Migration
  - VPP Facade für Container-Zugriff

### Entscheidungen

- [2025-01-01] Implementierung von inpsyde/modularity als Basis-Architektur für bessere Wartbarkeit (v0.9.11)
- [2024-12-01] Styles Module als ServiceModule für zentrale CSS-Verarbeitung (v0.9.11)
- [2024-11-01] Mozart für Dependency Isolation zur Vermeidung von Versionskonflikten (v0.9.11)

---

## Themengebiet: Performance & Optimierung

Performance-Optimierungen in v0.9.11 umfassen Hook-Optimierungen, Runtime-Verbesserungen und Store-Effizienz.

### Anforderungen

- **REQ-PERF-001** useStyleOverride Hook für Block-Rendering
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - CSS-Rendering im Block-Edit und Preview ohne DOM-Manipulation
  - Frontend CSS wird via Processor-Service generiert
  - Reduziert Re-Renders durch Memoization

- **REQ-PERF-002** Store-Dependency Optimierung
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - useSelect Dependencies bereinigt (sichere Dependency Arrays)
  - Reducer-basierter Store für Vorhersagbarkeit
  - isReady Flag entfernt für weniger State-Aktualisierungen

- **REQ-PERF-003** Viewport und Device-Type Management
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - useDeviceType Hook mit optimierter Initialisierung
  - useResizeEditor Hook mit Runtime-Optimierungen
  - Viewport-Aktivierung bei Indicator-Click wenn unreachable

- **REQ-PERF-004** PHPCS Optimierungen
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Syde PHPCS Standard für Code-Style und Performanz
  - TypeScript/PHP Syntax Streamlining
  - Indentation und Struktur-Optimierung

- **REQ-PERF-005** Initial Setting Entfernung
  - Status: `umgesetzt`
  - Priorität: `niedrig`
  - Version: v0.9.11
  - Entfernung von `inlineStyles` Attribute initial setting
  - Reduziert Block-Attribute-Größe beim Save
  - CSS wird vollständig auf Frontend via Processor generiert

### Entscheidungen

- [2025-02-01] useStyleOverride für CSS-Rendering ohne DOM-Manipulation (v0.9.11)
- [2024-10-01] Runtime-Optimierungen für useDeviceType und useResizeEditor (v0.9.11)
- [2024-09-01] Entfernung von isReady Flag aus Store für weniger State-Updates (v0.9.11)

---

## Themengebiet: Code-Qualität & Standards

Konsistenz und Qualität des Codes werden durch PHPCS-Standards, TypeScript-Typing und Testing sichergestellt.

### Anforderungen

- **REQ-QA-001** Syde PHPCS Standard Compliance
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.9+
  - Syde PHPCS Standard für PHP-Code
  - Verwendet anstelle von inpsyde/php-coding-standards (veraltet)
  - Automatisierte Linting und Code-Style-Checks

- **REQ-QA-002** TypeScript Typing und Strict Mode
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - TypeScript 5.1.6 mit strict mode
  - Centralized Type-Definitions in `src/types/`
  - React 18.2 Typing für Block Components

- **REQ-QA-003** Unit Tests für Core-Funktionalität
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Jest für TypeScript-Tests
  - PHPUnit für PHP-Tests (z.B. CSSRulesetTest)
  - Reducer Tests für State-Management (`src/store/tests/`)

- **REQ-QA-004** Build-Prozess und Webpack-Konfiguration
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Webpack 5.88 mit Babel und TS-Loader
  - SCSS/CSS-Processing via Sass und Mini-CSS-Extract-Plugin
  - Production und Development Builds getrennt

- **REQ-QA-005** Documentation und Code-Comments
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - PHPDoc für PHP-Methoden
  - JSDoc für TypeScript-Funktionen
  - README.md und Developer Documentation

### Entscheidungen

- [2025-11-01] Wechsel zu Syde PHPCS Standard für bessere Wartbarkeit (v0.9.9)
- [2024-08-01] TypeScript-first Architektur für Type Safety (v0.9.11)
- [2024-07-01] Jest + PHPUnit für komprehensives Testing (v0.9.11)

---

## Themengebiet: Lokalisierung & Kompatibilität

Internationalisierung und Kompatibilität mit WordPress.org und verschiedenen Themes.

### Anforderungen

- **REQ-LOC-001** i18n für PHP und TypeScript
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.7+
  - `wp_set_script_translations()` für JavaScript-Strings
  - `quantum-viewports` Text Domain
  - Language Files via `/languages/` Verzeichnis (WordPress.org)

- **REQ-LOC-002** WordPress.org Plugin-Check Compliance
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.7+
  - Split CSS und JS Assets
  - Proper Escaping und Security-Headers
  - Plugin-Check validierter Code

- **REQ-LOC-003** Block Theme Kompatibilität
  - Status: `umgesetzt`
  - Priorität: `hoch`
  - Version: v0.9.11
  - Unterstützung für Standard-Blöcke
  - Block-Blacklist für inkompatible Blöcke
  - Gutenberg Version Detection (`gutenbergVersion()` in EditorModule)

- **REQ-LOC-004** Theme-agnostische CSS-Rendering
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - CSS wird via Inline Styles injiziert (nicht Theme-abhängig)
  - Safe-Style-Filter für WordPress-Kompatibilität
  - Viewport-breakpoints sind Theme-konfigurierbar

- **REQ-LOC-005** Plugin-Version-Management
  - Status: `umgesetzt`
  - Priorität: `mittel`
  - Version: v0.9.11
  - Version-Check auf init Hook
  - Migration Hooks für Updates
  - Stored Version Option für Change-Detection

### Entscheidungen

- [2025-06-01] Entfernung von .mo/.po Dateien; Load via WordPress.org (v0.9.11)
- [2025-03-01] Plugin-Umbenennung zu "Quantum Viewports" für WordPress.org Anforderungen (v0.9.8)
- [2024-06-01] Gutenberg Version Detection für Editor-Feature-Gating (v0.9.11)

---

## Projektstruktur Übersicht

```
quantum-viewports/
├── bootstrap/                    # Plugin-Bootstrap und Modulierung
│   ├── bootstrap.php            # Inpsyde/Modularity Package Setup
│   └── modules.php              # Module-Registrierung
├── modules/                      # Modularisierte Feature-Module
│   ├── styles/                  # CSS-Engine Module
│   │   ├── src/
│   │   │   ├── StylesModule.php # Hauptmodul (ServiceModule, ExecutableModule)
│   │   │   ├── Services/
│   │   │   │   ├── Processor.php # CSS-Generierung
│   │   │   │   └── Parser.php    # Block-Parsing
│   │   │   ├── CSSRuleSet.php   # CSS-Struktur
│   │   │   ├── CSSRule.php      # Einzelne CSS-Regel
│   │   │   └── Block.php        # Block-Wrapper
│   │   ├── services.php         # Service-Definitionen
│   │   └── module.php           # Module-Boot-File
│   └── editor/                  # Editor Integration Module
│       ├── src/
│       │   └── EditorModule.php # Script/Style Enqueue
│       └── module.php
├── src/                          # TypeScript/React Source
│   ├── block/                   # Block-Register und Filter
│   │   ├── register.tsx         # blocks.registerBlockType Hook
│   │   ├── edit.tsx             # BlockEdit Komponente
│   │   ├── save.tsx             # BlockSave Komponente
│   │   └── preview.tsx          # BlockPreview Komponente
│   ├── store/                   # Redux-like Store
│   │   ├── reducer.ts           # Reducer mit registerRenderer
│   │   ├── actions.ts           # Store Actions
│   │   ├── selectors.ts         # Store Selectors
│   │   └── tests/               # Jest Tests
│   ├── components/              # React Komponenten
│   │   ├── inspector/           # Inspector Panel Components
│   │   ├── viewports/           # Viewport UI
│   │   ├── indicator/           # Viewport Indicator
│   │   └── ... (andere)
│   ├── utils/                   # Utility Funktionen
│   ├── types/                   # TypeScript Type Definitions
│   ├── setup/                   # Initialisierung
│   └── ... (weitere Struktur)
├── includes/                     # PHP Helper-Klassen
│   ├── Plugin.php               # Plugin-Info
│   ├── PluginModule.php         # Plugin Module
│   ├── VPP.php                  # Facade für Container-Zugriff
│   ├── FilePathPluginFactory.php # Plugin-Factory
│   └── services.php             # Haupt-Service-Definitionen
├── lib/packages/                 # Mozart-isolierte Dependencies
│   └── Inpsyde/Modularity/      # inpsyde/modularity Package
├── build/                        # Webpack Output (Build)
│   ├── quantum-viewports.js     # Webpack-gebündeltes JS
│   └── quantum-viewports.css    # Webpack-generiertes CSS
├── vendor/                       # Composer Dependencies
├── languages/                    # i18n Dateien
├── tests/                        # PHPUnit Tests
├── webpack.config.js            # Webpack Build-Konfiguration
├── tsconfig.json                # TypeScript-Konfiguration
├── package.json                 # npm Dependencies
├── quantum-viewports.php        # Plugin Entry Point
├── README.md                     # Benutzer-Dokumentation
├── CHANGELOG.md                 # Versionshistorie
└── BRIEFING.md                  # Diese Datei
```

---

## Key Technologies

- **Backend:** PHP 7.4+/8.0+, PSR-4, inpsyde/modularity, Mozart
- **Frontend:** TypeScript 5.1, React 18.2, WordPress Data Store
- **Build:** Webpack 5, Babel 7, Sass, TypeScript Loader
- **Testing:** Jest (TypeScript), PHPUnit (PHP)
- **Standards:** Syde PHPCS, WordPress.org Plugin Directory, GPLv2
- **CMS:** WordPress Block Editor (Gutenberg)

