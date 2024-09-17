<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * CSS_Renderer class.
 *
 * This class handles block css rendering.
 *
 * @class    Quantum\Viewports\CSS_Renderer
 * @since    0.2.15
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class CSS_Renderer extends Instance {

	/**
	 * Property contains the instance of HTML_Tag_Processor.
	 *
	 * @var null | \WP_HTML_Tag_Processor $html_processed
	 *
	 * @since 0.2.15
	 */
	protected $html_processed = null;

	/**
	 * Method to construct.
	 *
	 * @since 0.2.15
	 */
	protected function __construct()
	{
		$this->set_hooks();
	}


	/**
	 * Method to set hooks.
	 *
	 * @since 0.2.15
	 */
	protected function set_hooks()
	{
		\add_filter( 'render_block', [ $this, 'render_block' ], 20, 2 );
		\add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_block_styles' ], 20 );
	}


	/**
	 * Method to filter all render_block calls to render its css.
	 *
	 * @param string $block_html
	 * @param array $block
	 *
	 * @since 0.2.15
	 *
	 * @return string
	 */
	public function render_block( $block_html, $block ) : string
	{
		// Set style css sources.
		$inline_styles = isset( $block[ 'attrs' ][ 'inlineStyles' ] ) ? $block[ 'attrs' ][ 'inlineStyles' ] : [];

		// Check if there is some css to render.
		if( empty( $inline_styles ) ) {
			return $block_html;
		}

		// Set html_processed from block_html and skip to first tag.
		$this->html_processed = new \WP_HTML_Tag_Processor( $block_html );
		$this->html_processed->next_tag();

		// Set viewport styles to check if we need to change block_html and register css.
		$viewport_stylesets = $this->get_viewport_stylesets( $block_html, $inline_styles );
		if( empty( $viewport_stylesets ) ) {
			return $block_html;
		}

		// Set selector by using incrementing unique_id.
		$class_name = \wp_unique_id( 'qp-viewports-' );
		$selector = 'body .wp-site-blocks .' . $class_name;

		// Iterate over viewport styles to register css.
		foreach( $viewport_stylesets as $styleset ) {

			// Set selector and css together.
			$css_rule = sprintf(
				'%s{ %s }',
				str_replace( '%', $selector, $styleset[ 'selector' ] ),
				CSS_Parser::stringify( $styleset[ 'css' ] ),
			);

			// Set from and to.
			$from = $styleset[ 'from' ];
			$to = $styleset[ 'to' ];

			// Set media query with min-width and max-width.
			if( $from > 0 && -1 !== $to ) {
				$media_css = sprintf(
					'@media (min-width: %spx) and (max-width: %spx) { %s }',
					$from,
					$to,
					$css_rule
				);
			}

			// Set media query with min-width.
			if( $from > 0 && -1 === $to ) {
				$media_css = sprintf(
					'@media (min-width: %spx) { %s }',
					$from,
					$css_rule
				);
			}

			// Set media query with max-width.
			if( $from === 0 && 0 < $to ) {
				$media_css = sprintf(
					'@media (max-width: %spx) { %s }',
					$to,
					$css_rule
				);
			}

			// Set without media query as default fallback.
			if( $from === 0 && -1 === $to ) {
				$media_css = $css_rule;
			}

			$this->register_css( $media_css );
		}

		// Update block_html by removing style attribute and adding class to link via <style>.
		$this->html_processed->remove_attribute( 'style' );
		$this->html_processed->add_class( $class_name );

		// Set block_html for return.
		$block_html = (string) $this->html_processed;

		// Reset html_processed.
		$this->html_processed = null;

		return (string) $block_html;
	}


	/**
	 * Method to return viewport stylesets from inline_styles and block_html.
	 *
	 * @param string $block_html
	 * @param array $inline_styles
	 *
	 * @since 0.2.15
	 *
	 * @return array containing viewport based style declarations
	 */
	protected function get_viewport_stylesets( $block_html, $inline_styles ) : array
	{
		// Set empty viewport styles container.
		$viewport_styles = [];

		// Set styles from html on viewport = 0 if we got some.
		$html_inline_css = $this->get_inline_css_from_html();
		if( ! empty( $html_inline_css ) ) {
			$viewport_styles[ 0 ] = [
				'from' => 0,
				'to' => -1,
				'css' => $html_inline_css,
			];
		}


		$attribute_inline_css = $this->get_inline_css_from_attribute( $inline_styles );
		if( ! empty( $attribute_inline_css ) ) {
			$viewport_styles = CSS_Parser::deep_merge( $viewport_styles, $attribute_inline_css );
		}

		return $viewport_styles;
	}


	/**
	 * Method to return inline css from block html.
	 *
	 * @since 0.2.15
	 *
	 * @return array containing css key value pairs
	 */
	protected function get_inline_css_from_html() : array
	{
		// Set html inline_style from block html.
		$html_inline_css = $this->html_processed->get_attribute( 'style' );
		if( empty( $html_inline_css ) ) {
			return [];
		}

		return CSS_Parser::parse( $html_inline_css );
	}


	/**
	 * Method to return inline css from attribute inlineStyles.
	 *
	 * @param array $inline_styles
	 *
	 * @since 0.2.15
	 *
	 * @return array containing css key value pairs by viewport
	 */
	protected function get_inline_css_from_attribute( $inline_styles ) : array
	{
		// Set empty viewport styles container.
		$viewport_styles = [];

		// Iterate over inline_styles to collect its css by key value.
		foreach( $inline_styles as $viewport => $properties ) {
			if( empty( $properties ) ) {
				continue;
			}

			foreach( $properties as $styles ) {
				foreach( $styles as $style ) {
					if( isset( $style[ 'css' ] ) && ! empty( $style[ 'css' ] ) ) {
						$parsed_css = CSS_Parser::parse( $style[ 'css' ] );
						$selector = CSS_Parser::get_selector( $style[ 'css' ] );

						// Check if we ned to add a viewport style.
						if( ! empty( $parsed_css ) ) {
							$viewport_styles[ (int) $viewport ] = [
								'from' => $viewport,
								'to' => isset( $style[ 'to' ] ) ? (int) $style[ 'to' ] : -1,
								'css' => $parsed_css,
								'selector' => $selector,
							];
						}
					}
				}
			}
		}

		return $viewport_styles;
	}


	/**
	 * Method to register css.
	 *
	 * @param string $css
	 *
	 * @since 0.2.15
	 */
	protected function register_css( $css )
	{
		global $qp_viewports_styles;

		$qp_viewports_styles .= $css;
	}


	/**
	 * Method to enqueue styles registered before.
	 *
	 * @since 0.2.15
	 */
	public function enqueue_block_styles()
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