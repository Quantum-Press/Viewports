<?php

declare( strict_types=1 );

namespace QP\Viewports\Styles;

use QP\Viewports\Styles\Services\Parser;
use QP\Viewports\Styles\Services\Processor;

/**
 * Represents a set of CSS rules for a block, including inline and attribute-based rules.
 *
 * Handles parsing, cleaning, and compressing CSS rules from block HTML and attributes.
 *
 * @package QP\Viewports\Model
 */
class CSSRuleSet {

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
     * Constructs a CSSRuleSet from a block array and optional HTML.
     *
     * @param Parser $parser
     * @param Processor $processor
     * @param array $block Block array with keys: blockName, innerHtml, attrs.
     * @param string|null $blockHtml Optional HTML content.
     */
    public function __construct(
        Parser $parser,
        Processor $processor,
        array $block,
        ?string $blockHtml = null
    ) {

        $this->blockName = isset( $block[ 'blockName' ] ) ? $block[ 'blockName' ] : '';
        $this->blockHtml = null !== $blockHtml ? $blockHtml :
            ( isset( $block[ 'innerHtml' ] ) ? $block[ 'innerHtml' ] : '' );

        $this->generateRules(
            $parser,
            $processor,
            isset( $block[ 'attrs' ] ) ? $block[ 'attrs' ] : []
        );
    }


    /**
     * Generates CSS rules from attributes and inline styles.
     *
     * @param Parser $parser
     * @param Processor $processor
     * @param array $attributes
     */
    protected function generateRules( Parser $parser, Processor $processor, array $attributes = [] ): void
    {
        // First we parse attributes, to check its selectors for nested inline css.
        $attributeRules = $parser->parseAttributes( $processor, $this->blockName, $attributes );
        $selectors = $this->selectorsFromRules( $attributeRules );

        $inlineRules = [];

        if( empty( $selectors ) ) {
            $selectors = [ '%' ];
        }

        foreach( $selectors as $selector ) {
            $parsed = $parser->parseInlineStyles( $processor, $this->blockHtml, $selector );

            if( false !== $parsed ) {
                $inlineRules[ $selector ] = $parsed;
            }
        }

        if( ! empty( $inlineRules ) && ! empty( $attributeRules ) ) {
            $this->cleanParsed( $inlineRules, $attributeRules );
        }

        $this->inlineRules = $inlineRules;
        $this->attributeRules = $attributeRules;
    }


    /**
     * Cleans inline parsed CSS by removing properties controlled by attribute rules.
     *
     * @param array $inlineRules
     * @param array $attributeRules
     */
    private function cleanParsed( array &$inlineRules, array &$attributeRules ): void
    {
        foreach( $inlineRules as $inlineRule ) {
            foreach( $inlineRule->properties() as $inlineProperty => $value ) {
                $found = false;

                foreach( $attributeRules as $attributeRule ) {
                    foreach( $attributeRule->properties() as $attributeProperty => $value ) {

                        // Check if the inline property will be controlled by attributes.
                        if( $inlineProperty == $attributeProperty && $inlineRule->selector() === $attributeRule->selector() ) {
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
                    $inlineRule->removeCSSProperty( $inlineProperty );
                }
            }
        }
    }


    /**
     * Returns inline CSSRule objects.
     *
     * @return array
     */
    public function inlineRules(): array
    {
        return $this->inlineRules;
    }


    /**
     * Returns attribute CSSRule objects.
     *
     * @return array
     */
    public function attributeRules(): array
    {
        return $this->attributeRules;
    }


    /**
     * Returns compressed CSSRule objects.
     *
     * @return array
     */
    public function compressedRules(): array
    {
        return $this->compressedRules;
    }


    /**
     * Returns compressed CSS strings from the compressed rules.
     *
     * @return array
     */
    public function compressedCss(): array
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
     *
     * @return array
     */
    public function selectorsFromRules( array $cssRules ): array
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
    public function blockName(): string
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
    public function blockHtml( string $className = '' ): string
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
    public function css( string $selector ): string
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
    public function inlineStyleRules(): array
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
     * Removes attribute rules that should not be included on saving html.
     *
     * @param array $ignoreProperties
     */
    public function cleanupAttributeRules( array $ignoreProperties = [] ): void
    {
        foreach( $this->attributeRules as $index => $cssRule ) {
            $property = $cssRule->property();

            if( isset( $ignoreProperties[ $property ] ) ) {
                $ignoreCss = $ignoreProperties[ $property ];

                if( is_array( $ignoreCss ) ) {
                    foreach( $ignoreCss as $cssProperty ) {
                        $cssRule->removeCSSProperty( $cssProperty );
                    }

                    if( empty( $cssRule->properties() ) ) {
                        unset( $this->attributeRules[ $index ] );
                    }

                    return;
                }

                unset( $this->attributeRules[ $index ] );
            }
        }
    }


    /**
     * Cleans inline rules by removing properties already defined in attribute rules.
     */
    public function cleanupInlineRules(): void
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
     *
     * @param Processor $processor
     */
    public function compress( Processor $processor ): void
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
                $compressed[ $ruleSlug ] = $processor->generateCSSRule(
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


    /**
     * Returns the CSS rule hash.
     *
     * @return string
     */
    public function hash() : string
    {
        $hashed = [];

        foreach ( $this->compressedRules as $rule ) {
            $hashed[] = $rule->hash();
        }

        return substr( md5( implode( $hashed ) ), 0, 9 );
    }
}
