<?php

declare( strict_types=1 );

namespace QP\Viewports\Styles\Services;

use QP\Viewports\Styles\CSSRule;

/**
 * Handles parsing and manipulating CSS for blocks.
 *
 * Provides utilities to convert block data into CSSRuleSet objects,
 * parse CSS strings into associative arrays, extract or replace
 * inner HTML, validate selectors, and merge CSS structures.
 *
 * @package QP\Viewports\Controller
 */
class Parser
{
    /**
     * Stores native wp properties running on
     * wp_style_engine_get_styles
     *
     * @var array
     */
    private array $nativeProperties = [];

    /**
     * Stores properties to ignore setting inline html
     * on saving blocks.
     *
     * @var array
     */
    private array $ignoreProperties = [];

    /**
     * Stores selectors by property to remap css properties
     * to deeper elements. eg aspect-ratio on cover blocks
     *
     * @var array
     */
    private array $selectorMapping = [];


    /**
     * Class constructor.
     */
    public function __construct()
    {
        $this->registerNativeProperties();
        $this->registerIgnoreProperties();
        $this->registerSelectorMapping();
    }


    /**
     * Register filterable native wp properties running on
     * wp_style_engine_get_styles
     */
    protected function registerNativeProperties(): void
    {
        $this->nativeProperties = \apply_filters(
            'quantum_viewports_native_properties',
            [
                'background',
                'border',
                'dimensions',
                'shadow',
                'spacing',
            ]
        );
    }


    /**
     * Register filterable properties that
     * should not be included on saving html.
     */
    protected function registerIgnoreProperties(): void
    {
        $this->ignoreProperties = \apply_filters(
            'quantum_viewports_ignore_properties',
            [
                'dimensions' => [
                    'aspect-ratio'
                ],
                'background' => true,
                'qpBackground' => true,
                'qpBoxShadow' => true,
                'qpClipPath' => true,
                'qpColumn' => true,
                'qpDimensions' => true,
                'qpSingleColumn' => true,
                'qpColumns' => true,
                'qpFilter' => true,
                'qpFlex' => true,
                'qpOpacity' => true,
                'qpOverflow' => true,
                'qpPosition' => true,
                'qpTextShadow' => true,
                'qpTransform' => true,
                'qpVisibility' => true,
            ]
        );
    }


    /**
     * Register filterable selector mapping to remap css properties
     * to specific selectors
     */
    protected function registerSelectorMapping(): void
    {
        $this->selectorMapping = \apply_filters(
            'quantum_viewports_selector_mapping',
            [
                'core/image' => [
                    'shadow' => '% > img',
                    'border' => '% > img',
                ]
            ]
        );
    }


    /**
     * Parses a CSS string into an associative array of property-value pairs.
     *
     * @param string $cssString The CSS string to parse.
     *
     * @return array Associative array of CSS properties and values.
     */
    public function parseCss( string $cssString ): array
    {
        // Set result.
        $result = [];

        // Split the CSS string into individual declarations.
        $declarations = $this->splitDeclarations( $cssString );

        // Iterate over declarations.
        foreach ( $declarations as $declaration ) {

            // If the declaration is not empty, process it
            if ( ! empty( $declaration ) ) {

                // Split the declaration into property and value by the first colon
                $parts = explode( ':', $declaration, 2 );

                // Ensure both property and value are present
                if ( count( $parts ) !== 2 ) {
                    continue;
                }

                $property = trim( $parts[ 0 ] );
                $value = trim( $parts[ 1 ] );

                // Store the property-value pair in the result array
                $result[ $property ] = $value;

                // Split the declaration into property and value by the first colon
                list( $property, $value ) = explode( ':', $declaration, 2 );

                // Trim unnecessary whitespace around the property
                $property = trim( $property );
                $value = trim( $value );

                // Store the property-value pair in the result array
                $result[ $property ] = $value;
            }
        }

        return $result;
    }


    /**
     * Parses inline styles into a CSSRule object for a given selector.
     *
     * @param Processor $processor
     * @param string $html
     * @param string $selector
     *
     * @return CSSRule|false
     */
    public function parseInlineStyles(
        Processor $processor,
        string $html,
        string $selector = ''
    ): CSSRule|false
    {

        if ( '%' !== $selector ) {
            return $this->parseInlineSelector(
                $processor,
                $html,
                $selector
            );
        }

        return $this->parseInline(
            $processor,
            $html,
        );
    }


