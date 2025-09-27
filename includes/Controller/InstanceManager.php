<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

/**
 * Instance Manager Controller class.
 *
 * This class handles object instance management.
 *
 * @class    QP\Viewports\Controller\InstanceManager
 * @package  QP\Viewports\Controller
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class InstanceManager {

    /**
     * Property contains own instance.
     *
     * @var object InstanceManager
     */
    protected static $_instance = null;

    /**
     * Property contains instances.
     *
     * @var array
     */
    protected $_instances = [];



    /**
     * Method to return instance from manager.
     *
     * @param string (required) $classname
     *
     * @static
     * @return object instance || boolean false
     */
    public static function getInstance( $classname )
    {
        return self::_getManager()->_getInstance( $classname );
    }



    /**
     * Method to check whether we have given instance.
     *
     * @param string (required) $classname
     *
     * @static
     * @return boolean for its indication
     */
    public static function hasInstance( $classname )
    {
        return self::_getManager()->_hasInstance( $classname );
    }



    /**
     * Method to add instance
     *
     * @param string (required) $instance
     *
     * @static
     * @return object instance
     */
    public static function addInstance( $instance )
    {
        return self::_getManager()->_addInstance( $instance );
    }



    /**
     * Method to return set manager.
     *
     * @static
     * @return object instance
     */
    protected static function _getManager()
    {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }



    /**
     * Method to return instance.
     *
     * @return object|false
     */
    public function _getInstance( $classname )
    {
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
     * @return boolean for its indication
     */
    public function _hasInstance( $classname )
    {
        if ( isset( $this->_instances[ $classname ] ) ) {
            return true;
        }

        return false;
    }



    /**
     * Method to add instance.
     *
     * @param object (required) $instance
     */
    public function _addInstance( $instance )
    {
        $this->_instances[ get_class( $instance ) ] = $instance;
    }
}
