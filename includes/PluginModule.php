<?php

declare( strict_types=1 );

namespace QP\Viewports;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ServiceModule;

/**
 * Class PluginModule
 */
class PluginModule implements ServiceModule {
    use ModuleClassNameIdTrait;

    /**
     * {@inheritDoc}
     */
    public function services(): array
    {
        return require __DIR__ . '/services.php';
    }
}
