<?php

declare( strict_types=1 );

namespace QP\Viewports;

use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ExecutableModule;
use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ExtendingModule;
use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use QP\Viewports\Vendor\Inpsyde\Modularity\Module\ServiceModule;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

/**
 * Class PluginModule
 */
class PluginModule implements ServiceModule, ExtendingModule, ExecutableModule {
    use ModuleClassNameIdTrait;

    /**
     * {@inheritDoc}
     */
    public function services(): array {
        return require __DIR__ . '/services.php';
    }


    /**
     * {@inheritDoc}
     */
    public function extensions(): array {
        return require __DIR__ . '/extensions.php';
    }


    /**
     * {@inheritDoc}
     */
    public function run( ContainerInterface $c ): bool {
        return true;
    }
}
