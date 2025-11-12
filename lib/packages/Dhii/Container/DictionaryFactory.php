<?php

declare(strict_types=1);

namespace QP\Viewports\Vendor\Dhii\Container;

use QP\Viewports\Vendor\Dhii\Collection\WritableMapFactoryInterface;
use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

/**
 * @inheritDoc
 */
class DictionaryFactory implements WritableMapFactoryInterface
{
    /**
     * @inheritDoc
     */
    public function createContainerFromArray(array $data): ContainerInterface
    {
        return new Dictionary($data);
    }
}
