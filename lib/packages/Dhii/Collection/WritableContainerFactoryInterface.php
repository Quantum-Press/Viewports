<?php

declare(strict_types=1);

namespace QP\Viewports\Vendor\Dhii\Collection;

use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

/**
 * A map that can create a writable container.
 */
interface WritableContainerFactoryInterface extends ContainerFactoryInterface
{
    /**
     * @inheritDoc
     *
     * @return WritableContainerInterface The new container.
     */
    public function createContainerFromArray(array $data): ContainerInterface;
}
