<?php

namespace QP\Viewports\Styles;

use QP\Viewports\Vendor\Psr\Container\ContainerInterface;

use QP\Viewports\Styles\Services\Processor;
use QP\Viewports\Styles\Services\Parser;

return [
    'vp.styles.processor' => static function ( ContainerInterface $container ): Processor {
        return new Processor();
    },
    'vp.styles.parser' => static function ( ContainerInterface $container ): Parser {
        return new Parser();
    },
];