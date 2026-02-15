---
version: "0.9.11"
last_updated: "2026-02-15"
project: "Quantum Viewports"
ai_context: true
---

# Skills — Quantum Viewports

## Projektübersicht

**Quantum Viewports** ist ein WordPress-Plugin, das den Gutenberg Block Editor mit viewport-spezifischen (responsiven) Stil-Kontrollen erweitert. Das Plugin ermöglicht es Redakteuren, unterschiedliche Stile für verschiedene Bildschirmgrößen direkt im Editor zu definieren und zu verwalten.

- **Version:** 0.9.11
- **Autor:** Sebastian Buchwald / Quantum-Press
- **Lizenz:** GPLv2 oder später
- **Repository:** https://github.com/Quantum-Press/Viewports
- **Sprache:** Deutsch (Plugin-Dokumentation, Code-Kommentare)
- **PHP-Anforderung:** 7.4+ / 8.0+
- **WordPress:** Block Editor (Gutenberg) Integration

### Architektur-Übersicht

Das Plugin folgt einer modularen Architektur auf Basis von **inpsyde/modularity**:

1. **PHP Backend**: PSR-4 Autoloading, Service Container basiert
2. **TypeScript/React Frontend**: Block Editor Integration über React Hooks und Redux-like State Management
3. **Style Engine**: Eigenständiges PHP-Modul für CSS-Regelgenerierung basierend auf Viewports
4. **Editor Module**: Gutenberg Editor Erweiterungen und UI-Komponenten
5. **Dependency Isolation**: Mozart-basierte Vendor-Dependency Isolation für saubere Namespace-Trennung

---

## Verfügbare Befehle

| Befehl | Beschreibung | Kontext |
|--------|-------------|---------|
| `npm run build` | Production-Build (Webpack mit Optimierung) | Frontend-Assets kompilieren, minifizieren, für Production vorbereiten |
| `npm run dev` | Development-Build (Webpack mit Source Maps) | Während der Entwicklung verwenden, besseres Debugging |
| `npm run watch:build` | Watch-Modus für Live-Recompilation | Echtzeit-Kompilierung während der Entwicklung |
| `npm run test` | Jest Test-Suite ausführen | Unit-Tests für TypeScript/React Code validieren |
| `composer phpcs` | PHP CodeSniffer mit Syde Standard | Code-Stil und PHP-Standards validieren |
| `npm install` | NPM Dependencies installieren | Nach `package.json` Änderungen ausführen |
| `composer install` | Composer Dependencies installieren | Nach `composer.json` Änderungen ausführen |

### Build-Prozess

- **Webpack Config:** `/webpack.config.js` – Konfiguriert TypeScript/SCSS Compilation
- **TypeScript Config:** `/tsconfig.json` – Kompileroptionen und Pfad-Mappings
- **Jest Config:** `/jest.config.ts` – Test-Framework Konfiguration
- **Output:** Assets gehen in `/build/` Verzeichnis
- **Entry Point:** `/src/main.ts` für hauptsächliche Frontend-Logik

---

## Schnittstellen & APIs

### PHP Hooks & Actions

#### `quantum_viewports_init`
```php
do_action( 'quantum_viewports_init', ContainerInterface $container );
```
- **Kontext:** Wird beim Plugin-Initialization aufgerufen
- **Parameter:** App Container mit allen registrierten Services
- **Verwendung:** Für Erweiterungen, um auf Plugin-Services zuzugreifen
- **Beispiel:** Zusätzliche Module oder Custom Styles registrieren

#### `quantum_viewports_migrate`
```php
do_action( 'quantum_viewports_migrate', string $previousVersion );
```
- **Kontext:** Wird bei Installation oder Update aufgerufen
- **Parameter:** Vorherige Plugin-Version (für Migrations-Logik)
- **Verwendung:** Datenbank-Schema Updates, Konfiguration-Migrationen
- **Ausgelöst:** Bei Plugin-Installation oder Update

