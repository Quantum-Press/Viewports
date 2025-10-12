<?php

declare( strict_types=1 );

namespace QP\Viewports;

use QP\Viewports\Controller\Instance;
use QP\Viewports\Controller\BlockSupport;
use QP\Viewports\Controller\BlockSave;
use QP\Viewports\Controller\BlockRender;

/**
 * Main Plugin class for the Viewports plugin.
 *
 * Handles registration of assets, block support, and editor integration.
 *
 * @package QP\Viewports
 * @author Sebastian Buchwald
 */
class Plugin extends Instance {

    /**
     * Constructor.
     *
     * Protected to implement singleton via Instance base class.
     */
    protected function __construct()
    {
        $this->includes();
        $this->registerHooks();
    }


    /**
     * Load required controllers and classes.
     */
    protected function includes() : void
    {
        BlockSupport::instance();
        BlockSave::instance();
        BlockRender::instance();
    }


    /**
     * Set WordPress hooks.
     */
    protected function registerHooks() : void
    {
        \add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ], 0 );
    }


    /**
     * Enqueue scripts and styles for the block editor.
     */
    public function enqueue_block_editor_assets() : void
    {
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
