<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * Instance Manager Controller class.
 *
 * This class handles object instance management.
 *
 * @class    Quantum\Viewports\Controller\Instance
 * @since    0.1.0
 * @package  Quantum\Viewports\Controller
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Instance_Manager {

	/**
	 * Property contains own instance.
	 *
	 * @var object Instance_Manager
	 *
	 * @since 0.1.0
	 */
	protected static $_instance = null;

	/**
	 * Property contains instances.
	 *
	 * @var array
	 *
	 * @since 0.1.0
	 */
	protected $_instances = array();



	/**
	 * Method to return instance from manager.
	 *
	 * @param string (required) $classname
	 *
	 * @since 0.1.0
	 *
	 * @static
	 * @return object instance || boolean false
	 */
	public static function get_instance( $classname ) {
		return self::_get_manager()->_get_instance( $classname );
	}



	/**
	 * Method to check whether we have given instance.
	 *
	 * @param string (required) $classname
	 *
	 * @since 0.1.0
	 *
	 * @static
	 * @return boolean for its indication
	 */
	public static function has_instance( $classname ) {
		return self::_get_manager()->_has_instance( $classname );
	}



	/**
	 * Method to add instance
	 *
	 * @param string (required) $instance
	 *
	 * @since 0.1.0
	 *
	 * @static
	 * @return object instance
	 */
	public static function add_instance( $instance ) {
		return self::_get_manager()->_add_instance( $instance );
	}



	/**
	 * Method to return set manager.
	 *
	 * @since 0.1.0
	 *
	 * @static
	 * @return object instance
	 */
	protected static function _get_manager() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}



	/**
	 * Method to return instance.
	 *
	 * @since 0.1.0
	 *
	 * @return object instance || boolean false
	 */
	public function _get_instance( $classname ) {
		if ( isset( $this->_instances[ $classname ] ) ) {
			return $this->_instances[ $classname ];
		}

		return false;
	}



	/**
	 * Method to check whether we have instance.
	 *
	 * @param string (required) $classname
	 *
	 * @since 0.1.0
	 *
	 * @return boolean for its indication
	 */
	public function _has_instance( $classname ) {
		if ( isset( $this->_instances[ $classname ] ) ) {
			return true;
		}

		return false;
	}



	/**
	 * Method to add instance.
	 *
	 * @param object (required) $instance
	 *
	 * @since 0.1.0
	 */
	public function _add_instance( $instance ) {
		$this->_instances[ get_class( $instance ) ] = $instance;
	}
}
