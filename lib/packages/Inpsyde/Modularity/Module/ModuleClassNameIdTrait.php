<?php

declare(strict_types=1);

namespace QP\Viewports\Vendor\Inpsyde\Modularity\Module;

trait ModuleClassNameIdTrait
{
    /**
     * @return string
     *
     * @see Module::id()
     */
    public function id(): string
    {
        return __CLASS__;
    }
}
