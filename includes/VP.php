<?php

declare( strict_types=1 );

namespace QP\Viewports;

use \Exception;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

/**
 * Internal global data VP for Viewports.
 */
class VP
{
    /**
     * The container with services of the application modules.
     *
     * @var ContainerInterface|null
     */
    private static $container = null;

    /**
     * The container with services of the application modules.
     * Mainly for internal usage.
     * The compatibility between different versions of the plugins is not guaranteed.
     *
     * @throws Exception When no container.
     */
    public static function container(): ContainerInterface {
        if ( ! self::$container ) {
            throw new Exception( 'No Plugin container, probably called too early when the plugin is not initialized yet.' );
        }
        return self::$container;
    }


    /**
     * Init the data.
     *
     * @param ContainerInterface $container The app container.
     */
    public static function init( ContainerInterface $container ): void {
        self::$container = $container;
    }
}
