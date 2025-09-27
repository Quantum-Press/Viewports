<?php

declare( strict_types=1 );

namespace QP\Viewports\Model;

use QP\Viewports\Controller\CSSParser;

/**
 * This model class handles a single css ruleset.
 *
 * @class    QP\Viewports\Model\CSSRuleset
 * @package  QP\Viewports\Model\
 * @category Class
 */
class CSSRuleset {

    /**
     * Property contains CSSRule objects from inline styles.
     *
     * @var array
     */
    private array $inlineRules = [];

    /**
     * Property contains CSSRule objects from attributes.
     *
     * @var array
     */
    private array $attributeRules = [];

    /**
     * Property contains CSSRule objects compressed from attributes.
     *
     * @var array
     */
    private array $compressedRules = [];

    /**
     * Property contains block name.
     *
     * @var string
     */
    private string $blockName = '';

    /**
     * Property contains block html.
     *
     * @var string
     */
    private string $blockHTML = '';

    /**
     * Property contains block css array.
     *
     * @var array
     */
    private array $css = [];


    /**
     * Method to construct a CSSRuleset object by block args.
     *
     * @param array $block
     * @param null|string $blockHTML
     */
    public function __construct(
        array $block,
        string $blockHTML = null
    ) {
        $this->blockName = isset( $block[ 'blockName' ] ) ? $block[ 'blockName' ] : '';
        $this->blockHTML = null !== $blockHTML ? $blockHTML :
            ( isset( $block[ 'innerHTML' ] ) ? $block[ 'innerHTML' ] : '' );

        // Init html tag processor.
        $this->generateRules( isset( $block[ 'attrs' ] ) ? $block[ 'attrs' ] : [] );
    }


    /**
     * Method to generate rules by generating cssRules from attributes first.
     * This allows to derive the nested rules by selectors.
     *
     * @param array $attributes
     */
    protected function generateRules( $attributes = [] )
    {
        // First we parse attributes, to check its selectors for nested inline css.
        $attributeParsed = $this->parseAttributes( $attributes );
        $attributeSelectors = $this->getSelectorsFromRules( $attributeParsed );

        $inlineParsed = [];

        if( empty( $attributeSelectors ) ) {
            $parsed = $this->parseInlineStyles( '%' );

            if( false !== $parsed ) {
                $inlineParsed[ '%' ] = $parsed;
            }

        } else {
            foreach( $attributeSelectors as $selector ) {
                $parsed = $this->parseInlineStyles( $selector );
                if( false !== $parsed ) {
                    $inlineParsed[ $selector ] = $parsed;
                }
            }
        }

        if( ! empty( $inlineParsed ) && ! empty( $attributeParsed ) ) {
            $this->cleanParsed( $inlineParsed, $attributeParsed );
        }

        $this->inlineRules = $inlineParsed;
        $this->attributeRules = $attributeParsed;
    }


