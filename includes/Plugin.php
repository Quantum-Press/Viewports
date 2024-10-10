<?php

namespace Quantum\Viewports;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

use Quantum\Viewports\Controller\Instance;
use Quantum\Viewports\Controller\CSS_Renderer;
use Quantum\Viewports\Controller\Template_Save;

/**
 * Viewports Plugin class.
 *
 * This class registers assets and extend block styles.
 *
 * @class    Quantum\Viewports\Plugin
 * @since    0.1.0
 * @version  0.2.15
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Plugin extends Instance {

	/**
	 * Method to construct.
	 *
	 * @since 0.1.0
	 * @version 0.2.15
	 */
	protected function __construct()
	{
		$this->includes();
		$this->set_hooks();
	}


	/**
	 * Method to set includes.
	 *
	 * @since 0.2.8
	 * @version 0.2.15
	 */
	protected function includes()
	{
		CSS_Renderer::get_instance();
		Template_Save::get_instance();
	}


	/**
	 * Method to set hooks.
	 *
	 * @since 0.2.15
	 */
	protected function set_hooks()
	{
		\add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );
	}


	/**
	 * Method to enqueue block editor assets.
	 *
	 * @since 0.2.15
	 */
	public function enqueue_block_editor_assets()
	{
		\wp_register_script(
			'qp-viewports-scripts',
			sprintf( '%s/build/qp-viewports.js', QUANTUM_VIEWPORTS_URL ),
			[ 'wp-blocks', 'wp-edit-post', 'wp-element', 'wp-i18n', 'lodash' ],
			QUANTUM_VIEWPORTS_VERSION
		);

		\wp_localize_script(
			'qp-viewports-scripts',
			'qpViewportsConfig',
			[
				'distribution' => defined( 'VIEWPORTS_PRO' ) && 'true' === VIEWPORTS_PRO ? 'pro' : 'lite',
				'version' => QUANTUM_VIEWPORTS_VERSION,
			]
		);
		\wp_enqueue_script( 'qp-viewports-scripts' );

		\wp_enqueue_style(
			'qp-viewports-styles',
			sprintf( '%s/build/qp-viewports.js', QUANTUM_VIEWPORTS_URL ),
			[],
			QUANTUM_VIEWPORTS_VERSION
		);
	}
}
