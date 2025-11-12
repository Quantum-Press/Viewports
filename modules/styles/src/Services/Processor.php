<?php

declare( strict_types=1 );

namespace QP\Viewports\Styles\Services;

use QP\Viewports\Styles\Block;
use QP\Viewports\Styles\CSSRule;
use QP\Viewports\Styles\CSSRuleSet;

/**
 * Handles block data processing and transformation.
 *
 * This controller provides utility methods for generating, modifying,
 * and serializing WordPress block structures used by Quantum Viewports.
 * It manages which block attributes are ignored, processes nested blocks,
 * and returns prepared block objects or arrays for saving.
 *
 * @package QP\Viewports\Controller
 */
class Processor {

    /**
     * Stores properties that should be ignored during block processing.
     *
     * @var array
     */
    private array $ignoreProperties = [];

    /**
     * Stores nested properties that should be ignored during block processing.
     *
     * @var array
     */
    private array $ignoreNestedProperties = [];


    /**
     * Class constructor.
     *
     * Initializes block processor properties.
     */
    public function __construct()
    {
        $this->registerProperties();
    }


    /**
     * Sets default property values and applies filters.
     *
     * @return void
     */
    protected function registerProperties(): void
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
     * Modifies and serializes saved block data.
     *
     * @param Parser $parser
     * @param Processor $processor
     * @param string $content a string for post_content
     *
     * @return array The modified and serialized block data.
     */
    public function preparePostContent( Parser $parser, Processor $processor, string $content ): string
    {
        $blocks = \parse_blocks( \stripslashes( $content ) );
        $blocks = $this->generateBlocks( $parser, $blocks );
        if( empty( $blocks ) ) {
            return '';
        }

        $modified = [];

        foreach( $blocks as $block ) {
            $block->modifySave( $parser, $processor );

            $modified[] = $block->serializedBlock( $parser, $processor );
        }

        return addslashes( \serialize_blocks( $modified ) );;
    }


    /**
     * Generates an array of Block objects from raw block data.
     *
     * @param Parser $parser
     * @param array $blocks The input array of block data arrays.
     *
     * @return Block[] The generated Block objects.
     */
    public function generateBlocks( Parser $parser, array $blocks ): array
    {
        $generated = [];

        foreach( $blocks as $blockData ) {
            $block = $this->generateBlock( $parser, $blockData );
            if( $block ) {
                $generated[] = $block;
            }
        }

        return $generated;
    }


    /**
     * Generates a single Block object from raw block data.
     *
     * @param Parser $parser
     * @param array $blockData The block data to process.
     *
     * @return Block|false The generated Block instance, or false on failure.
     */
    public function generateBlock( Parser $parser, array $blockData ): Block|false
    {
        if( empty( $blockData[ 'blockName' ] ) ) {
            return false;
        }

        return new Block(
            $parser,
            $this,
            $blockData[ 'blockName' ] ?? '',
            $blockData[ 'attrs' ] ?? [],
            $blockData[ 'innerHTML' ] ?? '', // innerHTML key needs to be named ! camelCase
            $blockData[ 'innerContent' ] ?? [],
            $blockData[ 'innerBlocks' ] ?? []
        );
    }


    /**
     * Generates a single CSSRuleSet object from raw block data and blockHtml.
     *
     * @param Parser $parser
     * @param array $blockData The block data to process.
     * @param ?string $blockHtml The block html to process.
     *
     * @return CSSRuleSet|false The generated Block instance, or false on failure.
     */
    public function generateCSSRuleSet(
        Parser $parser,
        array $blockData,
        ?string $blockHtml = null
    ): CSSRuleSet|false
    {
        if( empty( $blockData[ 'blockName' ] ) ) {
            return false;
        }

        return new CSSRuleSet(
           $parser,
           $this,
           $blockData,
           $blockHtml
        );
    }


    /**
     * Generates a single CSSRule object.
     *
     * @param string $source
     * @param string $property
     * @param string $selector
     * @param array  $properties
     * @param string $media
     * @param int    $minWidth
     * @param int    $maxWidth
     *
     * @return CSSRule|false The generated Block instance, or false on failure.
     */
    public function generateCSSRule(
        string $source,
        string $property,
        string $selector,
        array $properties,
        string $media = 'screen',
        int $minWidth = 0,
        int $maxWidth = -1,
    ): CSSRule|false
    {
        return new CSSRule(
            $source,
            $property,
            $selector,
            $properties,
            $media,
            $minWidth,
            $maxWidth,
        );
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
