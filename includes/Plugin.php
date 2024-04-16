<?php

namespace Quantum\Viewports;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

use Quantum\Viewports\Controller\Instance;

/**
 * Viewports Plugin class.
 *
 * This class registers assets and extend block styles.
 *
 * @class    Quantum\Viewports\Plugin
 * @since    0.1.0
 * @version  0.1.9
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Plugin extends Instance {

	/**
	 * Method to construct.
	 *
	 * @since 0.1.0
	 */
	protected function __construct() {
		$this->set_register();
		$this->set_hooks();
	}



	/**
	 * Method to set register viewports.
	 *
	 * @since 0.1.0
	 */
	protected function set_register() {
		\WP_Block_Supports::get_instance()->register(
			'viewports',
			array(
				'register_attribute' => array( $this, 'register_attribute' ),
			)
		);
	}



	/**
	 * Method to register support to viewport attributes.
	 *
	 * @param object (required) $block_type containing base config
	 *
	 * @since 0.1.0
	 *
	 * @return object containing filtered block_type
	 */
	public function register_attribute( $block_type ) {
		if ( ! $block_type->attributes ) {
			$block_type->attributes = array();
		}

		if ( ! array_key_exists( 'viewports', $block_type->attributes ) ) {
			$block_type->attributes[ 'viewports' ] = array(
				'type' => 'object',
			);
		}

		if ( ! array_key_exists( 'inlineStyles', $block_type->attributes ) ) {
			$block_type->attributes[ 'inlineStyles' ] = array(
				'type' => 'object',
			);
		}

		return $block_type;
	}



	/**
	 * Method to set hooks.
	 *
	 * @since 0.1.0
	 */
	protected function set_hooks() {
		\add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		\add_filter( 'render_block', array( $this, 'render_block' ), 20, 2 );
		\add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_style' ), 20 );
	}



	/**
	 * Method to enqueue block editor assets.
	 *
	 * @since 0.1.0
	 */
	public function enqueue_block_editor_assets() {
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
	 * @version 0.1.2
	 *
	 * @return string Filtered block content.
	 */
	public function render_block( $block_content, $block ) {
		$class_name = \wp_unique_id( 'qp-viewports-' );
		$selector   = 'body .wp-site-blocks .' . $class_name;
		$options    = array( 'selector' => $selector );
		$content    = new \WP_HTML_Tag_Processor( $block_content );

		// Setup flag.
		$has_styles = false;

		// Skip to next tag and remove its inline styles.
		$content->next_tag();
		$content->remove_attribute( 'style' );

		if ( isset( $block[ 'attrs' ][ 'style' ] ) && ! empty( $block[ 'attrs' ][ 'style' ] ) ) {
			$block_styles = $block[ 'attrs' ][ 'style' ];

			$style_rule = \wp_style_engine_get_styles( $block_styles, $options );

			if ( ! empty( $style_rule ) && isset( $style_rule[ 'css' ] ) ) {
				$this->register_css( $style_rule[ 'css' ] );
				$has_styles = true;
			}
		}

		if ( isset( $block[ 'attrs' ][ 'viewports' ] ) ) {
			$viewports     = $block[ 'attrs' ][ 'viewports' ];
			$viewports_css = $this->get_rendered_css( $selector, $viewports );

			if ( ! empty( $viewports_css ) ) {
				$this->register_css( $viewports_css );
				$has_styles = true;
			}
		}

		if ( isset( $block[ 'attrs' ][ 'inlineStyles' ] ) ) {
			$inline_css = $this->get_rendered_inline_css( $selector, $block[ 'attrs' ][ 'inlineStyles' ] );

			if ( ! empty( $inline_css ) ) {
				$this->register_css( $inline_css );
				$has_styles = true;
			}
		}

		if ( $has_styles ) {
			$content->add_class( $class_name );
		}

		return (string) $content;
	}



	/**
	 * Method to render viewports css.
	 *
	 * @param string (required) $selector
	 * @param array  (required) $viewports Pairs viewport to css
	 *
	 * @since 0.1.0
	 *
	 * @return string containing css
	 */
	protected function get_rendered_css( $selector, $viewports ) {
		$styles = array();

		foreach ( $viewports as $viewport => $attributes ) {
			if ( ! isset( $attributes['style'] ) ) {
				continue;
			}

			$temp = \wp_style_engine_get_styles( $attributes[ 'style' ], array( 'selector' => $selector ) );

			if ( ! empty( $temp ) ) {
				$styles[ $viewport ] = $temp;
			}
		}

		if ( empty( $styles ) ) {
			return false;
		}

		$css = '';

		foreach ( $styles as $viewport => $rules ) {
			$css .= sprintf( '@media (min-width: %spx){%s}', $viewport, $rules[ 'css' ] );
		}

		return $css;
	}



	/**
	 * Method to return rendered inline viewports css.
	 *
	 * @param string (required) $selector
	 * @param array  (required) $viewports Pairs viewport to css
	 *
	 * @since   0.1.0
	 * @version 0.1.6
	 *
	 * @return string containing css
	 */
	protected function get_rendered_inline_css( $selector, $viewports ) {
		$css = '';

		foreach ( $viewports as $viewport => $attributes ) {
			if ( 0 < (int) $viewport ) {
				foreach ( $attributes as $rules ) {
					foreach ( $rules as $rule ) {
						if ( ! empty( $rule['css'] ) ) {

							// Check if we have a leading wildcard.
							if( 0 === strpos( $rule['css'], '%' ) ) {

								// Split css_rules by selectors.
								$css_rules = preg_split('/(?=%[>])/', $rule['css'], -1, PREG_SPLIT_NO_EMPTY );

								// Parse them to css.
								foreach ( $css_rules as $css_rule ) {
									$search = '/' . preg_quote( '%', '/' ) . '/';
    								$css .= sprintf( '@media (min-width: %spx) { %s }', $viewport, preg_replace( $search, $selector, $css_rule, 1 ) );
								}

							// Check if we have static css.
							} else {
								$css .= sprintf( '@media (min-width: %spx) { %s { %s } }', $viewport, $selector, $rule['css'] );
							}
						}
					}
				}
			} else {
				foreach ( $attributes as $rules ) {
					foreach ( $rules as $rule ) {
						if ( ! empty( $rule['css'] ) ) {

							// Check if we have a leading wildcard.
							if( 0 === strpos( $rule['css'], '%' ) ) {

								// Split css_rules by selectors.
								$css_rules = preg_split('/(?=%[>])/', $rule['css'], -1, PREG_SPLIT_NO_EMPTY );

								// Parse them to css.
								foreach ( $css_rules as $css_rule ) {
									$search = '/' . preg_quote( '%', '/' ) . '/';
    								$css .= preg_replace( $search, $selector, $css_rule, 1 );
								}

							// Check if we have static css.
							} else {
								$css .= sprintf( '%s { %s }',  $selector, $rule['css'] );
							}
						}
					}
				}
			}
		}

		return $css;
	}



	/**
	 * Method to register css.
	 *
	 * @since 0.1.0
	 */
	protected function register_css( $css ) {
		global $qp_viewports_styles;

		$qp_viewports_styles .= $css;
	}



	/**
	 * Method to register style.
	 *
	 * @since 0.1.0
	 */
	public function enqueue_style() {
		global $qp_viewports_styles;

		if ( empty( $qp_viewports_styles ) ) {
			return;
		}

		\wp_register_style( 'qp-block-supports-inline-css', false );
		\wp_add_inline_style( 'qp-block-supports-inline-css', $qp_viewports_styles );
		\wp_enqueue_style( 'qp-block-supports-inline-css' );
	}
}
