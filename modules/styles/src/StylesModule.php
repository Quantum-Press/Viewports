<?php

declare( strict_types=1 );

namespace QP\Viewports\Styles;

use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ServiceModule;
use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ExecutableModule;
use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

class StylesModule implements ServiceModule, ExecutableModule
{
    use ModuleClassNameIdTrait;

    /**
     * Stores the collected CSS for the current request.
     *
     * @var string
     */
    protected string $css = '';

    /**
     * Stores post types that should be ignored during block processing.
     *
     * @var array|null
     */
    protected $invalidPostTypes = null;


    /**
     * {@inheritDoc}
     */
    public function services(): array
    {
        return require __DIR__ . '/../services.php';
    }


    /**
     * {@inheritDoc}
     */
    public function run( ContainerInterface $container ): bool
    {
        $processor = $container->get( 'vp.styles.processor' );
        $parser = $container->get( 'vp.styles.parser' );

        /**
         * Filters viewport support to block attributes.
         *
         * Ensures that every block type has 'viewports'
         * attributes defined as objects.
         */
        \add_filter( 'register_block_type_args', function( array $args ): array
        {
            if ( ! isset( $args[ 'attributes' ][ 'viewports' ] ) ) {
                $args[ 'attributes' ][ 'viewports' ] = [
                    'type' => 'object',
                ];
            }

            return $args;
        }, 10, 1 );

        /**
         * Filters the list of allowed CSS properties for blocks.
         */
        \add_filter( 'safe_style_css', function( array $styles ): array
        {
            $styles[] = 'display';
            $styles[] = 'background-repeat';

            return $styles;
        }, 10, 1 );

        /**
         * Filters post data before it is inserted into the database.
         */
        \add_filter( 'wp_insert_post_data', function( array $data, array $postarr ) use ( $parser, $processor ): array
        {
            // Ignore invalid and unsupported post_types.
            if(
                in_array( $postarr[ 'post_type' ], $this->invalidPostTypes() ) ||
                ! \use_block_editor_for_post_type( $postarr[ 'post_type' ] )
            ) {
                return $data;
            }

            // Prepare modified blocks for saving.
            $data[ 'post_content' ] = $processor->preparePostContent( $parser, $processor, $postarr[ 'post_content' ] );
            return $data;
        }, 10, 2 );

        /**
         * Filters the rendered block HTML to collect its css.
         */
        \add_filter( 'render_block', function( string $blockHtml, array $block ) use ( $parser, $processor ): string
        {
            // Check if the block contains viewports before processing.
            if (
                ! isset( $block[ 'attrs' ][ 'inlineStyles' ] ) ||
                empty( $block[ 'attrs' ][ 'inlineStyles' ] )
            ) {
                return $blockHtml;
            }

            $block[ 'innerHtml' ] = $blockHtml;

            $cssRuleSet = $processor->generateCSSRuleSet( $parser, $block );
            $cssRuleSet->compress( $processor );

            $className = \wp_unique_id( 'vp-' );
            $selector  = 'body .wp-site-blocks .' . $className;

            $css = $cssRuleSet->css( $selector );

            $this->registerCSS( $css );

            return $cssRuleSet->blockHtml( $className );
        }, 20, 2 );

        /**
         * Enqueues all previously registered inline block styles.
         */
        \add_action( 'wp_enqueue_scripts', function(): void
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
        }, 20 );

        return true;
    }


    /**
     * Appends the provided CSS to the global collection.
     *
     * @param string $css The CSS to register.
     *
     * @return void
     */
    private function registerCSS( string $css ): void
    {
        $this->css .= $css;
    }


    /**
     * Returns the list of post types that should be ignored.
     *
     * The list is filtered via the 'quantum_viewports_invalid_post_types' hook.
     *
     * @return array The invalid post types.
     */
    public function invalidPostTypes(): array
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
