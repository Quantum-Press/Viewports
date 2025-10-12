<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

use QP\Viewports\Model\CSSRuleset;

/**
 * Handles dynamic block rendering and CSS collection.
 *
 * This controller hooks into WordPress block rendering to gather inline
 * block styles, compress them, and enqueue them as inline styles
 * on the frontend. Each block is assigned a unique class name so
 * that its scoped CSS can be applied safely.
 *
 * @package QP\Viewports\Controller
 */
class BlockRender extends Instance {

    /**
     * Holds the collected CSS for the current request.
     *
     * @var string
     */
    protected string $css = '';


    /**
     * Class constructor.
     *
     * Initializes the instance and registers hooks.
     */
    protected function __construct()
    {
        $this->registerHooks();
    }


    /**
     * Registers all required WordPress hooks.
     *
     * @return void
     */
    protected function registerHooks() : void
    {
        \add_filter( 'render_block', [ $this, 'renderBlock' ], 20, 2 );
        \add_action( 'wp_enqueue_scripts', [ $this, 'enqueueBlockStyles' ], 20 );
    }


    /**
     * Filters the rendered block HTML to collect its inline CSS.
     *
     * @param string $blockHtml The block’s rendered HTML output.
     * @param array  $block      The full block data array.
     *
     * @return string The potentially modified block HTML.
     */
    public function renderBlock( string $blockHtml, array $block ) : string
    {
        // Check if the block contains inline styles before processing.
        if (
            ! isset( $block[ 'attrs' ][ 'inlineStyles' ] ) ||
            empty( $block[ 'attrs' ][ 'inlineStyles' ] )
        ) {
            return $blockHtml;
        }

        $block[ 'innerHtml' ] = $blockHtml;

        $ruleSet = new CSSRuleset( $block );
        $ruleSet->compress();

        $className = \wp_unique_id( 'vp-' );
        $selector  = 'body .wp-site-blocks .' . $className;

        $css = $ruleSet->css( $selector );

        $this->registerCSS( $css );

        return $ruleSet->blockHtml( $className );
    }


    /**
     * Appends the provided CSS to the global collection.
     *
     * @param string $css The CSS to register.
     *
     * @return void
     */
    private function registerCSS( string $css ) : void
    {
        $this->css .= $css;
    }


    /**
     * Enqueues all previously registered inline block styles.
     *
     * @return void
     */
    public function enqueueBlockStyles() : void
    {
        if ( empty( $this->css ) ) {
            return;
        }

        \wp_register_style(
            'quantum-viewports-frontend',
            false,
            [],
            QUANTUM_VIEWPORTS_VERSION
        );

        // Note: esc_html() cannot be used here because selectors like `div > span`
        // would be incorrectly escaped. For reference, see:
        // @see wp-includes/theme.php:1956 wp_custom_css_cb()
        \wp_add_inline_style(
            'quantum-viewports-frontend',
            \wp_strip_all_tags( $this->css ),
        );

        \wp_enqueue_style( 'quantum-viewports-frontend' );
    }
}
