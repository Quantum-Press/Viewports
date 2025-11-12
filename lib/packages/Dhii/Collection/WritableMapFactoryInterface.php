<?php

declare(strict_types=1);

namespace QP\Viewports\Vendor\Dhii\Collection;

use QP\Viewports\Vendor\Psr\Container\ContainerInterface as BaseContainerInterface;

/**
 * Creates writable maps.
 *
 * @psalm-suppress UnusedClass
 */
interface WritableMapFactoryInterface extends WritableContainerFactoryInterface, MapFactoryInterface
{
    /**
     * @inheritDoc
     *
     * @return WritableMapInterface The new map.
     */
    public function createContainerFromArray(array $data): BaseContainerInterface;
}
