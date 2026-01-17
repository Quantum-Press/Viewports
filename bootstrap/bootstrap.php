<?php
/**
 * Bootstraps the modular app.
 *
 * @package QP\Viewports
 */

namespace QP\Viewports;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

use QP\Viewports\Vendor\Inpsyde\Modularity\Package;
use QP\Viewports\Vendor\Inpsyde\Modularity\Properties\PluginProperties;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

return static function (
    string $rootDir,
    array $additionalContainers = [],
    array $additionalModules = []
): ContainerInterface {
    /**
     * Skip path check.
     *
     * @psalm-suppress UnresolvableInclude
     */
    $modules = ( require "$rootDir/bootstrap/modules.php" )( $rootDir );

    $modules = array_merge( $modules, $additionalModules );

    /**
     * Use this filter to add custom module or remove some of existing ones.
     * Modules able to access container, add services and modify existing ones.
     */
    $modules = \apply_filters( 'quantum_viewports_modules', $modules );

    // Initialize plugin.
    $properties = PluginProperties::new( __FILE__ );
    $bootstrap = Package::new( $properties );

    foreach ( $modules as $module ) {
        $bootstrap->addModule( $module );
    }

    $bootstrap->boot();

    return $bootstrap->container();
};
