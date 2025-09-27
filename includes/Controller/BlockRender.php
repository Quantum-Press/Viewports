<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

use Wikimedia\CSS\Parser\Parser;
use Wikimedia\CSS\Sanitizer\StylesheetSanitizer;
use Wikimedia\CSS\Util as CSSUtil;
use QP\Viewports\Model\CSSRuleset;

class BlockRender extends Instance {

    /**
     * Method to construct.
     */
    protected function __construct()
    {
        $this->set_hooks();
    }


    /**
     * Method to set hooks.
     */
    protected function set_hooks()
    {
        \add_filter( 'render_block', [ $this, 'renderBlock' ], 20, 2 );
        \add_action( 'wp_enqueue_scripts', [ $this, 'enqueueBlockStyles' ], 20 );
    }


    /**
     * Method to hook into block rendering to collect its css.
     *
     * @param string $block_html
     * @param array $block
     *
     * @return string
     */
    public function renderBlock( $block_html, $block ) : string
    {
        // Set style css sources and check if there is some css to render.
        if(
            ! isset( $block[ 'attrs' ][ 'inlineStyles' ] ) ||
            empty( $block[ 'attrs' ][ 'inlineStyles' ] )
        ) {
            return $block_html;
        }

        $block[ 'innerHTML' ] = $block_html;

        $ruleSet = new CSSRuleset( $block );
        $ruleSet->compress();

        $className = \wp_unique_id( 'vp-' );
        $selector = 'body .wp-site-blocks .' . $className;

        $css = $ruleSet->getCSS( $selector );

        $this->registerCSS( $css );

        return $ruleSet->getBlockHTML( $className );
    }


    /**
     * Method to register css.
     *
     * @param string $css
     */
    protected function registerCSS( $css )
    {
        global $viewportsStyles;

        $viewportsStyles .= $css;
    }


    /**
     * Sanitize CSS using Wikimedia\CSS\Parser and stripping all tags.
     * @see https://doc.wikimedia.org/css-sanitizer/master/index.html
     */
    protected function sanitizeCSS( string $css_text, bool $minify = true ) : string
    {
        // Replace expression entirely to remove the whole rule later.
        $pre_cleaned_css = \wp_strip_all_tags( preg_replace( [
            '/expression\s*\([^\)]*\)/i',
        ], 'expression', $css_text ) );

        // Parse css with wikimedia parser and extract rulelist.
        $parser = Parser::newFromString( $pre_cleaned_css );
        $stylesheet = $parser->parseStylesheet();
        $ruleList = $stylesheet->getRuleList();

        // Loop through rulelist to remove invalid rules.
        for ( $i = $ruleList->count() - 1; $i >= 0; $i-- ) {
            $rule = $ruleList->offsetGet( $i );

            $tokens = $rule->toTokenArray();
            $found = false;

            foreach ( $tokens as $token ) {
                $value = (string) $token->value();

                if (
                    false !== strpos( $value, 'expression' ) ||
                    false !== strpos( $value, 'javascript' )
                ) {
                    $found = true;
                }
            }

            if ( $found ) {
                $ruleList->remove( $i );
            }
        }

        $parsed_css = CSSUtil::stringify( $stylesheet, [ 'minify' => $minify ] );

        return $parsed_css;
    }


    /**
     * Method to enqueue styles registered before.
     */
    public function enqueueBlockStyles()
    {
        global $viewportsStyles;

        if ( empty( $viewportsStyles ) ) {
            return;
        }

        \wp_register_style(
            'quantum-viewports-frontend',
            false,
            [],
            QUANTUM_VIEWPORTS_VERSION
        );

        \wp_add_inline_style(
            'quantum-viewports-frontend',
            $this->sanitizeCSS( $viewportsStyles, true ),
        );

        \wp_enqueue_style( 'quantum-viewports-frontend' );
    }
}
