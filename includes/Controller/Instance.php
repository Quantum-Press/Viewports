<?php

namespace QP\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * Instance Controller class.
 *
 * This class is base of a single object instance.
 *
 * @class    QP\Viewports\Controller\Instance
 * @package  QP\Viewports\Controller
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
abstract class Instance {

	/**
	 * Generates or calls own Instance.
	 *
	 * @static
	 * @return object instance
	 */
	public static function getInstance() {
		if ( ! InstanceManager::hasInstance( static::class ) ) {
			InstanceManager::addInstance( new static() );
		}

		return InstanceManager::getInstance( static::class );
	}


	/**
	 * Generates or calls own Instance.
	 *
	 * @static
	 * @return object instance
	 */
	public static function maybeAddInstance() {
		if ( ! InstanceManager::hasInstance( static::class ) ) {
			InstanceManager::addInstance( new static() );
		}

		return InstanceManager::getInstance( static::class );
	}
}
