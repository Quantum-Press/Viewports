<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

/**
 * Manages singleton object instances for the application.
 *
 * Provides a centralized manager to store, retrieve, and check
 * instances of classes. Implements a singleton pattern for
 * the manager itself.
 *
 * @package QP\Viewports\Controller
 */
class InstanceManager {

    /**
     * Singleton instance of the InstanceManager.
     *
     * @var InstanceManager|null
     */
    protected static $instance = null;

    /**
     * Array storing instances of managed classes.
     *
     * @var array
     */
    protected $instances = [];


    /**
     * Retrieves a managed instance of a given class.
     *
     * @param string $classname Fully qualified class name.
     *
     * @static
     * @return object|false The instance if it exists, otherwise false.
     */
    public static function instance( string $classname ) : object|false
    {
        return self::_getManager()->_instance( $classname );
    }


    /**
     * Checks whether an instance of a given class exists.
     *
     * @param string $classname Fully qualified class name.
     *
     * @static
     * @return bool True if the instance exists, false otherwise.
     */
    public static function hasInstance( string $classname ) : bool
    {
        return self::_getManager()->_hasInstance( $classname );
    }


    /**
     * Adds a new instance to the manager.
     *
     * @param object $instance The instance to store.
     */
    public static function addInstance( object $instance ) : void
    {
        self::_getManager()->_addInstance( $instance );
    }


    /**
     * Returns the singleton manager instance.
     *
     * @static
     * @return InstanceManager The InstanceManager singleton.
     */
    protected static function _getManager() : InstanceManager
    {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }

        return self::$instance;
    }


    /**
     * Returns a stored instance for a given class.
     *
     * @param string $classname Fully qualified class name.
     *
     * @return object|false The instance if it exists, otherwise false.
     */
    public function _instance( string $classname ) : object|false
    {
        if ( isset( $this->instances[ $classname ] ) ) {
            return $this->instances[ $classname ];
        }

        return false;
    }



    /**
     * Checks if a stored instance exists for a given class.
     *
     * @param string $classname Fully qualified class name.
     *
     * @return bool True if the instance exists, false otherwise.
     */
    public function _hasInstance( string $classname ) : bool
    {
        if ( isset( $this->instances[ $classname ] ) ) {
            return true;
        }

        return false;
    }



    /**
     * Adds a new instance to the manager.
     *
     * @param object $instance The instance to store.
     *
     * @return void
     */
    public function _addInstance( object $instance ) : void
    {
        $this->instances[ get_class( $instance ) ] = $instance;
    }
}