#### `quantum_viewports_migrate_on_update`
```php
do_action( 'quantum_viewports_migrate_on_update', string $previousVersion );
```
- **Kontext:** Wird nur bei Update aufgerufen (nicht bei Fresh Install)
- **Parameter:** Vorherige Plugin-Version
- **Verwendung:** Update-spezifische Migrations-Logik
- **Unterschied zu `quantum_viewports_migrate`:** Ausgeschlossen bei Fresh-Installation

### JavaScript APIs

#### `registerRenderer`
```typescript
registerRenderer(groupId: string, panelId: string, renderer: Function): void
```
- **Kontext:** Registriert Custom Style Attribute Renderer
- **Parameter:**
  - `groupId`: Eindeutige Gruppen-ID für Renderer-Gruppe
  - `panelId`: Panel-ID innerhalb der Gruppe
  - `renderer`: Render-Funktion
- **Verwendung:** Custom Viewport-Styles für spezifische Block-Typen registrieren
- **Verfügbar über:** Redux Store / Editor State Management

#### Store/Redux API
- **Selector-Pattern:** Für State-Abruf verwenden
- **Action-Dispatch:** Für State-Mutations verwenden
- **Provider:** Root-Component via React Context
- **Persistence:** Local Storage Integration via `@wordpress/data`

### Style Engine API (PHP)

#### Block-Klasse
```php
namespace QP\Viewports\Styles;

class Block {
    public function addRule(CSSRule $rule): void
    public function getRules(): CSSRuleSet
    public function toCSS(): string
}
```
- **Kontext:** Repräsentiert einen Block mit Viewport-spezifischen Styles
- **Verwendung:** Styles für einzelne Blöcke registrieren und abrufen

#### CSSRuleSet-Klasse
```php
class CSSRuleSet {
    public function add(CSSRule $rule): void
    public function getRules(): array
    public function filter(callable $callback): CSSRuleSet
}
```
- **Kontext:** Sammlung von CSS-Regeln mit Viewport-Kontext
- **Verwendung:** Regeln gruppieren, filtern, kombinieren

#### CSSRule-Klasse
```php
class CSSRule {
    public function __construct(string $selector, array $declarations, string $viewport = '')
    public function getSelector(): string
    public function getDeclarations(): array
    public function getViewport(): string
}
```
- **Kontext:** Einzelne CSS-Regel mit optionaler Viewport-Spezifikation
- **Verwendung:** CSS-Regeln für Block-Styles definieren

---

## Dateistruktur & Modulübersicht

### Root Level

```
quantum-viewports/
├── quantum-viewports.php          # Main Plugin File – WordPress Entry Point
├── bootstrap/                     # Bootstrap & Initialization
├── includes/                      # Core PHP Classes (PSR-4: QP\Viewports\)
├── modules/                       # Feature Modules
├── src/                           # TypeScript/React Source Code
├── config/                        # Konfigurationsdateien
├── tests/                         # Test-Dateien
├── build/                         # Kompilierte Assets (generiert)
├── vendor/                        # Composer Dependencies
├── lib/                           # Mozart-isolierte Dependencies
├── languages/                     # Translations (i18n)
├── package.json                   # NPM Abhängigkeiten
├── composer.json                  # PHP Abhängigkeiten
├── webpack.config.js              # Webpack Konfiguration
├── tsconfig.json                  # TypeScript Konfiguration
├── jest.config.ts                 # Jest Test Konfiguration
└── phpunit.xml                    # PHPUnit Konfiguration
```

### `/quantum-viewports.php`
- **Kontext:** Haupteinstiegspunkt des Plugins
- **Verantwortung:** Plugin-Header, Version, Aktivierung/Deaktivierung Hooks
- **Wichtig:** Hier werden Plugin-Konstanten definiert
- **Lädt:** Bootstrap und initialisiert App-Container

### `/bootstrap/`

#### `bootstrap.php`
- **Kontext:** Container-Setup und Dependency Injection
- **Verantwortung:** Registrierung aller Services in PSR-11 Container
- **Geladen von:** Hauptplug-in-Datei
- **Rückgabe:** Konfigurierter `ContainerInterface`

