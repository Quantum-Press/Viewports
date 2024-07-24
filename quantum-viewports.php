<?php

/**
 * @wordpress-plugin
 *
 * Plugin Name: Quantum Viewports
 * Description: Extends the Gutenberg Editor with full responsive mobile first support.
 * Version:     0.2.10
 * Text Domain: quantum-viewports
 * Domain Path: /languages
 *
 * Author:      conversionmedia GmbH & Co. KG
 * Author URI:  https://www.conversionmedia.de
 * License:     non-public
 *
 * Concept & Development by Sebastian Buchwald - 0verscore
 * URI: https://profiles.wordpress.org/0verscore/
 */

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

use \Quantum\Viewports\Plugin;
use \Quantum\Viewports\Tool\Activator;
use \Quantum\Viewports\Tool\Deactivator;
use \Quantum\Viewports\Tool\Uninstaller;

// Global variables, as few as possible
define( 'QUANTUM_VIEWPORTS_VERSION',    '0.2.10' );
define( 'QUANTUM_VIEWPORTS_FILE',       ( __FILE__ ) );
define( 'QUANTUM_VIEWPORTS_URL',        untrailingslashit( plugin_dir_url( QUANTUM_VIEWPORTS_FILE ) ) );
define( 'QUANTUM_VIEWPORTS_PATH',       untrailingslashit( plugin_dir_path( QUANTUM_VIEWPORTS_FILE ) ) );
define( 'QUANTUM_VIEWPORTS_BASENAME',   plugin_basename( QUANTUM_VIEWPORTS_FILE ) );
define( 'QUANTUM_VIEWPORTS_TEXTDOMAIN', 'quantum-viewports' );

// Maybe include composer autoloading.
$autoloader                   = QUANTUM_VIEWPORTS_PATH . '/vendor/autoload.php';
$autoloader_exists            = file_exists( $autoloader );
$autoloading_via_main_package = class_exists( '\Quantum\Viewports\Plugin' );

if ( $autoloader_exists ) {
	require_once $autoloader;
} else if ( ! $autoloading_via_main_package ) {
	wp_die( 'Autoloading failed!' );
}

// Activation hook.
\register_activation_hook( QUANTUM_VIEWPORTS_FILE, [ Activator::class, 'init' ] );

// Deactivation hook.
\register_deactivation_hook( QUANTUM_VIEWPORTS_FILE, [ Deactivator::class, 'init' ] );

// Uninstall hook.
\register_uninstall_hook( QUANTUM_VIEWPORTS_FILE, [ Uninstaller::class, 'init' ] );

// Wrapper for main class.
function quantum_viewports() {
	return Plugin::get_instance();
}

// Start plugin execution.
\add_action( 'plugins_loaded', 'quantum_viewports' );
