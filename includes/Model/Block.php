<?php

declare( strict_types=1 );

namespace QP\Viewports\Model;

use QP\Viewports\Controller\BlockProcessor;
use QP\Viewports\Controller\CSSParser;

/**
 * Represents a single block with its attributes, content, and CSS.
 *
 * Provides methods to sanitize attributes, process inner blocks,
 * modify styles for saving, and serialize block data.
 *
 * @package QP\Viewports\Model
 */
class Block {

    /**
     * Block name.
     *
     * @var string
     */
    public string $blockName = '';

    /**
     * Block attributes.
     *
     * @var array
     */
    public array $attrs = [];

    /**
     * Inner HTML content of the block.
     *
     * @var string
     */
    public string $innerHtml = '';

    /**
     * Inner content array of the block.
     *
     * @var array
     */
    public array $innerContent = [];

    /**
     * Inner blocks array.
     *
     * @var array
     */
    public array $innerBlocks = [];

    /**
     * Options retrieved from BlockProcessor.
     *
     * @var array
     */
    public array $options = [];

    /**
     * CSSRuleset object for handling CSS operations.
     *
     * @var CSSRuleset|null
     */
    public null|CSSRuleset $cssRuleset = null;


    /**
     * Constructor to initialize the block.
     *
     * @param string $blockName
     * @param array  $attrs
     * @param string $innerHtml
     * @param array  $innerContent
     * @param array  $innerBlocks
     */
    public function __construct(
        string $blockName,
        array $attrs = [],
        string $innerHtml = '',
        array $innerContent = [],
        array $innerBlocks = []
    ) {

        $this->blockName = $blockName;

        $this->attrs = $this->sanitizeAttrs( $attrs );

        $this->innerHtml = $innerHtml;
        $this->innerContent = $innerContent;
        $this->innerBlocks = $innerBlocks;

        $this->options = BlockProcessor::options();

        $this->cssRuleset = new CSSRuleset( [
            'blockName' => $this->blockName,
            'innerHtml' => $this->innerHtml,
            'attrs' => $this->attrs,
        ] );
    }


    /**
     * Sanitizes block attributes.
     *
     * Shifts default viewport style to top-level style attribute.
     *
     * @param array $attrs
     *
     * @return array
     */
    protected function sanitizeAttrs( array $attrs ) : array
    {
        // Shift the default viewport=0 to style attribute. It can differ by viewport simulation.
        if( isset( $attrs[ 'viewports' ][ 0 ][ 'style' ] ) ) {
            $attrs[ 'style' ] = $attrs[ 'viewports' ][ 0 ][ 'style' ];
            unset( $attrs[ 'viewports' ][ 0 ] );
        }

        return $attrs;
    }


    /**
     * Converts innerBlocks arrays to Block objects recursively.
     *
     * @return void
     */
    public function convertInnerBlocks() : void
    {
        if( is_array( reset( $this->innerBlocks ) ) ) {
            $this->innerBlocks = BlockProcessor::generateBlocks( $this->innerBlocks );
        }
    }


    /**
     * Returns inner block objects.
     *
     * @return Block[]
     */
    public function innerBlocks() : array
    {
        return $this->innerBlocks;
    }


    /**
     * Modifies block and inner block data before saving.
     *
     * @return void
     */
    public function modifySave() : void
    {
        // Modify inline styles if there are styles.
        if( isset( $this->attrs[ 'style' ] ) ) {
            $this->modifySaveStyles();
        }

        // Modify innerBlocks recursive.
        if( ! empty( $this->innerBlocks ) ) {
            $this->convertInnerBlocks();

            foreach( $this->innerBlocks as &$block ) {
                $block->modifySave();
            }
        }
    }


    /**
     * Modifies block CSS rules for saving.
     *
     * @return void
     */
    public function modifySaveStyles() : void
    {
        $this->cssRuleset->cleanupAttributeRules( $this->options[ 'ignore_properties' ] );
        $this->cssRuleset->cleanupInlineRules();
        $this->cssRuleset->compress();

        $inlineStyleRules = $this->cssRuleset->inlineStyleRules();
        if( empty( $inlineStyleRules ) ) {
            $this->resetInlineStyles();
            return;
        }

        foreach( $inlineStyleRules as $cssRule ) {
            $this->modifySaveHTML( $cssRule );
        }
    }


    /**
     * Applies a CSSRule to block HTML and inner content recursively.
     *
     * @param CSSRule $cssRule
     *
     * @return void
     */
    private function modifySaveHTML( CSSRule $cssRule ) : void
    {

        // Set selector parts depending on selector depth.
        $selector = $cssRule->selector();

        $selectorParts = [ '%' ];
        if( '%' !== $selector ) {
            $selectorParts = CSSParser::getSelectorParts( $selector );
        }

        // Start processing at the outer selector.
        $modifyNestedSelector = static function( string &$html, array $selectorParts ) use ( &$cssRule, &$modifyNestedSelector ) : void {
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

            // Break out on wildcard only.
            if( empty( $selectorParts ) && '%' === $tagName ) {
                $processor->set_attribute( 'style', $cssRule->compressedPropertiesCss() );
                $html = (string) $processor;

                return;
            }

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
                    $processor->set_attribute( 'style', $cssRule->compressedPropertiesCss() );
                    $html = (string) $processor;
                    continue;
                }

                // Extract the inner HTML manually
                $innerHtml = CSSParser::extractInnerHTML( $html, $tagName );
                $modifyNestedSelector( $innerHtml, $selectorParts );
                $html = CSSParser::replaceInnerHTML( $html, $innerHtml, $tagName );
            }
        };

        $modifyNestedSelector( $this->innerHtml, $selectorParts );

        if( isset( $this->innerContent[ 0 ] ) ) {
            $modifyNestedSelector( $this->innerContent[ 0 ], $selectorParts );
        }
    }



    /**
     * Resets all inline styles on block HTML and inner content.
     *
     * @return void
     */
    public function resetInlineStyles() : void
    {
        $processor = new \WP_HTML_Tag_Processor( $this->innerHtml );
        $processor->next_tag();
        $processor->remove_attribute( 'style' );

        $this->innerHtml = (string) $processor;

        if( isset( $this->innerContent[ 0 ] ) ) {
            $processor = new \WP_HTML_Tag_Processor( $this->innerContent[ 0 ] );
            $processor->next_tag();
            $processor->remove_attribute( 'style' );

            $this->innerContent[ 0 ] = (string) $processor;
        }
    }


    /**
     * Returns serialized block data suitable for saving.
     *
     * @return array
     */
    public function serializedBlock() : array
    {
        $innerBlocks = [];

        if( ! empty( $this->innerBlocks ) ) {
            $this->convertInnerBlocks();

            foreach( $this->innerBlocks as $block ) {
                $innerBlocks[] = $block->serializedBlock();
            }
        }

        return [
            'blockName' => $this->blockName,
            'attrs' => $this->attrs,
            'innerHTML' => $this->innerHtml, // innerHTML key needs to be named ! camelCase
            'innerContent' => $this->innerContent,
            'innerBlocks' => $innerBlocks,
        ];
    }
}
