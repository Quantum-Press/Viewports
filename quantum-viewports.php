<?php

declare( strict_types=1 );

/**
 * @wordpress-plugin
 *
 * Plugin Name: Quantum Viewports
 * Description: Extend your BlockTheme to make standard block styles responsive!
 * Version:     0.9.9
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

use \QP\Viewports\Plugin;

// Global variables, as few as possible
define( 'QUANTUM_VIEWPORTS_VERSION',    '0.9.9' );
define( 'QUANTUM_VIEWPORTS_FILE',       ( __FILE__ ) );
define( 'QUANTUM_VIEWPORTS_URL',        untrailingslashit( plugin_dir_url( QUANTUM_VIEWPORTS_FILE ) ) );
define( 'QUANTUM_VIEWPORTS_PATH',       untrailingslashit( plugin_dir_path( QUANTUM_VIEWPORTS_FILE ) ) );
define( 'QUANTUM_VIEWPORTS_BASENAME',   plugin_basename( QUANTUM_VIEWPORTS_FILE ) );
define( 'QUANTUM_VIEWPORTS_TEXTDOMAIN', 'quantum-viewports' );

// Maybe include composer autoloading.
$autoloader                   = QUANTUM_VIEWPORTS_PATH . '/vendor/autoload.php';
$autoloaderExists            = file_exists( $autoloader );
$autoloadingViaMainPackage = class_exists( '\QP\Viewports\Plugin' );

if ( ! $autoloaderExists ) {
    if ( ! $autoloadingViaMainPackage ) {
        wp_die( 'Autoloading failed!' );
    }

    require_once $autoloader;
}

// Wrapper for main class.
function quantum_viewports() : bool|object
{
    return Plugin::instance();
}

// Start plugin execution.
\add_action( 'plugins_loaded', 'quantum_viewports' );