#### `modules.php`
- **Kontext:** Module-Registrierung und Konfiguration
- **Verantwortung:** Alle Feature-Module zur App hinzufügen
- **Besonderheit:** Modular-basierte Plugin-Architektur
- **Enthält:** StylesModule, EditorModule, weitere Custom Modules

### `/includes/` (PHP Backend Core)

```
includes/
├── Plugin.php                     # Main Plugin Class
├── PluginModule.php               # Modularity Module Definition
├── VPP.php                        # Static Container Accessor
├── FilePathPluginFactory.php      # Plugin-Pfad basierte Factory
└── services.php                   # Service Definitionen
```

#### Plugin.php
- **Namespace:** `QP\Viewports`
- **Verantwortung:** Zentrale Plugin-Logik, Lifecycle Management
- **Implementiert:** PSR-11 `ContainerAwareInterface`
- **Wichtige Methoden:**
  - `activate()` – Plugin-Aktivierung
  - `deactivate()` – Plugin-Deaktivierung
  - `getContainer()` – Zugriff auf Service Container

#### VPP.php
- **Namespace:** `QP\Viewports`
- **Zweck:** Statischer Accessor für App-Container
- **Verwendung:** `VPP::app()->get('service-id')`
- **Alternative zu:** Direct Container Injection (Dependency Injection bevorzugt)

#### services.php
- **Zweck:** Service-Definitionen für Dependency Injection
- **Format:** PSR-11 compatible Service Definitions
- **Beispiele:** BlockManager, StylesService, EditorService

### `/modules/`

#### `/modules/styles/src/` (PHP Style Engine)

```
modules/styles/src/
├── StylesModule.php               # Styles Module Definition
├── Block.php                      # Block mit Styles
├── CSSRule.php                    # Einzelne CSS-Regel
├── CSSRuleSet.php                 # Sammlung von CSS-Regeln
└── Services/
    ├── StylesService.php          # Service für Style-Management
    └── RuleFactory.php            # Factory für CSS-Rules
```

**Namespace:** `QP\Viewports\Styles`

**Kernklassen:**
- `Block`: Repräsentiert einen Block mit Viewport-spezifischen Styles
- `CSSRule`: Einzelne CSS-Regel (Selector + Declarations + Viewport)
- `CSSRuleSet`: Gesammlung von Rules mit Filter/Query-Funktionalität
- `StylesService`: Service für Style-Rendering und -Verwaltung

**Verwendung:** Styles für Blocks registrieren, in CSS rendern, auf verschiedene Viewports anwenden

#### `/modules/editor/src/` (Editor Module)

```
modules/editor/src/
└── EditorModule.php               # Editor Integration Module
```

**Namespace:** `QP\Viewports\Editor`

**Verantwortung:**
- Integration mit Gutenberg Block Editor
- Registrierung von Editor-UI Komponenten
- Viewport Selector Setup
- Editor Meta-Data Management

### `/src/` (TypeScript/React Frontend)

```
src/
├── main.ts                        # Webpack Entry Point
├── config.ts                      # Runtime Configuration
├── editor.scss                    # Editor Styles
├── plugins.tsx                    # Gutenberg Plugins Registration
├── portals.tsx                    # React Portals Setup
├── subscribes.ts                  # Store Subscriptions
├── block/                         # Block-Related Components
├── components/                    # Reusable UI Components
├── hooks/                         # Custom React Hooks
├── store/                         # Redux-like State Management
├── types/                         # TypeScript Type Definitions
├── utils/                         # Utility Functions
├── hacks/                         # WordPress Limitation Workarounds
└── setup/                         # Initialization Logic
```

#### `main.ts`
- **Kontext:** Webpack Entry Point
- **Verantwortung:** Plugin Registration, Store Initialization
- **Lädt:** Alle Komponenten, Hooks, und Initialization

#### `config.ts`
- **Kontext:** Runtime Konfiguration
- **Zugriff:** Globale Config (z.B. Plugin Namespace, Viewport Konfiguration)
- **Quelle:** Entweder `wp_localize_script` oder `window` globale Variablen

#### `plugins.tsx`
- **Kontext:** Gutenberg Plugin Registration
- **Verwendung:** Registriert Plugin-Erweiterungen für Editor
- **Integrationspunkt:** `registerPlugin()` von `@wordpress/plugins`

