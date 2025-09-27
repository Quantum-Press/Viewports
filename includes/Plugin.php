<?php

declare( strict_types=1 );

namespace QP\Viewports;

use QP\Viewports\Controller\Instance;
use QP\Viewports\Controller\BlockSupport;
use QP\Viewports\Controller\BlockSave;
use QP\Viewports\Controller\BlockRender;

/**
 * Viewports Plugin class.
 *
 * This class registers assets and extend block styles.
 *
 * @class    QP\Viewports\Plugin
 * @package  QP\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Plugin extends Instance {

    /**
     * Method to construct.
     */
    protected function __construct()
    {
        $this->includes();
        $this->set_hooks();
    }


    /**
     * Method to set includes.
     */
    protected function includes()
    {
        BlockSupport::getInstance();
        BlockSave::getInstance();
        BlockRender::getInstance();
    }


    /**
     * Method to set hooks.
     */
    protected function set_hooks()
    {
        \add_action( 'init', [ $this, 'load_plugin_textdomain' ] );
        \add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ], 0 );
    }


    /**
     * Method to load localisation files.
     */
    public function load_plugin_textdomain() {
        \load_plugin_textdomain(
            QUANTUM_VIEWPORTS_TEXTDOMAIN,
            false,
            dirname( \plugin_basename( __FILE__ ) ) . '/languages'
        );
    }


    /**
     * Method to enqueue block editor assets.
     */
    public function enqueue_block_editor_assets()
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
            'viewportsConfig',
            [
                'distribution' => $distribution,
                'version' => QUANTUM_VIEWPORTS_VERSION,
                'blockBlacklist' => $this->get_block_blacklist(),
                'gutenbergVersion' => $this->get_gutenberg_version(),
                'wordpressVersion' => $this->get_wordpress_version(),
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
     * Method to return the blacklist of blocks.
     */
    public function get_block_blacklist() : array
    {
        $issue_blocks = [
            'cloudcatch/light-modal-block',
            'quantum-editor/teaser', // Old name - Still in use
            'quantumpress/teaser',
        ];

        $block_blacklist = \apply_filters( 'quantum_viewports_block_blacklist', $issue_blocks );

        return $block_blacklist;
    }


    /**
     * Method to return the used wordpress version.
     */
    public function get_wordpress_version() : string
    {
        require ABSPATH . WPINC . '/version.php';

        return $wp_version;
    }


    /**
     * Method to return the used gutenberg version.
     */
    public function get_gutenberg_version() : string
    {
        if ( \is_plugin_active( 'gutenberg/gutenberg.php' ) ) {
            $plugin_data = \get_plugin_data( WP_PLUGIN_DIR . '/gutenberg/gutenberg.php' );

            if( ! empty( $plugin_data[ 'Version' ] ) ) {
                return $plugin_data[ 'Version' ];
            }
        }

        return 'unknown';
    }
}
