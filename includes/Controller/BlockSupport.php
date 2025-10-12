<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

/**
 * Handles block support attributes and allowed CSS styles.
 *
 * This controller adds viewport support attributes to all block types
 * and extends the list of CSS properties considered safe for blocks.
 *
 * @package QP\Viewports\Controller
 */
class BlockSupport extends Instance {

    /**
     * Class constructor.
     *
     * Initializes hooks for block support.
     */
    protected function __construct()
    {
        $this->registerHooks();
    }


    /**
     * Registers WordPress hooks required for block support.
     *
     * @return void
     */
    protected function registerHooks() : void
    {
        \add_filter( 'register_block_type_args', [ $this, 'registerBlockTypeArgs' ], 10, 1 );
        \add_filter( 'safe_style_css', [ $this, 'safeStyleCSS' ], 10, 1 );
    }


    /**
     * Adds viewport and inlineStyles support to block attributes.
     *
     * Ensures that every block type has 'viewports' and 'inlineStyles'
     * attributes defined as objects.
     *
     * @param array $args The block type registration arguments.
     *
     * @return array The modified block type arguments.
     */
    public function registerBlockTypeArgs( array $args ) : array
    {
        if ( ! isset( $args[ 'attributes' ][ 'viewports' ] ) ) {
            $args[ 'attributes' ][ 'viewports' ] = [
                'type' => 'object',
            ];
        }

        if ( ! isset( $args[ 'attributes' ][ 'inlineStyles' ] ) ) {
            $args[ 'attributes' ][ 'inlineStyles' ] = [
                'type' => 'object',
            ];
        }

        return $args;
    }


    /**
     * Extends the list of allowed CSS properties for blocks.
     *
     * Adds 'display' and 'background-repeat' to the safe styles array.
     *
     * @param array $styles The array of currently allowed CSS properties.
     *
     * @return array The modified array including additional safe styles.
     */
    public function safeStyleCSS( array $styles ) : array
    {
        $styles[] = 'display';
        $styles[] = 'background-repeat';

        return $styles;
    }
}
