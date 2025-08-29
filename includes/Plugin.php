<?php

namespace QP\Viewports;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

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
		\add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ], 0 );
	}


	/**
	 * Method to enqueue block editor assets.
	 */
	public function enqueue_block_editor_assets()
	{
		\wp_register_script(
			'viewports-scripts',
			sprintf( '%s/build/viewports.js', VIEWPORTS_URL ),
			[ 'wp-blocks', 'wp-edit-post', 'wp-element', 'wp-i18n', 'lodash' ],
			VIEWPORTS_VERSION
		);

		\wp_localize_script(
			'viewports-scripts',
			'viewportsConfig',
			[
				'distribution' => defined( 'VIEWPORTS_EXTENDED' ) && 'true' === VIEWPORTS_EXTENDED ? 'extended' : 'native',
				'version' => VIEWPORTS_VERSION,
				'blockBlacklist' => $this->get_block_blacklist(),
				'gutenbergVersion' => $this->get_gutenberg_version(),
				'wordpressVersion' => $this->get_wordpress_version(),
			]
		);
		\wp_enqueue_script( 'viewports-scripts' );

		\wp_enqueue_style(
			'viewports-styles',
			sprintf( '%s/build/viewports.js', VIEWPORTS_URL ),
			[],
			VIEWPORTS_VERSION
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

		$block_blacklist = \apply_filters( 'viewports_block_blacklist', $issue_blocks );

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
		if ( is_plugin_active( 'gutenberg/gutenberg.php' ) ) {
			$plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/gutenberg/gutenberg.php' );

			if( ! empty( $plugin_data[ 'Version' ] ) ) {
				return $plugin_data[ 'Version' ];
			}
		}

		return 'unknown';
	}
}