#### `store/`
- **Pattern:** Redux-like State Management
- **Integration:** `@wordpress/data` Store System
- **Zustand Verwaltung:** Viewports, Styles, Editor Meta-Data

#### `components/`
- **Beispiele:** ViewportSelector, StylePanel, BlockStyler, etc.
- **Pattern:** React Functional Components mit Hooks
- **Integration:** `@wordpress/components` für UI-Primitives

#### `hooks/`
- **Beispiele:** `useViewport()`, `useStyles()`, `useBlockData()`, etc.
- **Pattern:** Custom React Hooks für State Management
- **Verwendung:** Komponenten-unabhängige State-Logik

#### `types/`
- **Kontext:** TypeScript Type Definitions
- **Beispiele:** `Viewport`, `CSSRule`, `BlockStyles`, etc.
- **Wichtig:** Strikte Type Safety für Code Quality

#### `utils/`
- **Kontext:** Utility Funktionen und Helper
- **Beispiele:** CSS Generation, Viewport Calculation, State Transformations
- **Wichtig:** Pure Functions, keine Side Effects

#### `hacks/`
- **Kontext:** Workarounds für WordPress/Gutenberg Limitationen
- **Beispiele:** Custom Event Handling, DOM Manipulation Workarounds
- **Konvention:** Kommentiere WARUM der Hack nötig ist

#### `setup/`
- **Kontext:** Initialization und Setup-Logik
- **Verantwortung:** Plugin-Initialisierung, Hook Registration
- **Zeitpunkt:** Lädt vor Komponenten-Rendering

### `/config/`

#### `elements.json`
- **Kontext:** Block-Element Konfiguration
- **Format:** JSON mit Block-Typ Mappings
- **Verwendung:** Definiert welche CSS-Eigenschaften für welche Blöcke verfügbar sind
- **Struktur:**
  ```json
  {
    "blockName": {
      "properties": ["color", "padding", "margin"],
      "viewport-aware": true
    }
  }
  ```

### `/tests/`

#### `CSSRulesetTest.php`
- **Framework:** PHPUnit
- **Kontext:** Unit-Tests für Style Engine
- **Konfiguration:** PHPUnit Config in `/phpunit.xml`
- **Laufbefehl:** `composer phpunit`

---

## Konventionen & Code-Standards

### PHP Konventionen

#### Namespace & PSR-4
```php
// Basis-Namespace: QP\Viewports
namespace QP\Viewports;
namespace QP\Viewports\Styles;
namespace QP\Viewports\Editor;
```
- **Mapping:** `QP\Viewports` → `/includes/`
- **Mapping:** `QP\Viewports\Styles` → `/modules/styles/src/`
- **Mapping:** `QP\Viewports\Editor` → `/modules/editor/src/`

#### Code-Standard
- **Standard:** Syde (via `composer phpcs`)
- **PHP Version:** 7.4+ / 8.0+ Kompatibilität
- **Typisierung:** Strict Types, Type Hints bevorzugt

#### Service Container Pattern
```php
// Dependency Injection verwenden
public function __construct(SomeService $service) {
    $this->service = $service;
}

// NICHT: Statische Aufrufe
// VPP::app()->get('service');  // Nur wenn nötig
```

#### Hook-Konventionen
```php
// Action Hook für plugin init
do_action('quantum_viewports_init', $container);

// Filter Hook mit Prefix
$value = apply_filters('quantum_viewports_' . $filterName, $value);
```

### TypeScript/React Konventionen

#### Namenskonventionen
- **Components:** PascalCase (z.B., `ViewportSelector.tsx`)
- **Hooks:** camelCase mit `use` Prefix (z.B., `useViewport.ts`)
- **Types:** PascalCase (z.B., `Viewport.ts`, `CSSRule.ts`)
- **Utils:** camelCase (z.B., `generateCSS.ts`)
- **Constants:** SCREAMING_SNAKE_CASE (z.B., `DEFAULT_VIEWPORT_WIDTH.ts`)

