<?php

declare( strict_types=1 );

/**
 * @wordpress-plugin
 *
 * Plugin Name: Quantum Viewports
 * Description: Extend your BlockTheme to make standard block styles responsive!
 * Version:     0.9.11-dev
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

// Global variables, as few as possible
define( 'QUANTUM_VIEWPORTS_VERSION',    '0.9.11-dev' );
define( 'QUANTUM_VIEWPORTS_FILE',       ( __FILE__ ) );
define( 'QUANTUM_VIEWPORTS_URL',        untrailingslashit( plugin_dir_url( QUANTUM_VIEWPORTS_FILE ) ) );
define( 'QUANTUM_VIEWPORTS_PATH',       untrailingslashit( plugin_dir_path( QUANTUM_VIEWPORTS_FILE ) ) );
define( 'QUANTUM_VIEWPORTS_BASENAME',   plugin_basename( QUANTUM_VIEWPORTS_FILE ) );
define( 'QUANTUM_VIEWPORTS_TEXTDOMAIN', 'quantum-viewports' );

( function () {
    $autoload_filepath = __DIR__ . '/vendor/autoload.php';
    if ( file_exists( $autoload_filepath ) && ! class_exists( '\QP\Viewports\PluginModule' ) ) {
        require $autoload_filepath;
    }

    /**
     * Initialize the plugin and its modules.
     */
    function init(): void {
        $root_dir = __DIR__;

        static $initialized;
        if( ! $initialized ) {
            $bootstrap = require "$root_dir/bootstrap/bootstrap.php";

            $app_container = $bootstrap( $root_dir );

            QP\Viewports\VP::init( $app_container );

            $initialized = true;

            /**
             * The hook fired after the plugin bootstrap with the app services container as parameter.
             */
            do_action( 'quantum_viewports_init', $app_container );
        }
    }

    add_action( 'plugins_loaded', function () {
        init();

        add_action( 'init', function () {
            $current_plugin_version = (string) QP\Viewports\VP::container()->get( 'vp.plugin' )->getVersion();
            $installed_plugin_version = get_option( 'quantum-viewports-version' );

            if ( $installed_plugin_version !== $current_plugin_version ) {
                /**
                 * The hook fired when the plugin is installed or updated.
                 */
                do_action( 'quantum_viewports_migrate', $installed_plugin_version );

                if ( $installed_plugin_version ) {
                    /**
                     * The hook fired when the plugin is updated.
                     */
                    do_action( 'quantum_viewports_migrate_on_update' );
                }
                update_option( 'quantum-viewports-version', $current_plugin_version );
            }
        }, -1 );
    } );
} )();