<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

/**
 * Handles saving of block content for supported post types.
 *
 * This controller hooks into WordPress post data insertion to
 * process and modify blocks before saving. It ignores unsupported
 * post types and posts without block editor support.
 *
 * @package QP\Viewports\Controller
 */
class BlockSave extends Instance {

    /**
     * Stores post types that should be ignored during block processing.
     *
     * @var array|null
     */
    protected $invalidPostTypes = null;


    /**
     * Class constructor.
     *
     * Initializes hooks for block save operations.
     */
    protected function __construct()
    {
        $this->registerHooks();
    }


    /**
     * Registers required WordPress hooks.
     *
     * @return void
     */
    protected function registerHooks() : void
    {
        \add_filter( 'wp_insert_post_data', [ $this, 'wp_insert_post_data' ], 10, 2 );
    }


    /**
     * Filters post data before it is inserted into the database.
     *
     * Modifies the post content by processing its blocks for
     * supported post types using BlockProcessor.
     *
     * @param array $data    The post data to be saved.
     * @param array $postarr The original post array.
     *
     * @return array The modified post data.
     */
    public function wp_insert_post_data( array $data, array $postarr ) : array
    {
        // Ignore invalid post_types.
        if( in_array( $postarr[ 'post_type' ], $this->invalidPostTypes() ) ) {
            return $data;
        }

        // Ignore posts without block editor support.
        if ( ! \use_block_editor_for_post_type( $postarr[ 'post_type' ] ) ) {
            return $data;
        }

        // Prepare blocks for modification.
        $blocks = \parse_blocks( \stripslashes( $postarr[ 'post_content' ] ) );
        $blocksModified = BlockProcessor::modifySavedBlocks( $blocks );

        // Prepare modified blocks for saving.
        $data[ 'post_content' ] = addslashes( \serialize_blocks( $blocksModified ) );
        return $data;
    }


    /**
     * Returns the list of post types that should be ignored.
     *
     * The list is filtered via the 'quantum_viewports_invalid_post_types' hook.
     *
     * @return array The invalid post types.
     */
    public function invalidPostTypes() : array
    {
        if( null === $this->invalidPostTypes ) {
            $invalidPostTypes = [
                'wp_global_styles',
                'wp_font_family',
                'wp_font_face',
                'customize_changeset',
            ];
            $this->invalidPostTypes = \apply_filters(
                'quantum_viewports_invalid_post_types',
                $invalidPostTypes
            );
        }

        return $this->invalidPostTypes;
    }
}