#### Dateistruktur Pro Komponente
```
components/
├── ViewportSelector/
│   ├── ViewportSelector.tsx       # Main Component
│   ├── ViewportSelector.styles.scss
│   ├── ViewportSelector.test.ts
│   └── index.ts                   # Export
```

#### Typing Beispiel
```typescript
interface Viewport {
    id: string;
    label: string;
    width: number;
    isActive: boolean;
}

type ViewportMap = Record<string, Viewport>;
```

#### React Hooks Pattern
```typescript
export const useViewport = () => {
    const { getState, dispatch } = useDataStore('quantum-viewports/editor');

    return {
        currentViewport: getState().currentViewport,
        setViewport: (viewportId: string) => dispatch({
            type: 'SET_VIEWPORT',
            payload: viewportId
        })
    };
};
```

#### Component Pattern
```typescript
interface ViewportSelectorProps {
    onViewportChange?: (id: string) => void;
}

export const ViewportSelector: React.FC<ViewportSelectorProps> = ({
    onViewportChange
}) => {
    const { currentViewport, setViewport } = useViewport();

    return (
        // JSX
    );
};
```

### CSS/SCSS Konventionen

#### BEM-Naming
```scss
.qp-viewport-selector {           // Block
    display: flex;

    &__trigger {                  // Element
        cursor: pointer;
    }

    &__trigger--active {           // Modifier
        background-color: blue;
    }
}
```

#### Präfix
- **Klassen:** `qp-` Präfix für Plugin-Spezifität (z.B., `qp-viewport-selector`)
- **Variablen:** `--qp-` Präfix (z.B., `--qp-primary-color`)

#### Editor vs Frontend
- `editor.scss` – Styles nur im Editor sichtbar
- Keine Frontend-Styles (werden dynamisch via PHP generiert)

---

## Konfiguration

### WordPress Integration

#### Plugin Aktivierung
```php
register_activation_hook(__FILE__, ['QP\Viewports\Plugin', 'activate']);
register_deactivation_hook(__FILE__, ['QP\Viewports\Plugin', 'deactivate']);
```

#### Gutenberg Block Registrierung
- Via `@wordpress/blocks` API
- Integration mit `registerBlockType()`
- Editor-spezifische Meta-Felder via `registerBlockVariation()`

### Webpack Konfiguration

#### Entry Points
```javascript
entry: {
    main: './src/main.ts',
    // Weitere Entry Points optional
}
```

#### Output
```javascript
output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
}
```

#### Environment-spezifisch
- **Production:** Minification, Optimization, Source Maps disabled
- **Development:** Source Maps enabled, keine Minification

### TypeScript Konfiguration

#### Pfad-Mappings
```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@components/*": ["src/components/*"],
            "@hooks/*": ["src/hooks/*"],
            "@types/*": ["src/types/*"],
            "@utils/*": ["src/utils/*"]
        }
    }
}
```

#### Strikte Einstellungen
```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true
    }
}
```

### Jest Test Konfiguration

#### Test-Patterns
```typescript
// setup.ts
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

// test.ts
describe('ViewportSelector', () => {
    it('should render correctly', () => {
        // Test
    });
});
```

#### Mocking WordPress APIs
```typescript
jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn(),
    useDispatch: jest.fn(),
}));
```

---

## Abhängigkeiten

### PHP Abhängigkeiten

#### Produkion
- **psr/log** ^1.1 – PSR-3 Logging Interface
- **wikimedia/composer-merge-plugin** ^2.0 – Composer Plugin für Merge
- **wp-oop/wordpress-interface** ^0.1.0-alpha1 – WordPress Type Hints
- **dhii/versions** ^0.1.0-alpha1 – Version-Parsing/Vergleich
- **inpsyde/modularity** ^1.12 – Modular Plugin Architecture (via Mozart)

#### Development
- **syde/phpcs** dev-main – PHP CodeSniffer mit Syde Standard

#### Dependency Isolation
- **Mozart:** Isoliert `inpsyde/modularity` in `/lib/` Verzeichnis
- **Grund:** Verhindert Konflikte mit anderen Plugins, die gleiches Package nutzen
- **Autoloader:** Custom Autoloader via `composer.json` config

