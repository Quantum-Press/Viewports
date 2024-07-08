<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * Blocks class.
 *
 * This class handles block style rendering.
 *
 * @class    Quantum\Viewports\Blocks
 * @since    0.2.8
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Blocks extends Instance {

	/**
	 * Method to construct.
	 *
	 * @since 0.1.0
	 */
	protected function __construct()
	{
		$this->set_hooks();
	}


	/**
	 * Method to set hooks.
	 *
	 * @since 0.1.0
	 * @version 0.2.8
	 */
	protected function set_hooks()
	{
		\add_filter( 'register_block_type_args', [ $this, 'register_block_type_args' ], 10, 2 );
		\add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );
		\add_filter( 'render_block', [ $this, 'render_block' ], 20, 2 );
		\add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_style' ], 20 );

		// Allow additional CSS properties.
		\add_filter( 'safe_style_css', function( $styles ) {
			$styles[] = 'display';
			$styles[] = 'background-repeat';

			return $styles;
		} );
	}


	/**
	 * Method to register viewports support to all block attributes.
	 *
	 * @param object (required) $block_type containing base config
	 *
	 * @since 0.2.8
	 *
	 * @return object containing filtered block_type
	 */
	public function register_block_type_args( $args, $block_type )
	{
		if ( ! isset( $args[ 'attributes' ][ 'viewports' ] ) ) {
			$args[ 'attributes' ][ 'viewports' ] = [
				'type' => 'object',
			];
		}

		if ( ! isset( $args[ 'attributes' ][ 'inlineStyles' ] ) ) {
			$args[ 'attributes' ][ 'inlineStyles' ] = [
				'type' => 'object',
			];
		}

		if ( ! isset( $args[ 'attributes' ][ 'tempId' ] ) ) {
			$args[ 'attributes' ][ 'tempId' ] = [
				'type' => 'string',
			];
		}

		return $args;
	}


	/**
	 * Method to enqueue block editor assets.
	 *
	 * @since 0.1.0
	 */
	public function enqueue_block_editor_assets()
	{
		\wp_register_script(
			'qp-viewports-scripts',
			sprintf( '%s/build/qp-viewports.js', QUANTUM_VIEWPORTS_URL ),
			[ 'wp-blocks', 'wp-edit-post', 'wp-element', 'wp-i18n', 'lodash' ],
			QUANTUM_VIEWPORTS_VERSION
		);
		\wp_enqueue_script( 'qp-viewports-scripts' );

		\wp_enqueue_style(
			'qp-viewports-styles',
			sprintf( '%s/build/qp-viewports.js', QUANTUM_VIEWPORTS_URL ),
			[],
			QUANTUM_VIEWPORTS_VERSION
		);
	}


	/**
	 * Method to filter all render_block calls to add viewport styles.
	 *
	 * @param  string (required) $block_content Rendered block content.
	 * @param  array  (required) $block         Block object.
	 *
	 * @since 0.1.0
	 * @version 0.2.5
	 *
	 * @return string Filtered block content.
	 */
	public function render_block( $block_content, $block )
	{

		// Set indicators.
		$has_inline_styles = isset( $block[ 'attrs' ][ 'inlineStyles' ] );
		$has_styles = false;

		// Check if we inline styles.
		if( ! $has_inline_styles ) {
			return $block_content;
		}

		// Setup block.
		$class_name = \wp_unique_id( 'qp-viewports-' );
		$selector = 'body .wp-site-blocks .' . $class_name;
		$content = new \WP_HTML_Tag_Processor( $block_content );

		// Skip to next tag and remove its inline styles.
		$content->next_tag();

		// Try to get native inlineStyles generated from other sources.
		$native_style = $content->get_attribute( 'style' );

		// Check if block has inlineStyles attribute.
		if ( $has_inline_styles ) {
			$inline_css = $this->get_rendered_inline_css( $selector, $block[ 'attrs' ][ 'inlineStyles' ], $native_style );

			if ( ! empty( $inline_css ) ) {
				$this->register_css( $inline_css );
				$has_styles = true;
			}
		}

		if ( $has_styles ) {
			$content->remove_attribute( 'style' );
			$content->add_class( $class_name );
		}

		return (string) $content;
	}


	/**
	 * Method to return rendered inline viewports css.
	 *
	 * @param string (required) $selector
	 * @param array  (required) $inline_styles pairs viewport to css
	 * @param string (required) $native_style
	 *
	 * @since 0.1.0
	 * @version 0.2.8
	 *
	 * @return string containing css
	 */
	protected function get_rendered_inline_css( $selector, $inline_styles, $native_style )
	{
		$inline_css = '';

		if( ! empty( $native_style ) ) {
			$inline_css .= sprintf( '%s { %s }', $selector, $native_style );
		}

		foreach ( $inline_styles as $viewport => $attributes ) {
			foreach ( $attributes as $rules ) {
				foreach ( $rules as $rule ) {

					// Reset css.
					$css = [];

					// Check if there is css.
					if ( ! empty( $rule[ 'css' ] ) ) {

						// Set state.
						$from = isset( $rule[ 'from' ] ) ? (int) $rule[ 'from' ] : (int) $viewport;
						$to = isset( $rule[ 'to' ] ) ? (int) $rule[ 'to' ] : -1;

						// Check if we have a leading wildcard.
						if( 0 === strpos( $rule[ 'css' ], '%' ) ) {

							// Split css_rules by selectors.
							$css_rules = preg_split( '/(?=%[>])/', $rule[ 'css' ], -1, PREG_SPLIT_NO_EMPTY );
							$css_rules = $this->maybe_add_native_css( $css_rules, $native_style );

							// Parse them to css.
							foreach ( $css_rules as $css_rule ) {
								$search = '/' . preg_quote( '%', '/' ) . '/';
								$result = preg_replace( $search, $selector, $css_rule, 1 );
								$css[] = $result;
							}

						// Else set plain css with fresh selector.
						} else {
							$css[] = sprintf( '%s { %s }', $selector, $rule[ 'css' ] );
						}

						// Set joined css and set media css.
						$css = implode( '', $css );
						$media_css = '';

						// Set min and max.
						if( $from > 0 && -1 !== $to ) {
							$media_css = sprintf( '@media (min-width: %spx) and (max-width: %spx) { %s }', $from, $to, $css );
						}

						// Set min.
						if( $from > 0 && -1 === $to ) {
							$media_css = sprintf( '@media (min-width: %spx) { %s }', $from, $css );
						}

						// Set max.
						if( $from === 0 && 0 < $to ) {
							$media_css = sprintf( '@media (max-width: %spx) { %s }', $to, $css );
						}

						// Set default.
						if( $from === 0 && -1 === $to ) {
							$media_css = $css;
						}

						// Append to inline_css.
						$inline_css .= $media_css;
					}
				}
			}
		}

		return $inline_css;
	}


	/**
	 * Method to maybe add native css to css_rules.
	 *
	 * @param array  $css_rules (required)
	 * @param string $native_style (required)
	 *
	 * @since 0.2.8
	 */
	protected function maybe_add_native_css( $css_rules, $native_style )
	{
		if ( empty( $css_rules ) || empty( $native_style ) ) {
			return $css_rules;
		}

		$native_declarations = $this->parse_css( $native_style );

		foreach ( $css_rules as $index => $css_rule ) {
			if ( false === strpos( $css_rule, '%{' ) ) {
				continue;
			}

			// Extract the CSS rule part within %{ ... }
			$css_rule_content = substr($css_rule, strpos($css_rule, '%{') + 2, strrpos($css_rule, '}') - strpos($css_rule, '%{') - 2);

			// Parse CSS declarations into associative arrays
			$css_declarations = $this->parse_css( $css_rule_content );
			$css_declarations = wp_parse_args( $css_declarations, $native_declarations );

			// Convert merged declarations back to a CSS string
			$merged_css_string = $this->stringify_css( $css_declarations );

			// Update the css_rule in the original array
			$css_rules[ $index ] = "%{" . $merged_css_string . "}";
			break;
		}

		return $css_rules;
	}


	/**
	 * Parse a CSS string into an associative array of declarations.
	 *
	 * @param string $css
	 *
	 * @since 0.2.8
	 *
	 * @return array
	 */
	private function parse_css( $css )
	{
		$declarations = explode( ';', $css );
		$css_array = [];

		foreach ( $declarations as $declaration ) {
			$parts = explode( ':', $declaration, 2 ); // Limit to 2 to handle values with colons
			if ( count( $parts ) == 2 ) {
				$property = trim( $parts[0] );
				$value = trim( $parts[1] );
				if( $property && '' !== $value ) {
					$css_array[$property] = $value;
				}
			}
		}

		return $css_array;
	}



	/**
	 * Convert an associative array of CSS declarations back to a CSS string.
	 *
	 * @param array $css_array
	 *
	 * @since 0.2.8
	 *
	 * @return string
	 */
	private function stringify_css( $css_array )
	{
		$css_string = '';
		foreach ( $css_array as $property => $value ) {
			$css_string .= $property . ': ' . $value . '; ';
		}
		return rtrim( $css_string, '; ' );
	}




	/**
	 * Method to register css.
	 *
	 * @since 0.1.0
	 */
	protected function register_css( $css )
	{
		global $qp_viewports_styles;

		$qp_viewports_styles .= $css;
	}



	/**
	 * Method to register style.
	 *
	 * @since 0.1.0
	 */
	public function enqueue_style()
	{
		global $qp_viewports_styles;

		if ( empty( $qp_viewports_styles ) ) {
			return;
		}

		\wp_register_style( 'qp-block-supports-inline-css', false );
		\wp_add_inline_style( 'qp-block-supports-inline-css', $qp_viewports_styles );
		\wp_enqueue_style( 'qp-block-supports-inline-css' );
	}
}