<?php

declare( strict_types=1 );

namespace QP\Viewports\Model;

use QP\Viewports\Controller\CSSParser;

/**
 * Represents a set of CSS rules for a block, including inline and attribute-based rules.
 *
 * Handles parsing, cleaning, and compressing CSS rules from block HTML and attributes.
 *
 * @package QP\Viewports\Model
 */
class CSSRuleset {

    /**
     * CSSRule objects parsed from inline styles.
     *
     * @var array
     */
    private array $inlineRules = [];

    /**
     * CSSRule objects parsed from attributes.
     *
     * @var array
     */
    private array $attributeRules = [];

    /**
     * Compressed CSSRule objects from attributes.
     *
     * @var array
     */
    private array $compressedRules = [];

    /**
     * Name of the block.
     *
     * @var string
     */
    private string $blockName = '';

    /**
     * Block HTML content.
     *
     * @var string
     */
    private string $blockHtml = '';

    /**
     * Block CSS array.
     *
     * @var array
     */
    private array $css = [];


    /**
     * Constructs a CSSRuleset from a block array and optional HTML.
     *
     * @param array $block Block array with keys: blockName, innerHtml, attrs.
     * @param string|null $blockHtml Optional HTML content.
     */
    public function __construct(
        array $block,
        ?string $blockHtml = null
    ) {

        $this->blockName = isset( $block[ 'blockName' ] ) ? $block[ 'blockName' ] : '';
        $this->blockHtml = null !== $blockHtml ? $blockHtml :
            ( isset( $block[ 'innerHtml' ] ) ? $block[ 'innerHtml' ] : '' );

        // Init html tag processor.
        $this->generateRules( isset( $block[ 'attrs' ] ) ? $block[ 'attrs' ] : [] );
    }


    /**
     * Generates CSS rules from attributes and inline styles.
     *
     * @param array $attributes
     */
    protected function generateRules( array $attributes = [] ) : void
    {
        // First we parse attributes, to check its selectors for nested inline css.
        $attributeParsed = $this->parseAttributes( $attributes );
        $attributeSelectors = $this->selectorsFromRules( $attributeParsed );

        $inlineParsed = [];

        if( empty( $attributeSelectors ) ) {
            $attributeSelectors = [ '%' ];
        }

        foreach( $attributeSelectors as $selector ) {
            $parsed = $this->parseInlineStyles( $selector );

            if( false !== $parsed ) {
                $inlineParsed[ $selector ] = $parsed;
            }
        }

        if( ! empty( $inlineParsed ) && ! empty( $attributeParsed ) ) {
            $this->cleanParsed( $inlineParsed, $attributeParsed );
        }

        $this->inlineRules = $inlineParsed;
        $this->attributeRules = $attributeParsed;
    }


    /**
     * Parses CSS rules from block attributes.
     *
     * @param array $attributes
     *
     * @return array
     */
    public function parseAttributes( array $attributes = [] ) : array
    {
        $attributeRules = [];

        // Check if there is a filled inlineStyles attribute to generate rules from.
        if( ! isset( $attributes[ 'inlineStyles' ] ) || empty( $attributes[ 'inlineStyles' ] ) ) {
            return [];
        }

        // Iterate over inlineStyles attribute to collect its css by key value.
        foreach( $attributes[ 'inlineStyles' ] as $viewport => $properties ) {
            if( empty( $properties ) ) {
                continue;
            }

            foreach( $properties as $property => $styles ) {
                foreach( $styles as $style ) {

                    // Check if there is css to extract.
                    if( isset( $style[ 'css' ] ) && ! empty( $style[ 'css' ] ) ) {
                        $properties = CSSParser::parse( $style[ 'css' ] );
                        $selector = CSSParser::extractSelector( $style[ 'css' ] );

                        // Check if we need to add an attribute style.
                        if( ! empty( $properties ) ) {
                            if( is_numeric( $viewport ) ) {
                                $attributeRules[] = new CSSRule(
                                    'attributes',
                                    $property,
                                    $selector,
                                    $properties,
                                    'screen',
                                    $viewport,
                                    isset( $style[ 'to' ] ) ? (int) $style[ 'to' ] : -1,
                                );

                                continue;
                            }

                            // Allow to register non-numeric viewport types.
                            $customRule = \apply_filters(
                                'quantum_viewports_custom_viewport_rule',
                                null,
                                $property,
                                $selector,
                                $properties,
                                $viewport
                            );

                            if( $customRule instanceOf CSSRule ) {
                                $attributeRules[] = $customRule;
                            }
                        }
                    }
                }
            }
        }

        return $attributeRules;
    }


