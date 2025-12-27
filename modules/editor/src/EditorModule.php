<?php

declare( strict_types=1 );

namespace QP\Viewports\Editor;

use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ExecutableModule;
use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

class EditorModule implements ExecutableModule
{
    use ModuleClassNameIdTrait;

    /**
     * {@inheritDoc}
     */
    public function run( ContainerInterface $container ): bool
    {
        $processor = $container->get( 'vp.styles.processor' );

        $version = $container->get( 'vp.version' );
        $url = $container->get( 'vp.url' );
        $path = $container->get( 'vp.path' );
        $textdomain = $container->get( 'vp.textdomain' );

        \add_action(
            'enqueue_block_editor_assets',
            function() use ( $processor, $version, $url, $path, $textdomain ): void
            {
                \wp_register_script(
                    'quantum-viewports-scripts',
                    sprintf( '%s/build/quantum-viewports.js', $url ),
                    [ 'wp-blocks', 'wp-edit-post', 'wp-element', 'wp-i18n', 'lodash' ],
                    $version,
                    [
                        'in_footer' => true,
                    ],
                );

                $distribution = defined( 'QUANTUM_VIEWPORTS_EXTENDED' ) &&
                    'true' === QUANTUM_VIEWPORTS_EXTENDED ? 'extended' : 'native';

                \wp_localize_script(
                    'quantum-viewports-scripts',
                    'quantumViewportsConfig',
                    [
                        'distribution' => $distribution,
                        'version' => $version,
                        'blockBlacklist' => $processor->blockBlacklist(),
                        'gutenbergVersion' => $this->gutenbergVersion(),
                        'wordpressVersion' => $this->wordpressVersion(),
                    ]
                );
                \wp_enqueue_script( 'quantum-viewports-scripts' );

                \wp_set_script_translations(
                    'quantum-viewports-scripts',
                    $textdomain,
                    $path . '/languages/'
                );

                \wp_enqueue_style(
                    'quantum-viewports-styles',
                    sprintf( '%s/build/quantum-viewports.css', $url ),
                    [],
                    $version
                );
            }, 0
        );

        return true;
    }


    /**
     * Return the WordPress version.
     *
     * @return string
     */
    public function wordpressVersion() : string
    {
        require ABSPATH . WPINC . '/version.php';

        return $wp_version;
    }


    /**
     * Return the active Gutenberg plugin version or "unknown".
     *
     * @return string
     */
    public function gutenbergVersion() : string
    {
        if ( \is_plugin_active( 'gutenberg/gutenberg.php' ) ) {
            $pluginData = \get_plugin_data( WP_PLUGIN_DIR . '/gutenberg/gutenberg.php' );

            if ( ! empty( $pluginData[ 'Version' ] ) ) {
                return $pluginData[ 'Version' ];
            }
        }

        return 'unknown';
    }
}
