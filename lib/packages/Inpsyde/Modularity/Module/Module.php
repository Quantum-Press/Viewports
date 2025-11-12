<?php

declare(strict_types=1);

namespace QP\Viewports\Vendor\Inpsyde\Modularity\Module;

/**
 * @package QP\Viewports\Vendor\Inpsyde\Modularity\Module
 */
interface Module
{
    /**
     * Unique identifier for your Module.
     *
     * @return string
     */
    public function id(): string;
}