    /**
     * Parses inline styles for a specific selector.
     *
     * @param Processor $processor
     * @param string $html
     * @param string $selector
     *
     * @return CSSRule|false
     */
    public function parseInlineSelector(
        Processor $processor,
        string $html,
        string $selector = ''
    ): CSSRule|false
    {

        $selectorParts = $this->sanitizeSelectorParts( $selector );
        if ( false === $selectorParts ) {
            return false;
        }

        $inlineStyles = false;

        $processed = $this->parseHtmlSelectors(
            $html,
            $selectorParts,
            static function( \WP_HTML_Tag_Processor $processor ) use ( &$inlineStyles ): void {
                $inlineStyles = $processor->get_attribute( 'style' );
            }
        );

        if ( empty( $processed ) || empty( $inlineStyles ) ) {
            return false;
        }

        $inlineParsed = $this->parseCss( $inlineStyles );
        if ( empty( $inlineParsed ) ) {
            return false;
        }

        return $processor->generateCSSRule(
            'inline',
            'inline',
            $selector,
            $inlineParsed,
            'screen',
        );
    }


    /**
     * Parses top-level inline styles from the block HTML.
     *
     * @param Processor $processor
     *
     * @return CSSRule|false
     */
    public function parseInline(
        Processor $processor,
        string $html
    ): CSSRule|false
    {

        $tagProcessor = new \WP_HTML_Tag_Processor( $html );
        $tagProcessor->next_tag();

        $inlineStyles = $tagProcessor->get_attribute( 'style' );
        if ( empty( $inlineStyles ) ) {
            return false;
        }

        $inlineParsed = $this->splitDeclarations( $inlineStyles );
        if ( empty( $inlineParsed ) ) {
            return false;
        }

        return $processor->generateCSSRule(
            'inline',
            'inline',
            '%',
            $inlineParsed,
            'screen',
        );
    }


    /**
     * Parses nested HTML elements based on selectors and executes a callback on match.
     *
     * @param string $html
     * @param array $selectors
     * @param callable|null $callback
     *
     * @return array Found tag names
     */
    protected function parseHtmlSelectors(
        string $html,
        array $selectors,
        callable|null $callback = null
    ): array
    {

        $parser = $this;
        $foundElements = [];

        $parseNestedSelector = static function(
            string $html,
            array $selectors,
            callable $callback
        ) use ( $parser, &$foundElements, &$parseNestedSelector ): void {
            if ( empty( $selectors ) ) {
                return;
            }

            // Set the current selectorPart.
            $currentSelector = array_shift( $selectors ); // Hole den aktuellen Selektor-Teil
            $currentSelectors = explode(
                '.',
                $currentSelector
            ); // Split in tag and classes

            $tagName = array_shift( $currentSelectors );
            $className = implode(
                '.',
                $currentSelectors
            );

            // Set processor to iterate over.
            $processor = new \WP_HTML_Tag_Processor( $html );
            $processor->next_tag();

            // Find matching elements for the current selector part.
            while ( $processor->next_tag( [ $tagName ] ) ) {

                // Check if tagName matches.
                $currentTagName = strtolower( $processor->get_tag() );
                if ( $tagName !== $currentTagName ) {
                    continue;
                }

                // Check if optional className matches.
                if ( $className && ! $processor->has_class( $className ) ) {
                    continue;
                }

                // Check if last selector part reached.
                if ( empty( $selectors ) ) {
                    if ( is_callable( $callback ) ) {
                        $callback( $processor );
                    }

                    $foundElements[] = $currentTagName;
                    continue;
                }

                // Extract the inner HTML manually.
                $innerHtml = $parser->extractInnerHTML( $currentTagName, $tagName );
                $parseNestedSelector( $innerHtml, $selectors, $callback );
            }
        };

        $parseNestedSelector( $html, $selectors, $callback );

        return $foundElements;
    }


