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
    'vp.plugin' => function( ContainerInterface $container ): PluginInterface {
        $factory = new FilePathPluginFactory( new StringVersionFactory() );
        return $factory->createPluginFromFilePath( dirname( realpath( __FILE__ ), 2 ) . '/quantum-viewports.php' );
    },

    'vp.version' => function( ContainerInterface $container ): string {
        $plugin = $container->get( 'quantum-viewports.plugin' );
        assert( $plugin instanceof PluginInterface );

        return (string) $plugin->getVersion();
    }
];