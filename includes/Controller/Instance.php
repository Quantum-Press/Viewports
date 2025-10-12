<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

/**
 * Abstract base class for managing single object instances.
 *
 * Provides methods to generate or retrieve a singleton instance
 * of a class using the InstanceManager.
 *
 * @package QP\Viewports\Controller
 */
abstract class Instance {

    /**
     * Returns the singleton instance of the called class.
     *
     * If an instance does not exist, it will be created.
     *
     * @static
     * @return object|false The singleton instance of the class.
     */
    public static function instance() : object|false
    {
        if ( ! InstanceManager::hasInstance( static::class ) ) {
            InstanceManager::addInstance( new static() );
        }

        return InstanceManager::instance( static::class );
    }


    /**
     * Ensures an instance exists and returns it.
     *
     * Similar to getInstance(), but intended for optional early initialization.
     *
     * @static
     * @return object|false The singleton instance of the class.
     */
    public static function maybeAddInstance() : object|false
    {
        if ( ! InstanceManager::hasInstance( static::class ) ) {
            InstanceManager::addInstance( new static() );
        }

        return InstanceManager::instance( static::class );
    }
}
