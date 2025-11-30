<?php

declare( strict_types=1 );

namespace QP\Viewports\Styles\Services;

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
     * Stores properties to ignore on parsing.
     *
     * @var array
     */
    private array $ignoreProperties = [];

    /**
     * Class constructor.
     */
    public function __construct()
    {
        $this->registerNativeProperties();
        $this->registerIgnoreProperties();
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
     * Sets default property values and applies filters.
     */
    protected function registerIgnoreProperties(): void
    {
        $this->ignoreProperties = \apply_filters(
            'quantum_viewports_ignore_properties',
            [
                'background',
                'qpBackground',
                'qpBoxShadow',
                'qpClipPath',
                'qpColumn',
                'qpDimensions',
                'qpSingleColumn',
                'qpColumns',
                'qpFilter',
                'qpFlex',
                'qpOpacity',
                'qpOverflow',
                'qpPosition',
                'qpTextShadow',
                'qpTransform',
                'qpVisibility',
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
        foreach( $declarations as $declaration ) {

            // If the declaration is not empty, process it
            if ( ! empty( $declaration ) ) {

                // Split the declaration into property and value by the first colon
                $parts = explode( ':', $declaration, 2 );

                // Ensure both property and value are present
                if( count( $parts ) !== 2 ) {
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
        if(
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
        $parsedRules = $this->parseViewportRules( $processor, $parsedValids, $viewports );

        return $parsedRules;
    }


    /**
     * Parses CSS rules from parsed valids and viewports.
     *
     * @param Processor $processor
     * @param array $parsedValids
     * @param array $viewports
     *
     * @return array
     */
    public function parseViewportRules(
        Processor $processor,
        array $parsedValids,
        array $viewports
    ): array
    {
        // Iterate over viewports attributes to parse them to css.
        $rules = [];
        foreach( $parsedValids as $viewport => $maxWidths ) {
            foreach( $maxWidths as $maxWidth => $validStyles ) {
                $styles = $this->traverseGet( [ $viewport, $maxWidth ], $viewports, [] );
                if( empty( $styles ) ) {
                    $styles = $this->traverseGet( [ $viewport ], $viewports, [] );
                }

                foreach( $styles as $style ) {
                    foreach( $style as $property => $value ) {
                        $valids = $this->traverseGet(
                            [ $viewport, $maxWidth, 'style', $property ],
                            $parsedValids,
                            []
                        );
                        $parsed = $this->parseStyleAttribute( $property, $value, $valids );
                        if( empty( $parsed ) ) { continue; }

                        foreach( $parsed as $selector => $css ) {

                            // Check if we need to add an attribute style.
                            if( ! empty( $css[ 'declarations' ] ) ) {
                                if( is_numeric( $viewport ) ) {
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

                                if( $customRule instanceOf CSSRule ) {
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
     * @param string $property
     * @param array $value
     * @param array $value
     *
     * @return array
     */
    public function parseStyleAttribute( string $property, array $value, array $valids ): array
    {
        if( in_array( $property, $this->nativeProperties, true ) ) {
            $engineStyles = \wp_style_engine_get_styles( [
                $property => $value,
            ] );

            $css = \apply_filters(
                'quantum_viewports_register_renderer_' . $property,
                $engineStyles[ 'css' ] ?? '',
                $value,
                $valids
            );

            if( is_string( $css ) && ! empty( $css ) ) {
                return [
                    '%' => [
                        'css' => $css,
                        'declarations' => $this->splitDeclarations( $css ),
                    ]
                ];
            }

            return [];
        }

        $css = \apply_filters(
            'quantum_viewports_register_renderer_' . $property,
            '',
            $value,
            $valids
        );

        if( is_string( $css ) && ! empty( $css ) ) {
            return $this->splitSelectors( $css );
        }

        return [];
    }


    public function parseValids( array $viewports ): array
    {
        $valids = [];
        $lastViewport = 0;

        ksort( $viewports );

        foreach( $viewports as $viewport => $styles ) {
            $maxWidths = [ 0 ];

            ksort( $maxWidths );

            foreach( $maxWidths as $maxWidth ) {
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

        if( preg_match( $pattern, $html, $matches ) ) {
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

        if( preg_match( $pattern, $html, $matches ) ) {
            $search = $matches[ 1 ] ?? '';

            if( ! empty( $search ) ) {
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
        if( false !== $this->sanitizeSelectorParts( $selector ) ) {
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
        if( preg_match( $pattern, $selector ) ) {

            // Split selector into parts, to check each for format issues.
            $parts = preg_split( '/[\s,]+/', $selector );
            foreach( $parts as $part ) {

                // Check if the part is matching the expected format.
                if( preg_match( '/^([a-zA-Z0-9]+)(\.[a-zA-Z0-9_-]+)*$/', $part, $matches ) ) {

                    // Check if first match is an element.
                    $element = strtolower( $matches[ 1 ] );
                    if( ! in_array( $element, $allowedElements ) && $element !== '*' ) {
                        return false;
                    }
                }
            }

            return $parts;
        }

        return false;
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

        foreach( $parts as $index => $part ) {
            $part = trim( $part );
            if( empty( $part ) ) {
                continue;
            }

            // Check for not existing colons, to remove declare.
            if( false !== strpos( $part, ':' ) ) {
                $part = trim( $part );
                $part = explode( ':', $part, 2 );
                $declarations[ $part[ 0 ] ] = $part[ 1 ];
            }
        }

        return $declarations;
    }


    public function splitSelectors( string $css ): array
    {
        if( empty( $css ) ) {
            return [];
        }

        $selectors = explode( '}', $css );
        $selectorCss = [];

        if( count( $selectors ) > 1 ) {
            foreach( $selectors as $cssPart ) {
                if( empty( $cssPart ) ) {
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
        if( empty( $css ) ) {
            return '';
        }

        // Regular expression to match selectors up to and including the opening brace
        $pattern = '/[^\{\}]+\s*\{/';

        // Use preg_replace to remove all matches
        $cleaned = preg_replace( $pattern, '', $css );

        // Check for ending }.
        if( ( strlen( $cleaned ) - 1 ) === strpos( $cleaned, '}' ) ) {
            $cleaned = substr( $cleaned, 0, -1 );
        }

        // Check for starting {.
        if( ( 0 === strpos( $cleaned, '}' ) ) ) {
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
            foreach( $arr as $key => $value ) {
                $prevValue = $prev[ $key ] ?? null;
                $prev[ $key ] = $value;

                if(
                    $this->isAssoc( $prevValue ) &&
                    $this->isAssoc( $value )
                ) {
                    $prev[ $key ] = $this->merge( $prevValue, $value );

                } elseif(
                    $this->isIndex( $prevValue ) &&
                    $this->isIndex( $value ) &&
                    count( $value ) > 0
                ) {
                    $prev[ $key ] = $value;

                } elseif( $this->isAssoc( $value ) ) {
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
     * Returns properties to ignore.
     *
     * @return array containing properties
     */
    public function ignoreProperties(): array
    {
       return $this->ignoreProperties;
    }
}