### JavaScript Abhängigkeiten

#### WordPress APIs
- **@wordpress/data** – Store/State Management Pattern
- **@wordpress/element** – React Integration
- **@wordpress/primitives** – UI Primitives
- **@wordpress/style-engine** – CSS Generation
- **@wordpress/blocks** – Block API
- **@wordpress/plugins** – Plugin API
- **@wordpress/components** – UI Components

#### Custom Dependencies
- **@webkinect/react-json-view** (forked) – JSON Viewer Komponente

#### Build Tools
- **TypeScript** ^4.x – Sprachenfunktionen
- **Webpack** ^5.x – Module Bundler
- **Babel** – JavaScript Transpiler
- **SCSS/Sass** – CSS Präprozessor
- **Jest** – Testing Framework

#### Hinweise
- Keine externe UI-Frameworks (Bootstrap, Tailwind) verwenden
- WordPress `@wordpress/components` für UI verwenden
- Für neue Dependencies: Prüfung auf WordPress API Kompatibilität

---

## Best Practices für AI-Assistenten

### Code-Analyse

1. **PHP Struktur verstehen:**
   - Sempre Namespace und PSR-4 überprüfen
   - Service Container Dependencies ausfindig machen
   - Hook-Trigger und `do_action()` / `apply_filters()` folgen

2. **TypeScript/React Struktur verstehen:**
   - Component Hierarchy analysieren
   - Custom Hooks und State Flow verfolgen
   - WordPress API Usage überprüfen

3. **Build-Pipeline beachten:**
   - Änderungen in `/src/` müssen `npm run build` auslösen
   - Changes in `/includes/` oder `/modules/php` benötigen keine Kompilation
   - Distribution Files sind in `/build/`

### Häufige Aufgaben

#### Neue Block-Styles hinzufügen
1. Element-Konfiguration in `/config/elements.json` aktualisieren
2. PHP Style Rule in `/modules/styles/src/` erstellen
3. React Component in `/src/components/` für UI erstellen
4. Custom Hook in `/src/hooks/` für State Management erstellen
5. Tests schreiben und `npm run test` ausführen

#### Custom Renderer registrieren
1. `registerRenderer()` API in JavaScript verwenden
2. Renderer-Funktion in Komponente implementieren
3. Store-Integration für State Management
4. Tests für Renderer-Logik

#### PHP Service hinzufügen
1. Class in `/includes/` oder `/modules/*/src/` erstellen
2. Namespace mit PSR-4 Standard setzen
3. In `services.php` oder `*Module.php` registrieren
4. Type Hints für Dependencies verwenden
5. PHPUnit Tests in `/tests/` erstellen

#### i18n/Translations hinzufügen
1. Text mit `__()`, `_e()`, etc. wrappen
2. Textdomain: `quantum-viewports`
3. PHO-Dateien in `/languages/` verwenden
4. WPML/Polylang Kompatibilität beachten

### Testing

#### PHP Unit Tests
```bash
composer phpunit
# Oder einzelne Test
composer phpunit tests/CSSRulesetTest.php
```

#### JavaScript Tests
```bash
npm run test
# Watch Mode
npm run test:watch
```

#### Code Style
```bash
composer phpcs
# Autofix wenn möglich
composer phpcbf
```

### Debugging

#### PHP Debugging
- `error_log()` für Logs
- WordPress Debug Mode in `wp-config.php` aktivieren
- VPP Container: `VPP::app()->get('logger')`

#### JavaScript Debugging
- Browser Developer Tools verwenden
- Redux DevTools für Store Inspection
- Console Logs mit Plugin-Namespace Präfix
- `npm run dev` für Source Maps

#### Nützliche WordPress Hooks zum Inspizieren
- `quantum_viewports_init` – Plugin Initialization
- `wp_enqueue_scripts` / `admin_enqueue_scripts` – Asset Loading

---

## Bekannte Limitationen & Workarounds

### WordPress/Gutenberg Limitationen

