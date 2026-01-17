<?php

declare( strict_types=1 );

namespace QP\Viewports\Styles;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

return static function (): StylesModule {
    return new StylesModule();
};