    /**
     * Parses CSS rules from block attributes.
     *
     * @param Processor $processor
     * @param string $attributes
     * @param array $attributes
     *
     * @return array
     */
    public function parseAttributes(
        Processor $processor,
        string $blockName,
        array $attributes = []
    ): array
    {
        // Check if there is a filled inlineStyles attribute to generate rules from.
        if (
            ( ! isset( $attributes[ 'style' ] ) || empty( $attributes[ 'style' ] ) ) &&
            ( ! isset( $attributes[ 'viewports' ] ) || empty( $attributes[ 'viewports' ] ) )
        ) {
            return [];
        }

        $viewports = $attributes[ 'viewports' ] ?? [];
        $attributeStyle = $attributes[ 'style' ] ?? [];
        $attributeStyleDefaults = $processor->blockStyleDefaults( $blockName );
        $attributeStyleDefaults = $this->traverseGet(
            [ 'default' ],
            $attributeStyleDefaults,
            []
        );

        $viewports[ 0 ] = [
            'style' => $this->merge(
                $attributeStyleDefaults,
                $attributeStyle,
                $this->traverseGet( [ 0, 'style' ], $viewports, [] )
            )
        ];

        // Store valids for all properties.
        $parsedValids = $this->parseValids( $viewports );
        $parsedRules = $this->parseViewportRules(
            $processor,
            $blockName,
            $parsedValids,
            $viewports
        );

        return $parsedRules;
    }


    /**
     * Parses CSS rules from parsed valids and viewports.
     *
     * @param Processor $processor
     * @param string $blockName
     * @param array $parsedValids
     * @param array $viewports
     *
     * @return array
     */
    public function parseViewportRules(
        Processor $processor,
        string $blockName,
        array $parsedValids,
        array $viewports
    ): array
    {
        // Iterate over viewports attributes to parse them to css.
        $rules = [];
        foreach ( $parsedValids as $viewport => $maxWidths ) {
            foreach ( $maxWidths as $maxWidth => $validStyles ) {
                $styles = $this->traverseGet( [ $viewport, $maxWidth ], $viewports, [] );
                if ( empty( $styles ) ) {
                    $styles = $this->traverseGet( [ $viewport ], $viewports, [] );
                }

                foreach ( $styles as $style ) {
                    foreach ( $style as $property => $value ) {
                        $valids = $this->traverseGet(
                            [ $viewport, $maxWidth, 'style', $property ],
                            $parsedValids,
                            []
                        );

                        $parsed = $this->parseStyleAttribute( $blockName, $property, $value, $valids );

                        if ( empty( $parsed ) ) continue;

                        foreach ( $parsed as $selector => $css ) {

                            // Check if we need to add an attribute style.
                            if ( ! empty( $css[ 'declarations' ] ) ) {
                                if ( is_numeric( $viewport ) ) {
                                    $rules[] = $processor->generateCSSRule(
                                        'attributes',
                                        $property,
                                        $selector,
                                        $css[ 'declarations' ],
                                        'screen',
                                        $viewport,
                                        $maxWidth > 0 ? $maxWidth : -1,
                                    );
                                    continue;
                                }

                                // Allow to register non-numeric viewport types.
                                $customRule = \apply_filters(
                                    'quantum_viewports_custom_viewport_rule',
                                    null,
                                    $property,
                                    $selector,
                                    $css[ 'declarations' ],
                                    $viewport
                                );

                                if ( $customRule instanceOf CSSRule ) {
                                    $rules[] = $customRule;
                                }
                            }
                        }
                    }
                }
            }
        }

        return $rules;
    }


    /**
     * Parses a style property value to css.
     *
     * @param string $blockName
     * @param string $property
     * @param array $value
     * @param array $valids
     *
     * @return array
     */
    public function parseStyleAttribute(
        string $blockName,
        string $property,
        array|string $value,
        array $valids
    ): array
    {

        if ( in_array( $property, $this->nativeProperties, true ) ) {
            $engineStyles = \wp_style_engine_get_styles( [
                $property => $value,
            ] );

            $css = \apply_filters(
                'quantum_viewports_register_renderer_' . $property,
                $engineStyles[ 'css' ] ?? '',
                $value,
                $valids
            );

            if ( is_string( $css ) && ! empty( $css ) ) {
                return $this->remapSelectors(
                    $blockName,
                    $property,
                    [
                    '%' => [
                        'css' => $css,
                        'declarations' => $this->splitDeclarations( $css ),
                    ]
                ] );
            }

            return [];
        }

        $css = \apply_filters(
            'quantum_viewports_register_renderer_' . $property,
            '',
            $value,
            $valids
        );

        if ( is_string( $css ) && ! empty( $css ) ) {
            return $this->splitSelectors( $css );
        }

        return [];
    }


