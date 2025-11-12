<?php
/**
 * The list of modules.
 *
 * @package QP\Viewports
 */

namespace QP\Viewports;

use QP\Viewports\PluginModule;

return function ( string $root_dir ): iterable {
    $modules_dir = "$root_dir/modules";

    $modules = array(
        new PluginModule(),
        ( require "$modules_dir/editor/module.php" )(),
        ( require "$modules_dir/styles/module.php" )(),
    );
    // phpcs:disable WordPress.NamingConventions.ValidHookName.UseUnderscores

    return $modules;
};