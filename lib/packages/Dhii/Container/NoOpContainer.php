<?php

declare(strict_types=1);

namespace QP\Viewports\Vendor\Dhii\Container;

use ArrayIterator;
use QP\Viewports\Vendor\Dhii\Collection\ClearableContainerInterface;
use QP\Viewports\Vendor\Dhii\Collection\MutableContainerInterface;
use QP\Viewports\Vendor\Dhii\Collection\WritableContainerInterface;
use QP\Viewports\Vendor\Dhii\Collection\WritableMapInterface;
use QP\Viewports\Vendor\Dhii\Container\Exception\ContainerException;
use QP\Viewports\Vendor\Dhii\Container\Exception\NotFoundException;
use IteratorAggregate;
use Traversable;

/**
 * A container that does nothing.
 *
 * This can be used if an actual implementation is not available,
 * without extra checks or nullables - just as if it was a real one.
 */
class NoOpContainer implements
    MutableContainerInterface,
    IteratorAggregate,
    WritableMapInterface,
    ClearableContainerInterface
{
    /**
     * @inheritDoc
     */
    public function get($id)
    {
        throw new NotFoundException('NoOp container cannot have values');
    }

    /**
     * @inheritDoc
     */
    public function has($id)
    {
        return false;
    }

    /**
     * @inheritDoc
     */
    public function set(string $key, $value): void
    {
        // Do nothing
    }

    /**
     * @inheritDoc
     */
    public function unset(string $key): void
    {
        throw new ContainerException('NoOp container cannot have values');
    }

    /**
     * @inheritDoc
     */
    public function clear(): void
    {
        // Do nothing
    }

    /**
     * @inheritDoc
     */
    public function withMappings(array $mappings): WritableContainerInterface
    {
        return clone $this;
    }

    /**
     * @inheritDoc
     */
    public function withAddedMappings(array $mappings): WritableContainerInterface
    {
        return clone $this;
    }

    /**
     * @inheritDoc
     */
    public function withoutKeys(array $keys): WritableContainerInterface
    {
        return clone $this;
    }

    /**
     * @inheritDoc
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator([]);
    }
}
