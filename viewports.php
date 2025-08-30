<?php

/**
 * @wordpress-plugin
 *
 * Plugin Name: Viewports
 * Description: Extends the BlockEditor with responsive controls.
 * Version:     0.9.5-dev
 * Text Domain: viewports
 * Domain Path: /languages
 *
 * Author:      conversionmedia GmbH & Co. KG
 * Author URI:  https://www.conversionmedia.de
 *
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * Concept & Development by Sebastian Buchwald - 0verscore
 * URI: https://profiles.wordpress.org/0verscore/
 */

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

use \QP\Viewports\Plugin;
use \QP\Viewports\Tool\Activator;
use \QP\Viewports\Tool\Deactivator;
use \QP\Viewports\Tool\Uninstaller;

// Global variables, as few as possible
define( 'VIEWPORTS_VERSION',    '0.9.5-dev' );
define( 'VIEWPORTS_FILE',       ( __FILE__ ) );
define( 'VIEWPORTS_URL',        untrailingslashit( plugin_dir_url( VIEWPORTS_FILE ) ) );
define( 'VIEWPORTS_PATH',       untrailingslashit( plugin_dir_path( VIEWPORTS_FILE ) ) );
define( 'VIEWPORTS_BASENAME',   plugin_basename( VIEWPORTS_FILE ) );
define( 'VIEWPORTS_TEXTDOMAIN', 'viewports' );

// Maybe include composer autoloading.
$autoloader                   = VIEWPORTS_PATH . '/vendor/autoload.php';
$autoloader_exists            = file_exists( $autoloader );
$autoloading_via_main_package = class_exists( '\QP\Viewports\Plugin' );

if ( $autoloader_exists ) {
	require_once $autoloader;
} else if ( ! $autoloading_via_main_package ) {
	wp_die( 'Autoloading failed!' );
}

// Activation hook.
\register_activation_hook( VIEWPORTS_FILE, [ Activator::class, 'init' ] );

// Deactivation hook.
\register_deactivation_hook( VIEWPORTS_FILE, [ Deactivator::class, 'init' ] );

// Uninstall hook.
\register_uninstall_hook( VIEWPORTS_FILE, [ Uninstaller::class, 'init' ] );

// Wrapper for main class.
function viewports() {
	return Plugin::getInstance();
}

// Start plugin execution.
\add_action( 'plugins_loaded', 'viewports' );
