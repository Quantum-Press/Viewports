<?php

namespace Quantum\Viewports;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

use Quantum\Viewports\Controller\Instance;
use Quantum\Viewports\Controller\BlockSupport;
use Quantum\Viewports\Controller\BlockSave;
use Quantum\Viewports\Controller\BlockRender;

/**
 * Viewports Plugin class.
 *
 * This class registers assets and extend block styles.
 *
 * @class    Quantum\Viewports\Plugin
 * @package  Quantum\Viewports
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
