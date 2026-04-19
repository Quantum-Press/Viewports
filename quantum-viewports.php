<?php

declare( strict_types=1 );

/**
 * @wordpress-plugin
 *
 * Plugin Name: Quantum Viewports
 * Description: Extend your BlockTheme to make standard block styles responsive!
 * Version:     0.9.12
 * Text Domain: quantum-viewports
 * Domain Path: /languages
 *
 * Author:      Quantum-Press
 * Author URI:  https://quantum-press.com/en/
 *
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * Concept & Development by Sebastian Buchwald
 * URI: https://profiles.wordpress.org/0verscore/
 */

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

( static function(): void {
    $autoloadFilePath = __DIR__ . '/vendor/autoload.php';
    if ( file_exists( $autoloadFilePath ) && ! class_exists( '\QP\Viewports\PluginModule' ) ) {
        require $autoloadFilePath;
    }

    /**
     * Initialize the plugin and its modules.
     */
    $pluginInit = static function (): void
    {
        static $initialized;

        if ( ! $initialized) {
            $rootDir = __DIR__;
            $bootstrap = require "$rootDir/bootstrap/bootstrap.php";
            $appContainer = $bootstrap( $rootDir );

            QP\Viewports\VPP::init( $appContainer );
            $initialized = true;

            do_action( 'quantum_viewports_init', $appContainer );
        }
    };

    add_action( 'plugins_loaded', static function() use ( $pluginInit )
    {
        $pluginInit();

        add_action( 'init', static function () : void
        {
            $container = QP\Viewports\VPP::container();
            $currentVersion = (string) $container->get( 'vp.version' );
            $installedVersion = get_option( 'quantum-viewports-version' );

            if ( $installedVersion !== $currentVersion ) {
                /**
                 * The hook fired when the plugin is installed or updated.
                 */
                do_action( 'quantum_viewports_migrate', $installedVersion );

                if ( $installedVersion ) {
                    /**
                     * The hook fired when the plugin is updated.
                     */
                    do_action( 'quantum_viewports_migrate_on_update' );
                }
                update_option( 'quantum-viewports-version', $currentVersion );
            }
        }, -1 );
    } );
} )();