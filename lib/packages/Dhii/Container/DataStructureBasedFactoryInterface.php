<?php

declare(strict_types=1);

namespace QP\Viewports\Vendor\Dhii\Container;

use QP\Viewports\Vendor\Dhii\Collection\WritableMapFactoryInterface;
use QP\Viewports\Vendor\Dhii\Collection\WritableMapInterface;
use Exception;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface as BaseContainerInterface;

/**
 * Creates a container hierarchy based on a traditional data structure.
 */
interface DataStructureBasedFactoryInterface extends WritableMapFactoryInterface
{
    /**
     * Based on a traditional data structure, creates a container hierarchy.
     *
     * @param mixed[] $structure The traditional data structure representation.
     *
     * @return WritableMapInterface A hierarchy of writable maps that reflects the data structure.
     *
     * @throws Exception If problem creating.
     */
    public function createContainerFromArray(array $structure): BaseContainerInterface;
}
