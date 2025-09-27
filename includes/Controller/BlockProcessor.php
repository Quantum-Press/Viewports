<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

use QP\Viewports\Model\Block;

/**
 * This class handles block processing operations.
 *
 * @class    QP\Viewports\BlockProcessor
 * @package  QP\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class BlockProcessor extends Instance {

    /**
     * Property contains ignore properties.
     *
     * @var array
     */
    private array $ignoreProperties = [];

    /**
     * Property contains ignore nested properties.
     *
     * @var array
     */
    private array $ignoreNestedProperties = [];

    /**
     * Property contains nested html blocks.
     *
     * @var array
     */
    private array $nestedHtmlBlocks = [];


    /**
     * Method to construct.
     */
    protected function __construct()
    {
        $this->setProperties();
    }


    /**
     * Method to set properties.
     */
    protected function setProperties()
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
     * Method to return saved block objects modified.
     *
     * @param array $blocks
     *
     * @static
     * @return array
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

            $serializedBlock = $block->getSerializedBlock();

            $modified[] = $serializedBlock;
        }

        return $modified;
    }


    /**
     * Method to return generated block objects.
     *
     * @param array $blocks
     *
     * @static
     * @return Block[]
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
     * Method to return generated a single block object.
     *
     * @param array $blockData
     *
     * @static
     * @return Block|false
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
            $blockData[ 'innerHTML' ] ?? '',
            $blockData[ 'innerContent' ] ?? [],
            $blockData[ 'innerBlocks' ] ?? []
        );
    }


    /**
     * Method to return options.
     *
     * @return array
     */
    public function _getOptions() : array
    {
        return [
            'ignore_properties' => $this->ignoreProperties,
        ];
    }


    /**
     * Method to return options from instance.
     *
     * @static
     * @return array
     */
    public static function getOptions() : mixed
    {
        $instance = self::getInstance();

        return $instance->_getOptions();
    }
}