    /**
     * Cleans inline parsed CSS by removing properties controlled by attribute rules.
     *
     * @param array $inlineParsed
     * @param array $attributeParsed
     */
    private function cleanParsed( array &$inlineParsed, array &$attributeParsed ) : void
    {
        foreach( $inlineParsed as $inlineCssRule ) {
            foreach( $inlineCssRule->properties() as $inlineProperty => $value ) {
                $found = false;

                foreach( $attributeParsed as $attributeCssRule ) {
                    foreach( $attributeCssRule->properties() as $attributeProperty => $value ) {

                        // Check if the inline property will be controlled by attributes.
                        if( $inlineProperty == $attributeProperty && $inlineCssRule->selector() === $attributeCssRule->selector() ) {
                            $found = true;
                            break;
                        }
                    }

                    if( $found ) {
                        break;
                    }
                }

                // Check if inline property occurs in attributes to remove it from inline properties.
                if( $found ) {
                    $inlineCssRule->removeCSSProperty( $inlineProperty );
                }
            }
        }
    }


    /**
     * Parses inline styles into a CSSRule object for a given selector.
     *
     * @param string $selector
     *
     * @return CSSRule|false
     */
    public function parseInlineStyles( string $selector = '' ) : CSSRule|false
    {
        if( '%' !== $selector ) {
            return $this->parseInlineSelector( $selector );
        }

        return $this->parseInline();
    }


    /**
     * Parses inline styles for a specific selector.
     *
     * @param string $selector
     *
     * @return CSSRule|false
     */
    public function parseInlineSelector( string $selector = '' ) : CSSRule|false
    {
        $selectorParts = CSSParser::sanitizeSelectorParts( $selector );
        if( false === $selectorParts ) {
            return false;
        }

        $inlineStyles = false;

        $processed = $this->processSelector(
            $this->blockHtml,
            $selectorParts,
            static function( \WP_HTML_Tag_Processor $processor ) use ( &$inlineStyles ) : void {
                $inlineStyles = $processor->get_attribute( 'style' );
            }
        );

        if( empty( $processed ) || empty( $inlineStyles ) ) {
            return false;
        }

        $inlineParsed = CSSParser::parse( $inlineStyles );
        if( empty( $inlineParsed ) ) {
            return false;
        }

        return new CSSRule(
            'inline',
            'inline',
            $selector,
            $inlineParsed,
            'screen',
        );
    }


    /**
     * Processes nested HTML elements based on selector parts and executes a callback on match.
     *
     * @param string $html
     * @param array $selectorParts
     * @param callable|null $callback
     *
     * @return array Found tag names
     */
    protected function processSelector(
        string $html,
        array $selectorParts,
        callable|null $callback = null
    ) : array
    {

        $foundElements = [];

        // Start processing at the outer selector.
        $processNestedSelector = static function(
            string $html,
            array $selectorParts,
            callable $callback
        ) use ( &$foundElements, &$processNestedSelector ) : void {
            if( empty( $selectorParts ) ) {
                return;
            }

            // Set the current selectorPart.
            $currentSelector = array_shift( $selectorParts ); // Hole den aktuellen Selektor-Teil
            $currentSelectorParts = explode(
                '.',
                $currentSelector
            ); // Split in tag and classes

            $tagName = array_shift( $currentSelectorParts );
            $className = implode(
                '.',
                $currentSelectorParts
            );

            // Set processor to iterate over.
            $processor = new \WP_HTML_Tag_Processor( $html );
            $processor->next_tag();

            // Find matching elements for the current selector part.
            while( $processor->next_tag( [ $tagName ] ) ) {

                // Check if tagName matches.
                $currentTagName = strtolower( $processor->get_tag() );
                if( $tagName !== $currentTagName ) {
                    continue;
                }

                // Check if optional className matches.
                if( $className && ! $processor->has_class( $className ) ) {
                    continue;
                }

                // Check if last selector part reached.
                if( empty( $selectorParts ) ) {
                    if( is_callable( $callback ) ) {
                        $callback( $processor );
                    }

                    $foundElements[] = $currentTagName;
                    continue;
                }

                // Extract the inner HTML manually.
                $innerHtml = CSSParser::extractInnerHTML( $currentTagName, $tagName );
                $processNestedSelector( $innerHtml, $selectorParts, $callback );
            }
        };

        $processNestedSelector( $html, $selectorParts, $callback );

        return $foundElements;
    }


    /**
     * Parses top-level inline styles from the block HTML.
     *
     * @return CSSRule|false
     */
    public function parseInline() : CSSRule|false
    {
        $processor = new \WP_HTML_Tag_Processor( $this->blockHtml );
        $processor->next_tag();

        $inlineStyles = $processor->get_attribute( 'style' );

        if( empty( $inlineStyles ) ) {
            return false;
        }

        $inlineParsed = CSSParser::parse( $inlineStyles );
        if( empty( $inlineParsed ) ) {
            return false;
        }

        return new CSSRule(
            'inline',
            'inline',
            '%',
            $inlineParsed,
            'screen',
        );
    }


    /**
     * Returns inline CSSRule objects.
     *
     * @return array
     */
    public function inlineRules() : array
    {
        return $this->inlineRules;
    }


    /**
     * Returns attribute CSSRule objects.
     *
     * @return array
     */
    public function attributeRules() : array
    {
        return $this->attributeRules;
    }