    /**
     * Remap selectors based on filtered selector mapping property.
     *
     * @param string $property
     * @param array $selectorCss
     *
     * @return array containing remapped selectors
     */
    public function remapSelectors(
        string $blockName,
        string $property,
        array $selectorCss
    ): array
    {
        // Check if there is a mapping to the block and property.
        if (
            ! isset( $this->selectorMapping[ $blockName ] ) ||
            ! isset( $this->selectorMapping[ $blockName ][ $property ] )
        ) {
            return $selectorCss;
        }

        $mapping = $this->selectorMapping[ $blockName ][ $property ];

        // Check whether everything of the property has to be remapped.
        if ( ! is_array( $mapping ) ) {
            return [
                $mapping => reset( $selectorCss )
            ];
        }

        // It should be possible to handle css specific remapping.
        foreach ( $selectorCss as $args ) {
            foreach ( $args[ 'declarations' ] as $cssProperty => $cssValue ) {

                if ( isset( $mapping[ $cssProperty ] ) ) {
                    $targetSelector = $mapping[ $cssProperty ];

                    if ( ! isset( $selectorCss[ $targetSelector ] ) ) {
                        $selectorCss[ $targetSelector ] = [
                            'css' => '',
                            'declarations' => []
                        ];
                    }

                    $selectorCss[ $targetSelector ][ 'css' ] .=
                        sprintf( '%s:%s;', $cssProperty, $cssValue );

                    $selectorCss[ $targetSelector ][ 'declarations' ][ $cssProperty ] = $cssValue;
                }
            }
        }

        return $selectorCss;
    }


    public function parseValids( array $viewports ): array
    {
        $valids = [];
        $lastViewport = 0;

        ksort( $viewports );

        foreach ( $viewports as $viewport => $styles ) {
            $maxWidths = [ 0 ];

            ksort( $maxWidths );

            foreach ( $maxWidths as $maxWidth ) {
                $lastValids = $this->traverseGet( [ $lastViewport, $maxWidth ], $valids, [] );

                $valids[ $viewport ] = [
                    $maxWidth => $this->merge( $lastValids, $styles )
                ];
            }
        }

        return $valids;
    }


    /**
     * Extracts the inner HTML content of a specific element tag.
     *
     * @param string $html    Full HTML string.
     * @param string $tagName The tag name to extract.
     *
     * @return string The inner HTML content.
     */
    public function extractInnerHTML( string $html, string $tagName ): string
    {
        $pattern = sprintf(
            '/<%s[^>]*>(.*?)<\/%s>/is',
            preg_quote( $tagName, '/' ),
            preg_quote( $tagName, '/' )
        );

        if ( preg_match( $pattern, $html, $matches ) ) {
            return $matches[ 1 ] ?? '';
        }

        return '';
    }


    /**
     * Replaces the inner HTML content of a specific element tag.
     *
     * @param string $html       Full HTML string.
     * @param string $innerHtml  Replacement inner HTML content.
     * @param string $tagName    The tag name to replace content for.
     *
     * @return string Modified HTML string with replaced inner content.
     */
    public function replaceInnerHTML( string $html, string $innerHtml, string $tagName ): string
    {
        $pattern = sprintf(
            '/<%s[^>]*>(.*?)<\/%s>/is',
            preg_quote( $tagName, '/' ),
            preg_quote( $tagName, '/' )
        );

        if ( preg_match( $pattern, $html, $matches ) ) {
            $search = $matches[ 1 ] ?? '';

            if ( ! empty( $search ) ) {
                return str_replace( $search, $innerHtml, $html );
            }
        }

        return $html;
    }


    /**
     * Checks whether a given CSS selector is valid.
     *
     * @param string $selector The CSS selector string.
     *
     * @return bool True if valid, false otherwise.
     */
    public function isValidSelector( string $selector ): bool
    {
        if ( false !== $this->sanitizeSelectorParts( $selector ) ) {
            return true;
        }

        return false;
    }


