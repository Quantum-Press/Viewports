<?php

namespace Quantum\Viewports;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

use Quantum\Viewports\Controller\Instance;
use Quantum\Viewports\Controller\Blocks;
use Quantum\Viewports\Controller\Posts;

/**
 * Viewports Plugin class.
 *
 * This class registers assets and extend block styles.
 *
 * @class    Quantum\Viewports\Plugin
 * @since    0.1.0
 * @version  0.2.8
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Plugin extends Instance {

	/**
	 * Method to construct.
	 *
	 * @since 0.1.0
	 */
	protected function __construct()
	{
		$this->includes();
	}


	/**
	 * Method to set includes.
	 *
	 * @since 0.2.8
	 */
	protected function includes()
	{
		Blocks::get_instance();
		Posts::get_instance();
	}
}