    /**
     * Returns compressed CSSRule objects.
     *
     * @return array
     */
    public function compressedRules() : array
    {
        return $this->compressedRules;
    }


    /**
     * Returns compressed CSS strings from the compressed rules.
     *
     * @return array
     */
    public function compressedCss() : array
    {
        if( empty( $this->compressedRules ) ) {
            return [];
        }

        $css = [];

        foreach( $this->compressedRules as $cssRule ) {
            $cssString = $cssRule->css();

            if( ! empty( $cssString ) ) {
                $css[] = $cssString;
            }
        }

        return $css;
    }


    /**
     * Returns unique selectors from given CSSRules.
     *
     * @param array $cssRules
     * @return array
     */
    public function selectorsFromRules( array $cssRules ) : array
    {
        if( empty( $cssRules ) ) {
            return [ '%' ];
        }

        $selectors = [ '%' ];

        foreach( $cssRules as $cssRule ) {
            $selector = $cssRule->selector();

            if( ! in_array( $selector, $selectors ) ) {
                $selectors[] = $selector;
            }
        }

        return $selectors;
    }


    /**
     * Returns the block name.
     *
     * @return string
     */
    public function blockName() : string
    {
        return $this->blockName;
    }


    /**
     * Returns the block HTML.
     * Optionally removes styles and adds a class.
     *
     * @param string $className
     *
     * @return string
     */
    public function blockHtml( string $className = '' ) : string
    {
        if( empty( $className ) ) {
            return $this->blockHtml;
        }

        $processor = new \WP_HTML_Tag_Processor( $this->blockHtml );
        $processor->next_tag();
        $processor->remove_attribute( 'style' );
        $processor->add_class( $className );

        return (string) $processor;
    }


    /**
     * Returns the CSS for a specific selector from compressed rules.
     *
     * @param string $selector
     *
     * @return string
     */
    public function css( string $selector ) : string
    {
        $css = '';

        foreach( $this->compressedRules as $cssRule ) {
            $css .= $cssRule->css( $selector );
        }

        return $css;
    }


    /**
     * Returns all inline style rules, merging with attribute inline styles.
     *
     * @return array
     */
    public function inlineStyleRules() : array
    {
        $cssRules = [];

        foreach( $this->inlineRules() as $cssRule ) {
            $cssRules[] = $cssRule;
        }

        foreach( $this->attributeRules() as $cssRule ) {
            if( $cssRule->isInlineStyle() ) {
                $found = false;

                foreach( $cssRules as &$checkRule ) {
                    if( $checkRule->slug() === $cssRule->slug() ) {
                        $checkRule->addCSSProperties( $cssRule->properties(), true );
                        $found = true;
                        break;
                    }
                }

                if( ! $found ) {
                    $cssRules[] = $cssRule;
                }
            }
        }

        return $cssRules;
    }


    /**
     * Removes attribute rules matching specific properties.
     *
     * @param array $ignoreProperties
     */
    public function cleanupAttributeRules( array $ignoreProperties ) : void
    {
        foreach( $this->attributeRules as $index => $cssRule ) {
            if( in_array( $cssRule->property(), $ignoreProperties ) ) {
                unset( $this->attributeRules[ $index ] );
            }
        }
    }


    /**
     * Cleans inline rules by removing properties already defined in attribute rules.
     */
    public function cleanupInlineRules() : void
    {
        foreach( $this->inlineRules as &$inlineRule ) {
            foreach( $inlineRule->properties() as $property => $value ) {

                foreach( $this->attributeRules as $attributeRule ) {
                    if(
                        0 !== $attributeRule->minWidth() ||
                        'screen' !== $attributeRule->media()
                    ) {
                        continue;
                    }

                    if( array_key_exists( $property, $attributeRule->properties() ) ) {
                        $inlineRule->removeCSSProperty( $property );
                    }
                }
            }
        }
    }


    /**
     * Compresses all rules and removes empty CSS rules.
     */
    public function compress() : void
    {
        // Cleanup empty cssRules from inlineRules.
        foreach( $this->inlineRules() as $index => $cssRule ) {
            if( empty( $cssRule->properties() ) && '%' !== $cssRule->selector() ) {
                unset( $this->inlineRules[ $index ] );
            }
        }

        $compressed = [];

        // Compress attributeRules by selector and mediaQuery.
        foreach( $this->attributeRules() as $index => $cssRule ) {
            if( empty( $cssRule->properties() ) ) {
                unset( $this->attributeRules[ $index ] );
                continue;
            }

            $ruleSlug = $cssRule->slug();

            if( ! isset( $compressed[ $ruleSlug ] ) ) {
                $compressed[ $ruleSlug ] = new CSSRule(
                    $cssRule->source(),
                    'compressed',
                    $cssRule->selector(),
                    $cssRule->properties(),
                    $cssRule->media(),
                    $cssRule->minWidth(),
                    $cssRule->maxWidth(),
                );
                continue;
            }

            $compressed[ $ruleSlug ]->addCSSProperties( $cssRule->properties() );
        }

        $this->compressedRules = array_values( $compressed );
    }
}
