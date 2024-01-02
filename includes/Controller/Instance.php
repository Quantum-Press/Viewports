<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * Instance Controller class.
 *
 * This class is base of a single object instance.
 *
 * @class    Quantum\Viewports\Controller\Instance
 * @since    0.1.0
 * @package  Quantum\Viewports\Controller
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
abstract class Instance {

	/**
	 * Generates or calls own Instance.
	 *
	 * @since 0.1.0
	 *
	 * @static
	 * @return object instance
	 */
	public static function get_instance() {
		if ( ! Instance_Manager::has_instance( static::class ) ) {
			Instance_Manager::add_instance( new static() );
		}

		return Instance_Manager::get_instance( static::class );
	}
}