    /**
     * Method to parse attribute styles.
     *
     * @param array $attributes
     *
     * @return array
     */
    public function parseAttributes( $attributes = [] ) : array
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
                        $selector = CSSParser::getSelector( $style[ 'css' ] );

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
                            } else {

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
        }

        return $attributeRules;
    }


    /**
     * Method to clean parsed css rules.
     * This will filter out all properties from inlineStyles controlled by style attribute.
     *
     * @param array $inlineParsed
     * @param array $attributeParsed
     */
    private function cleanParsed( array &$inlineParsed, array &$attributeParsed )
    {
        foreach( $inlineParsed as $inlineCSSRule ) {
            foreach( $inlineCSSRule->getCSSProperties() as $inlineProperty => $value ) {
                $found = false;

                foreach( $attributeParsed as $attributeCSSRule ) {
                    foreach( $attributeCSSRule->getCSSProperties() as $attributeProperty => $value ) {

                        // Check if the inline property will be controlled by attributes.
                        if( $inlineProperty == $attributeProperty && $inlineCSSRule->getSelector() === $attributeCSSRule->getSelector() ) {
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
                    $inlineCSSRule->removeCSSProperty( $inlineProperty );
                }
            }
        }
    }


    /**
     * Method to parse inline styles as CSSRule.
     *
     * @param string $selector
     *
     * @return CSSRule|false
     */
    public function parseInlineStyles( $selector = '' ) : CSSRule|false
    {
        if( '%' !== $selector ) {
            return $this->parseInlineSelector( $selector );
        }

        return $this->parseInline();
    }


    /**
     * Method to parse inline styles by selector.
     *
     * @param string $selector
     *
     * @return CSSRule|false
     */
    public function parseInlineSelector( $selector = '' ) : CSSRule|false
    {
        $selectorParts = CSSParser::getSelectorParts( $selector );
        if( false === $selectorParts ) {
            return false;
        }

        $inlineStyles = false;

        $processed = $this->processSelector(
            $this->blockHTML,
            $selectorParts,
            function( $processor ) use ( &$inlineStyles ) {
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
     * Method to process HTML elements based on a nested CSS selector and return them.
     *
     * @param string $html
     * @param array $selectorParts
     * @param callable|null $callback fires if found element
     *
     * @return array containing tagName strings
     */
    protected function processSelector( $html, $selectorParts, $callback = null ) : array
    {
        $foundElements = [];

        // Start processing at the outer selector.
        $processNestedSelector = function(
            $html,
            $selectorParts,
            $callback
        ) use ( &$foundElements, &$processNestedSelector ) {
            if( empty( $selectorParts ) ) {
                return;
            }

            // Set the current selectorPart.
            $currentSelector = array_shift( $selectorParts ); // Hole den aktuellen Selektor-Teil
            $currentSelectorParts = explode(
                '.',
                $currentSelector
            ); // Teile in Tag und Klassen auf

            $tagName = array_shift( $currentSelectorParts );
            $className = implode(
                '.',
                $currentSelectorParts
            );

            // Set processor to iterate over.
            $processor = new \WP_HTML_Tag_Processor( $html );
            $processor->next_tag();

            // Find matching elements for the current selector part
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
                } else {

                    // Extract the inner HTML manually
                    $innerHTML = CSSParser::extractInnerHTML( $currentTagName, $tagName );
                    $processNestedSelector( $innerHTML, $selectorParts, $callback );
                }
            }
        };

        $processNestedSelector( $html, $selectorParts, $callback );

        return $foundElements;
    }


    /**
     * Method to parse inline styles from actual processor.
     *
     * @return CSSRule|false
     */
    public function parseInline() : CSSRule|false
    {
        $processor = new \WP_HTML_Tag_Processor( $this->blockHTML );
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
     * Method to return inline CSSRules.
     *
     * @return array
     */
    public function getInlineRules() : array
    {
        return $this->inlineRules;
    }


    /**
     * Method to return attribute CSSRules.
     *
     * @return array
     */
    public function getAttributeRules() : array
    {
        return $this->attributeRules;
    }


    /**
     * Method to return compressed attribute CSSRules.
     *
     * @return array
     */
    public function getCompressedRules() : array
    {
        return $this->compressedRules;
    }



    /**
     * Method to return compressed CSS generated from compressed CSSRules.
     *
     * @return array
     */
    public function getCompressedCSS() : array
    {
        if( empty( $this->compressedRules ) ) {
            return [];
        }

        $css = [];

        foreach( $this->compressedRules as $cssRule ) {
            $cssString = $cssRule->getCSS();

            if( ! empty( $cssString ) ) {
                $css[] = $cssString;
            }
        }

        return $css;
    }


    /**
     * Method to return unique selectors from rules.
     *
     * @param array $cssRules
     *
     * @return array
     */
    public function getSelectorsFromRules( $cssRules ) : array
    {
        if( empty( $cssRules ) ) {
            return [ '%' ];
        }

        $selectors = [ '%' ];

        foreach( $cssRules as $cssRule ) {
            $selector = $cssRule->getSelector();

            if( ! in_array( $selector, $selectors ) ) {
                $selectors[] = $selector;
            }
        }

        return $selectors;
    }


    /**
     * Method to return blockName.
     *
     * @return string
     */
    public function getBlockName() : string
    {
        return $this->blockName;
    }


    /**
     * Method to return blockHTML.
     *
     * @param string $className
     *
     * @return string
     */
    public function getBlockHTML( $className = '' ) : string
    {
        if( empty( $className ) ) {
            return $this->blockHTML;
        }

        $processor = new \WP_HTML_Tag_Processor( $this->blockHTML );
        $processor->next_tag();
        $processor->remove_attribute( 'style' );
        $processor->add_class( $className );

        return (string) $processor;
    }


    /**
     * Method to return css.
     *
     * @param string $selector
     *
     * @return string
     */
    public function getCSS( $selector ) : string
    {
        $css = '';

        foreach( $this->compressedRules as $cssRule ) {
            $css .= $cssRule->getCSS( $selector );
        }

        return $css;
    }


    /**
     * Method to return inlineStyle cssRules.
     *
     * @return array
     */
    public function getInlineStyleRules() : array
    {
        $cssRules = [];

        foreach( $this->getInlineRules() as $cssRule ) {
            $cssRules[] = $cssRule;
        }

        foreach( $this->getAttributeRules() as $cssRule ) {
            if( $cssRule->isInlineStyle() ) {
                $found = false;

                foreach( $cssRules as &$checkRule ) {
                    if( $checkRule->getSlug() === $cssRule->getSlug() ) {
                        $checkRule->addCSSProperties( $cssRule->getCSSProperties(), 'compressed' );
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
     * Method to cleanup attribute rules by properties.
     */
    public function cleanupAttributeRules( $ignoreProperties )
    {
        foreach( $this->attributeRules as $index => $cssRule ) {
            if( in_array( $cssRule->getProperty(), $ignoreProperties ) ) {
                unset( $this->attributeRules[ $index ] );
            }
        }
    }


    /**
     * Method to cleanup inline rules by comparing with attributeRules.
     */
    public function cleanupInlineRules()
    {
        foreach( $this->inlineRules as &$inlineRule ) {
            foreach( $inlineRule->getCSSProperties() as $property => $value ) {

                foreach( $this->attributeRules as $attributeRule ) {
                    if(
                        0 !== $attributeRule->getMinWidth() ||
                        'screen' !== $attributeRule->getMedia()
                    ) {
                        continue;
                    }

                    if( array_key_exists( $property, $attributeRule->getCSSProperties() ) ) {
                        $inlineRule->removeCSSProperty( $property );
                    }
                }
            }
        }
    }


    /**
     * Method to compress the rules.
     */
    public function compress()
    {
        // Cleanup empty cssRules from inlineRules.
        foreach( $this->getInlineRules() as $index => $cssRule ) {
            if( empty( $cssRule->getCSSProperties() ) && '%' !== $cssRule->getSelector() ) {
                unset( $this->inlineRules[ $index ] );
            }
        }

        $compressed = [];

        // Compress attributeRules by selector and mediaQuery.
        foreach( $this->getAttributeRules() as $index => $cssRule ) {
            if( empty( $cssRule->getCSSProperties() ) ) {
                unset( $this->attributeRules[ $index ] );
                continue;
            }

            $ruleSlug = $cssRule->getSlug();

            if( ! isset( $compressed[ $ruleSlug ] ) ) {
                $compressed[ $ruleSlug ] = new CSSRule(
                    $cssRule->getSource(),
                    'compressed',
                    $cssRule->getSelector(),
                    $cssRule->getCSSProperties(),
                    $cssRule->getMedia(),
                    $cssRule->getMinWidth(),
                    $cssRule->getMaxWidth(),
                );
                continue;
            }

            $compressed[ $ruleSlug ]->addCSSProperties( $cssRule->getCSSProperties() );
        }

        $this->compressedRules = array_values( $compressed );
    }
}