    /**
     * Returns sanitized parts of a selector suitable for \WP_HTML_Tag_Processor queries.
     *
     * @param string $selector The CSS selector string.
     *
     * @return array|false Array of selector parts, or false if invalid.
     */
    public function sanitizeSelectorParts( string $selector ): array|false
    {
        $selector = $this->removeWildcard( $selector );

        $allowedElements = [ #TODO Outsource elements.json
            'div', 'img', 'span', 'p', 'article', 'section', 'header', 'footer', 'nav', 'ul',
            'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'form', 'input', 'button', 'table',
            'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'figcaption', 'figure', 'main', 'mark'
        ];

        // The selector is only allowed to contain at least an element or with optional trailing class eg. div.test or combinations.
        // This is neccessary cause \WP_HTML_Tag_Processor only supports this as cssQuery format.
        $pattern = '/^([a-zA-Z0-9]+(\.[a-zA-Z0-9_-]+)*|\*)(\s*(>|\+|~|\s)*\s*[a-zA-Z0-9]+(\.[a-zA-Z0-9_-]+)*)*(\s*(,)\s*)*$/';

        // Check if we match something.
        if ( preg_match( $pattern, $selector ) ) {

            // Split selector into parts, to check each for format issues.
            $parts = preg_split( '/[\s,]+/', $selector );
            foreach ( $parts as $part ) {

                // Check if the part is matching the expected format.
                if ( preg_match( '/^([a-zA-Z0-9]+)(\.[a-zA-Z0-9_-]+)*$/', $part, $matches ) ) {

                    // Check if first match is an element.
                    $element = strtolower( $matches[ 1 ] );
                    if ( ! in_array( $element, $allowedElements ) && $element !== '*' ) {
                        return [];
                    }
                }
            }

            return $parts;
        }

        return [];
    }


    /**
     * Removes leading wildcard characters from a selector.
     *
     * @param string $selector The selector string.
     *
     * @return string Cleaned selector string.
     */
    public function removeWildcard( string $selector ): string
    {
        $cleaned = preg_replace( '/%\s*(>|~|\+|\s)?\s*/', '', $selector );

        return trim( $cleaned );
    }


    /**
     * Splits a CSS string into individual declarations.
     *
     * @param string $css The CSS string.
     *
     * @return array Array of individual CSS declarations.
     */
    public function splitDeclarations( string $css ): Array
    {
        $css = $this->removeSelectors( $css );
        $css = trim( $css ); // Remove unnecessary leading and trailing whitespace.
        $css = html_entity_decode(
            $css,
            ENT_QUOTES | ENT_HTML5,
            'UTF-8'
        ); // Remove special chars for this process.

        $parts = explode( ';', $css ); // Split string at semicolons.
        $declarations = [];

        foreach ( $parts as $index => $part ) {
            $part = trim( $part );
            if ( empty( $part ) ) {
                continue;
            }

            // Check for not existing colons, to remove declare.
            if ( false !== strpos( $part, ':' ) ) {
                $part = trim( $part );
                $part = explode( ':', $part, 2 );
                $declarations[ $part[ 0 ] ] = $part[ 1 ];
            }
        }

        return $declarations;
    }


    /**
     * Splits a css string into declarations and plain css.
     *
     * @param string $css
     *
     * @return array{ css: string, declarations: array[] }
     */
    public function splitSelectors( string $css ): array
    {
        if ( empty( $css ) ) {
            return [];
        }

        $selectors = explode( '}', $css );
        $selectorCss = [];

        if ( count( $selectors ) > 1 ) {
            foreach ( $selectors as $cssPart ) {
                if ( empty( $cssPart ) ) {
                    continue;
                }

                $selector = $this->extractSelector( $cssPart );

                $selectorCss[ $selector ] = [
                    'declarations' => $this->splitDeclarations( $cssPart ),
                    'css' => $cssPart,
                ];
            }

        }

        return $selectorCss;
    }


