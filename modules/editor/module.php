<?php

declare( strict_types=1 );

namespace QP\Viewports\Editor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

return static function (): EditorModule {
    return new EditorModule();
};