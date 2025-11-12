<?php

declare(strict_types=1);

namespace QP\Viewports\Vendor\Dhii\Collection;

use QP\Viewports\Vendor\Psr\Container\ContainerInterface as BaseContainerInterface;

/**
 * Something that can retrieve and determine the existence of a value by key.
 */
interface ContainerInterface extends
    HasCapableInterface,
    BaseContainerInterface
{
}
