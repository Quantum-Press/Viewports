<?php

declare( strict_types=1 );

namespace QP\Viewports\Styles\Services;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

use QP\Viewports\Styles\Block;
use QP\Viewports\Styles\CSSRule;
use QP\Viewports\Styles\CSSRuleSet;

/**
 * Handles block data processing and transformation.
 *
 * This controller provides utility methods for generating, modifying,
 * and serializing WordPress block structures
 *
 * @package QP\Viewports\Controller
 */
class Processor {

    /**
     * Stores blacklist of blocks to ignore on processing
     *
     * @var array
     */
    private array $blockBlacklist = [];


    /**
     * Service class constructor.
     */
    public function __construct()
    {
        $this->registerNativeProperties();
    }


    /**
     * Register filterable blacklist of blocks to ignore on processing
     *
     * @return void
     */
    protected function registerNativeProperties(): void
    {
        $this->blockBlacklist = \apply_filters(
            'quantum_viewports_block_blacklist',
            [
                'cloudcatch/light-modal-block',
                'quantum-editor/teaser', // Old name - Still in use
                'quantumpress/teaser',
            ]
        );
    }


    /**
     * Modifies and serializes saved block data.
     *
     * @param Parser $parser
     * @param string $content a string for post_content
     *
     * @return array The modified and serialized block data.
     */
    public function preparePostContent( Parser $parser, string $content ): string
    {
        $blocks = \parse_blocks( \stripslashes( $content ) );
        $blocks = $this->generateBlocks( $parser, $blocks );
        if ( empty( $blocks ) ) {
            return '';
        }

        $modified = [];

        foreach ( $blocks as $block ) {
            $block->modifySave( $parser, $this );

            $modified[] = $block->serializedBlock( $parser, $this );
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

        foreach ( $blocks as $blockData ) {
            $block = $this->generateBlock( $parser, $blockData );
            if ( $block ) {
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
        if ( empty( $blockData[ 'blockName' ] ) ) {
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

        if ( empty( $blockData[ 'blockName' ] ) ) {
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
     * Return block type style defaults.
     *
     * @param string $blockName
     *
     * @return array containing default style attributes
     */
    public function blockStyleDefaults( string $blockName ): array
    {
        $blockType = \WP_Block_Type_Registry::get_instance()->get_registered( $blockName );

        if ( $blockType ) {
            $defaultAttributes = $blockType->attributes;

            if (
                isset( $defaultAttributes[ 'style' ] ) &&
                isset( $defaultAttributes[ 'style' ][ 'default' ] )
            ) {
                return $defaultAttributes[ 'style' ][ 'default' ];
            }
        }

        return [];
    }


    /**
     * Check whether blockName is in block blacklist
     *
     * @return bool
     */
    public function inBlockBlacklist( string $blockName ): bool
    {
        return in_array( $blockName, $this->blockBlacklist() );
    }


    /**
     * Return an array of blocks that should be blacklisted.
     *
     * @return array
     */
    public function blockBlacklist() : array
    {
        return $this->blockBlacklist;
    }
}
