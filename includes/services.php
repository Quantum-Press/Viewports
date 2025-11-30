<?php
/**
 * The plugin module services.
 *
 * @package QP\Viewports
 */

declare( strict_types=1 );

namespace QP\Viewports;

use Dhii\Versions\StringVersionFactory;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface;
use WpOop\WordPress\Plugin\PluginInterface;

return [
    'vp.plugin' => static function(): PluginInterface
    {
        $factory = new FilePathPluginFactory( new StringVersionFactory() );
        return $factory->createPluginFromFilePath( dirname( realpath( __FILE__ ), 2 ) . '/quantum-viewports.php' );
    },

    'vp.basename' => static function( ContainerInterface $container ): string
    {
        $plugin = $container->get( 'vp.plugin' );

        return $plugin->getBaseName();
    },

    'vp.version' => static function( ContainerInterface $container ): string
    {
        $plugin = $container->get( 'vp.plugin' );

        return (string) $plugin->getVersion();
    },

    'vp.path' => static function( ContainerInterface $container ): string
    {
        $plugin = $container->get( 'vp.plugin' );

        return $plugin->getBaseDir();
    },

    'vp.url' => static function( ContainerInterface $container ): string
    {
        $baseName = $container->get( 'vp.basename' );
        $dir = dirname( $baseName );

        return trailingslashit( WP_PLUGIN_URL . '/' . $dir );
    },

    'vp.textdomain' => static function( ContainerInterface $container ): string
    {
        $plugin = $container->get( 'vp.plugin' );

        return $plugin->getTextDomain();
    }
];
