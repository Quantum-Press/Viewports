<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * Template Save class.
 *
 * This class handles template save.
 *
 * @class    Quantum\Viewports\Template_Save
 * @since    0.2.15
 * @version  0.2.17
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Template_Save extends Instance {

	/**
	 * Property contains ignore properties list.
	 *
	 * @var array
	 *
	 * @since 0.2.15
	 */
	protected $ignore_properties = [];


	/**
	 * Property contains forbidden nested properties.
	 *
	 * @var array
	 *
	 * @since 0.2.17
	 */
	protected $ignore_nested_properties = [];


	/**
	 * Property contains nested_html blocks.
	 *
	 * @var array
	 *
	 * @since 0.2.17
	 */
	protected $nested_html_blocks = [];



	/**
	 * Method to construct.
	 *
	 * @since 0.2.15
	 */
	protected function __construct()
	{
		$this->set_ignore_properties();
		$this->set_nested_html_blocks();
		$this->set_hooks();
	}


	/**
	 * Method to set ignore_properties.
	 *
	 * @since 0.2.15
	 */
	protected function set_ignore_properties()
	{
		$this->ignore_properties = \apply_filters(
			'quantum_viewports_ignore_properties_inline',
			[
				'background'
			]
		);

		$this->ignore_nested_properties = \apply_filters(
			'quantum_viewports_ignore_nested_properties_inline',
			[
				'margin',
				'margin-top',
				'margin-right',
				'margin-bottom',
				'margin-left',
				'padding',
				'margin-top',
				'margin-right',
				'margin-bottom',
				'margin-left',
			]
		);
	}


	/**
	 * Method to set ignore_properties.
	 *
	 * @since 0.2.15
	 */
	protected function set_nested_html_blocks()
	{
		$this->nested_html_blocks = \apply_filters( 'quantum_viewports_nested_html_blocks', [ 'core/image' ] );
	}


	/**
	 * Method to set hooks.
	 *
	 * @since 0.2.15
	 */
	protected function set_hooks()
	{
		\add_filter( 'wp_insert_post_data', [ $this, 'wp_insert_post_data' ], 10, 2 );
	}


	/**
	 * Method to filter "wp_insert_post_data".
	 *
	 * @param array $data
	 * @param array $postarr
	 *
	 * @since 0.2.15
	 *
	 * @return array
	 */
	public function wp_insert_post_data( $data, $postarr ) : array
	{
		// Prepare blocks for modification.
		$blocks = \parse_blocks( \stripslashes( $postarr[ 'post_content' ] ) );

		$blocks_modified = $this->modify_blocks( $blocks );

		// Prepare modified blocks for saving.
		$data[ 'post_content' ] = addslashes( \serialize_blocks( $blocks_modified ) );
		return $data;
	}


	/**
	 * Method to modify given blocks.
	 *
	 * @param array $blocks
	 *
	 * @since 0.2.15
	 *
	 * @return array
	 */
	private function modify_blocks( $blocks ) : array
	{
		$modified = [];

		foreach( $blocks as $block ) {

			// Cleanup the tempId - it will only get used in React Runtime.
			if( isset( $block[ 'attrs' ][ 'tempId' ] ) ) {
				unset( $block[ 'attrs' ][ 'tempId' ] );
			}

			// Shift the default viewport=0 to style attribute. It can differ by viewport simulation.
			if( isset( $block[ 'attrs' ][ 'viewports' ][ 0 ][ 'style' ] ) ) {
				$block[ 'attrs' ][ 'style' ] = $block[ 'attrs' ][ 'viewports' ][ 0 ][ 'style' ];

				unset( $block[ 'attrs' ][ 'viewports' ][ 0 ][ 'style' ] );
				unset( $block[ 'attrs' ][ 'viewports' ][ 0 ] );
			}

			// Modify inline styles if there are styles.
			if( isset( $block[ 'attrs' ][ 'style' ] ) ) {
				$block = $this->modify_inline_styles( $block );
			}

			// Modify innerBlocks recursive.
			if( isset( $block[ 'innerBlocks' ] ) && ! empty( $block[ 'innerBlocks' ] ) ) {
				$block[ 'innerBlocks' ] = $this->modify_blocks( $block[ 'innerBlocks' ] );
			}

			// Set modified block.
			$modified[] = $block;
		}

		return $modified;
	}


	/**
	 * Method to return block with modified inline styles.
	 *
	 * @param array $block
	 *
	 * @since 0.2.15
	 *
	 * @return array
	 */
	public function modify_inline_styles( $block ) : array
	{
		// Set inner html processed.
		$inner_html_processed = new \WP_HTML_Tag_Processor( $block[ 'innerHTML' ] );
		$inner_html_processed->next_tag();

		// Jump over the first html element when its a nested html block.
		if( in_array( $block[ 'blockName' ], $this->nested_html_blocks ) ) {
			$inner_html_processed->next_tag();
		}

		// Parse native styles.
		$native_parsed = CSS_Parser::parse( $inner_html_processed->get_attribute( 'style' ) );

		// Set inline styles.
		$inline_styles = isset( $block[ 'attrs' ][ 'inlineStyles' ] ) && ! empty( $block[ 'attrs' ][ 'inlineStyles' ] ) ? $block[ 'attrs' ][ 'inlineStyles' ] : [];

		// We first need to clear native_styles by inline_styles to get static properties that got set from other sources.
		if( ! empty( $inline_styles ) ) {
			foreach( $inline_styles as $index => $properties ) {
				foreach( $properties as $property => $rules ) {
					if( in_array( $property, $this->ignore_properties ) ) {
						unset( $inline_styles[ $index ][ $property ] );
						continue;
					}

					foreach( $rules as $rule ) {

						if( 0 === strpos( $rule[ 'css' ], '%{' ) ) {
							$rule_parsed = CSS_Parser::parse( $rule[ 'css' ] );

							foreach( $rule_parsed as $css_property => $css_value ) {
								if( isset( $native_parsed[ $css_property ] ) && $css_value === $native_parsed[ $css_property ] ) {
									unset( $native_parsed[ $css_property ] );
								}
							}
						}
					}
				}
			}
		}

		// Filter out block style (not css) properties to ignore.
		$block_style = $block[ 'attrs' ][ 'style' ];
		foreach( $block_style as $property => $style ) {
			if( in_array( $property, $this->ignore_properties ) ) {
				unset( $block_style[ $property ] );
			}
		}

		// Render styles from wp_style_engine to merge with native_styles.
		$engine_styles = \wp_style_engine_get_styles( $block_style, [ 'selector' => '' ] );
		$merged_parsed = $native_parsed;

		// Check if we got some css from wp_style_engine to merge.
		if( isset( $engine_styles[ 'css' ] ) ) {
			$engine_parsed = CSS_Parser::parse( $engine_styles[ 'css' ] );
			$merged_parsed = array_merge( $merged_parsed, $engine_parsed );
		}

		if( in_array( $block[ 'blockName' ], $this->nested_html_blocks ) ) {

			// Set only nested styles.
			$nested_parsed = $this->cleanup_nested_styles( $merged_parsed );
			$nested_styles = CSS_Parser::stringify( $nested_parsed );
			$inner_html_processed->set_attribute( 'style', $nested_styles );

			$inner_html_processed = new \WP_HTML_Tag_Processor( (string) $inner_html_processed );
			$parent_parsed = $this->cleanup_parent_styles( $merged_parsed );
			$parent_styles = CSS_Parser::stringify( $parent_parsed );
			$inner_html_processed->set_attribute( 'style', $parent_styles );

			$block[ 'innerHTML' ] = $inner_html_processed;

		} else {
			// Stringify the result.
			$merged_styles = CSS_Parser::stringify( $merged_parsed );

			// Set the resulting style and html.
			$inner_html_processed->set_attribute( 'style', $merged_styles );
			$block[ 'innerHTML' ] = (string) $inner_html_processed;
		}

		// Check if we need to set innerContent too.
		if( isset( $block[ 'innerContent' ][ 0 ] ) ) {

			// Set inner content processed.
			$inner_content_processed = new \WP_HTML_Tag_Processor( $block[ 'innerContent' ][ 0 ] );
			$inner_content_processed->next_tag();

			// Jump over the first html element when its a nested html block.
			if( in_array( $block[ 'blockName' ], $this->nested_html_blocks ) ) {
				$parent_parsed = $this->cleanup_parent_styles( $merged_parsed );
				if( ! empty( $parent_parsed ) ) {
					$parent_styles = CSS_Parser::stringify( $parent_parsed );
					$inner_content_processed->set_attribute( 'style', $parent_styles );
				} else {
					$inner_content_processed->remove_attribute( 'style' );
				}

				$inner_content_processed->next_tag();

				$nested_parsed = $this->cleanup_nested_styles( $merged_parsed );
				$nested_styles = CSS_Parser::stringify( $nested_parsed );
				$inner_html_processed->set_attribute( 'style', $nested_styles );

				$block[ 'innerContent' ][ 0 ] = (string) $inner_content_processed;

			} else {
				// Set the result on innerContent.
				$inner_content_processed->set_attribute( 'style', $merged_styles );
				$block[ 'innerContent' ][ 0 ] = (string) $inner_content_processed;
			}
		}

		return $block;
	}


	/**
	 * Method to cleanup nested styles.
	 *
	 * @param array $styles
	 *
	 * @since 0.2.17
	 */
	protected function cleanup_nested_styles( $styles )
	{
		foreach( $styles as $property => $value ) {
			if( in_array( $property, $this->ignore_nested_properties ) ) {
				unset( $styles[ $property ] );
			}
		}

		return $styles;
	}


	/**
	 * Method to cleanup parent styles.
	 *
	 * @param array $styles
	 *
	 * @since 0.2.17
	 */
	protected function cleanup_parent_styles( $styles )
	{
		foreach( $styles as $property => $value ) {
			if( ! in_array( $property, $this->ignore_nested_properties ) ) {
				unset( $styles[ $property ] );
			}
		}

		return $styles;
	}
}