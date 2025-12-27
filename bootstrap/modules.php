<?php
/**
 * The list of modules.
 *
 * @package QP\Viewports
 */

namespace QP\Viewports;

use QP\Viewports\PluginModule;

return static function ( string $rootDir ): iterable
{
    $modulesDir = "$rootDir/modules";

    $modules = array(
        new PluginModule(),
        ( require "$modulesDir/editor/module.php" )(),
        ( require "$modulesDir/styles/module.php" )(),
    );
    // phpcs:disable WordPress.NamingConventions.ValidHookName.UseUnderscores

    return $modules;
};
