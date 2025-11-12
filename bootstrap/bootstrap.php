<?php
/**
 * Bootstraps the modular app.
 *
 * @package QP\Viewports
 */

namespace QP\Viewports;

use QP\Viewports\Vendor\Inpsyde\Modularity\Package;
use QP\Viewports\Vendor\Inpsyde\Modularity\Properties\PluginProperties;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

return function (
    string $root_dir,
    array $additional_containers = [],
    array $additional_modules = []
): ContainerInterface {
    /**
     * Skip path check.
     *
     * @psalm-suppress UnresolvableInclude
     */
    $modules = ( require "$root_dir/bootstrap/modules.php" )( $root_dir );

    $modules = array_merge( $modules, $additional_modules );

    /**
     * Use this filter to add custom module or remove some of existing ones.
     * Modules able to access container, add services and modify existing ones.
     */
    $modules = \apply_filters( 'quantum_viewports_modules', $modules );

    // Initialize plugin.
    $properties = PluginProperties::new( __FILE__ );
    $bootstrap  = Package::new( $properties );

    foreach ( $modules as $module ) {
        $bootstrap->addModule( $module );
    }

    $bootstrap->boot();

    return $bootstrap->container();
};