    /**
     * Removes selectors from a CSS string, leaving only the declarations.
     *
     * @param string $css The CSS string.
     *
     * @return string CSS declarations only.
     */
    public function removeSelectors( string $css ): string
    {
        if ( empty( $css ) ) {
            return '';
        }

        // Regular expression to match selectors up to and including the opening brace
        $pattern = '/[^\{\}]+\s*\{/';

        // Use preg_replace to remove all matches
        $cleaned = preg_replace( $pattern, '', $css );

        // Check for ending }.
        if ( ( strlen( $cleaned ) - 1 ) === strpos( $cleaned, '}' ) ) {
            $cleaned = substr( $cleaned, 0, -1 );
        }

        // Check for starting {.
        if ( ( 0 === strpos( $cleaned, '}' ) ) ) {
            $cleaned = substr( $cleaned, 1 );
        }

        // Remove any remaining whitespace and newlines
        return trim( $cleaned );
    }


    /**
     * Extracts the selector part of a CSS string.
     *
     * @param string $css The full CSS string.
     *
     * @return string Selector portion of the CSS.
     */
    public function extractSelector( string $css ): string
    {
        // First clean css from selectors.
        $cleaned = $this->removeSelectors( $css );

        // Then set the position the css starts.
        $cleanedPosition = strpos( $css, $cleaned );

        // Return the leading selector by removing the css including starting bracket "{"
        return substr( $css, 0, $cleanedPosition - 1 );
    }


    /**
     * Converts an associative array of CSS properties back into a CSS string.
     *
     * @param array $cssArray Associative array of CSS declarations.
     *
     * @return string CSS string.
     */
    public function stringify( array $cssArray ): string
    {
        $cssString = '';
        foreach ( $cssArray as $property => $value ) {
            $cssString .= $property . ': ' . $value . '; ';
        }

        return rtrim( $cssString, '; ' );
    }


    /**
     * Merges multiple associative arrays into one.
     *
     * @param array ...$arrays Arrays to merge.
     *
     * @return array Merged associative array.
     */
    public function merge( array ...$arrays ): array
    {
        return array_reduce( $arrays, function( array $prev, array $arr ): array {
            foreach ( $arr as $key => $value ) {
                $prevValue = $prev[ $key ] ?? null;
                $prev[ $key ] = $value;

                if (
                    $this->isAssoc( $prevValue ) &&
                    $this->isAssoc( $value )
                ) {
                    $prev[ $key ] = $this->merge( $prevValue, $value );

                } elseif (
                    $this->isIndex( $prevValue ) &&
                    $this->isIndex( $value ) &&
                    count( $value ) > 0
                ) {
                    $prev[ $key ] = $value;

                } elseif ( $this->isAssoc( $value ) ) {
                    $prev[ $key ] = $value;

                }
            }

            return $prev;
        }, [] );
    }


    /**
     * Determine if an array is associative.
     *
     * @param mixed $arr
     *
     * @return bool
     */
    private function isAssoc( $arr ): bool
    {
        return is_array( $arr ) && array_keys( $arr ) !== range( 0, count( $arr ) - 1 );
    }


    /**
     * Determine if an array is indexed.
     *
     * @param mixed $arr
     *
     * @return bool
     */
    private function isIndex( $arr ): bool
    {
        return is_array( $arr ) && array_keys( $arr ) === range( 0, count( $arr ) - 1 );
    }


    /**
     * Traverse a nested Array or object by given path.
     *
     * @param array $path      The path to traverse
     * @param mixed $data      The data to traverse
     * @param mixed $default   The default value if nothing is found
     *
     * @return mixed
     */
    function traverseGet( array $path, mixed $data, mixed $default = null ): mixed
    {
        foreach ( $path as $key ) {
            if ( is_array( $data ) && array_key_exists( $key, $data ) ) {
                return $data[ $key ];
            } elseif ( is_object( $data ) && isset( $data->$key ) ) {
                return $data->$key;
            }

            return $default;
        }

        return $data;
    }


    /**
     * Returns properties that are wp native.
     *
     * @return array containing properties
     */
    public function nativeProperties(): array
    {
       return $this->nativeProperties;
    }


    /**
     * Returns properties to that should not be included on saving html.
     *
     * @return array containing properties
     */
    public function ignoreProperties(): array
    {
       return $this->ignoreProperties;
    }


    /**
     * Returns selector mapping to remap css properties on elements.
     *
     * @return array containing properties
     */
    public function selectorMapping(): array
    {
       return $this->selectorMapping;
    }
}
