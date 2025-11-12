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
        \add_action( 'enqueue_block_editor_assets', function() {
            \wp_register_script(
                'quantum-viewports-scripts',
                sprintf( '%s/build/quantum-viewports.js', QUANTUM_VIEWPORTS_URL ),
                [ 'wp-blocks', 'wp-edit-post', 'wp-element', 'wp-i18n', 'lodash' ],
                QUANTUM_VIEWPORTS_VERSION,
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
                    'version' => QUANTUM_VIEWPORTS_VERSION,
                    'blockBlacklist' => $this->blockBlacklist(),
                    'gutenbergVersion' => $this->gutenbergVersion(),
                    'wordpressVersion' => $this->wordpressVersion(),
                ]
            );
            \wp_enqueue_script( 'quantum-viewports-scripts' );

            \wp_set_script_translations(
                'quantum-viewports-scripts',
                QUANTUM_VIEWPORTS_TEXTDOMAIN,
                QUANTUM_VIEWPORTS_PATH . '/languages/'
            );

            \wp_enqueue_style(
                'quantum-viewports-styles',
                sprintf( '%s/build/quantum-viewports.css', QUANTUM_VIEWPORTS_URL ),
                [],
                QUANTUM_VIEWPORTS_VERSION
            );
        }, 0 );

        return true;
    }


    /**
     * Return an array of blocks that should be blacklisted.
     *
     * @return array
     */
    public function blockBlacklist() : array
    {
        $issueBlocks = [
            'cloudcatch/light-modal-block',
            'quantum-editor/teaser', // Old name - Still in use
            'quantumpress/teaser',
        ];

        $blockBlacklist = \apply_filters( 'quantum_viewports_block_blacklist', $issueBlocks );

        return $blockBlacklist;
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

            if( ! empty( $pluginData[ 'Version' ] ) ) {
                return $pluginData[ 'Version' ];
            }
        }

        return 'unknown';
    }
}