1. **Block Editor Meta-Fields**
   - Limitiertes API für komplexe State-Struktur
   - **Workaround:** Redux-like Store in React verwenden
   - **Datei:** `/src/hacks/` für spezielle Workarounds

2. **Viewport Responsiveness**
   - WP Block Editor rendert immer im Default Viewport
   - **Workaround:** CSS Media Queries für Preview im Editor
   - **Implementierung:** `editor.scss` mit spezifischen Selektoren

3. **Plugin Isolation**
   - Andere Plugins können Conflicts verursachen
   - **Mitigation:** Namespace Präfixe verwenden
   - **Mozart:** Vendor Dependencies isolieren

### Browser Kompatibilität

- **Target:** Chrome, Firefox, Safari, Edge (letzte 2 Versionen)
- **IE11:** Nicht unterstützt
- **Mobile:** Responsive Design, Touch-Events beachten

### Performance Considerations

1. **CSS Generation:**
   - Viele Rules können großes CSS generieren
   - **Mitigation:** CSS Caching, Minification

2. **React Rendering:**
   - Viewport Changes triggern Re-Renders
   - **Mitigation:** Memoization, Selective Updates

3. **Block Count:**
   - Viele Blöcke mit vielen Viewports = komplexes DOM
   - **Mitigation:** Virtual Scrolling für Long Lists

---

## Wichtige Datei-Referenzen (Absolute Paths)

### Ausführbare Dateien
- `/sessions/loving-happy-darwin/mnt/Viewports/quantum-viewports.php` – Plugin Entry
- `/sessions/loving-happy-darwin/mnt/Viewports/webpack.config.js` – Build Config
- `/sessions/loving-happy-darwin/mnt/Viewports/package.json` – NPM Scripts

### Konfiguration
- `/sessions/loving-happy-darwin/mnt/Viewports/config/elements.json` – Element Config
- `/sessions/loving-happy-darwin/mnt/Viewports/tsconfig.json` – TypeScript Config
- `/sessions/loving-happy-darwin/mnt/Viewports/jest.config.ts` – Test Config

### Backend Core
- `/sessions/loving-happy-darwin/mnt/Viewports/includes/Plugin.php` – Main Plugin
- `/sessions/loving-happy-darwin/mnt/Viewports/bootstrap/bootstrap.php` – DI Container
- `/sessions/loving-happy-darwin/mnt/Viewports/bootstrap/modules.php` – Module Setup

### Style Engine
- `/sessions/loving-happy-darwin/mnt/Viewports/modules/styles/src/StylesModule.php`
- `/sessions/loving-happy-darwin/mnt/Viewports/modules/styles/src/Block.php`
- `/sessions/loving-happy-darwin/mnt/Viewports/modules/styles/src/CSSRule.php`

### Frontend
- `/sessions/loving-happy-darwin/mnt/Viewports/src/main.ts` – Webpack Entry
- `/sessions/loving-happy-darwin/mnt/Viewports/src/config.ts` – Runtime Config
- `/sessions/loving-happy-darwin/mnt/Viewports/src/components/` – UI Components
- `/sessions/loving-happy-darwin/mnt/Viewports/src/hooks/` – Custom Hooks
- `/sessions/loving-happy-darwin/mnt/Viewports/src/store/` – State Management

### Tests
- `/sessions/loving-happy-darwin/mnt/Viewports/tests/CSSRulesetTest.php` – PHP Tests
- `/sessions/loving-happy-darwin/mnt/Viewports/jest.config.ts` – Test Config

---

## Kontakt & Support

- **Repository:** https://github.com/Quantum-Press/Viewports
- **Author:** Sebastian Buchwald / Quantum-Press
- **Issue Tracker:** GitHub Issues
- **Documentation:** Code Comments (German), Docblocks

---

## Changelog für AI-Kontext

- **2026-02-15:** Initial SKILLS.md erstellt für Version 0.9.11
- **Umfang:** Vollständige Architektur-Dokumentation, APIs, Konventionen, Abhängigkeiten
- **Sprache:** Deutsch für Plugin-Konsistenz
- **Format:** YAML Frontmatter + Markdown für GitHub/IDE Integration
