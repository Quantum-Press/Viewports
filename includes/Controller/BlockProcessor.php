<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

use QP\Viewports\Model\Block;

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
class BlockProcessor extends Instance {

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
     * Stores nested HTML block data.
     *
     * @var array
     */
    private array $nestedHtmlBlocks = [];


    /**
     * Class constructor.
     *
     * Initializes block processor properties.
     */
    protected function __construct()
    {
        $this->registerProperties();
    }


    /**
     * Sets default property values and applies filters.
     *
     * @return void
     */
    protected function registerProperties() : void
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
     * @param array $blocks An array of raw block data arrays.
     *
     * @static
     * @return array The modified and serialized block data.
     */
    public static function modifySavedBlocks( array $blocks ) : array
    {
        $blocks = self::generateBlocks( $blocks );
        if( empty( $blocks ) ) {
            return [];
        }

        $modified = [];

        foreach( $blocks as $block ) {
            $block->modifySave();

            $serializedBlock = $block->serializedBlock();

            $modified[] = $serializedBlock;
        }

        return $modified;
    }


    /**
     * Generates an array of Block objects from raw block data.
     *
     * @param array $blocks The input array of block data arrays.
     *
     * @static
     * @return Block[] The generated Block objects.
     */
    public static function generateBlocks( array $blocks ) : array
    {
        self::maybeAddInstance();

        $generated = [];

        foreach( $blocks as $blockData ) {
            $block = self::generateBlock( $blockData );
            if( $block ) {
                $generated[] = $block;
            }
        }

        return $generated;
    }


    /**
     * Generates a single Block object from raw block data.
     *
     * @param array $blockData The block data to process.
     *
     * @static
     * @return Block|false The generated Block instance, or false on failure.
     */
    public static function generateBlock( array $blockData ) : Block|false
    {
        if( empty( $blockData[ 'blockName' ] ) ) {
            return false;
        }

        self::maybeAddInstance();

        return new Block(
            $blockData[ 'blockName' ] ?? '',
            $blockData[ 'attrs' ] ?? [],
            $blockData[ 'innerHTML' ] ?? '', // innerHTML key needs to be named ! camelCase
            $blockData[ 'innerContent' ] ?? [],
            $blockData[ 'innerBlocks' ] ?? []
        );
    }


    /**
     * Returns instance configuration options.
     *
     * @return array The instance options.
     */
    public function _options() : array
    {
        return [
            'ignore_properties' => $this->ignoreProperties,
        ];
    }


    /**
     * Returns configuration options from the current instance.
     *
     * @static
     * @return array The instance options.
     */
    public static function options() : array
    {
        $instance = self::instance();

        return $instance->_options();
    }
}
