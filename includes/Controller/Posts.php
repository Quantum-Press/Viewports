<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * Posts class.
 *
 * This class handles post / template save.
 *
 * @class    Quantum\Viewports\Posts
 * @since    0.2.8
 * @version  0.2.14
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Posts extends Instance {

	/**
	 * Method to construct.
	 *
	 * @since 0.2.8
	 */
	protected function __construct()
	{
		$this->set_hooks();
	}


	/**
	 * Method to set hooks.
	 *
	 * @since 0.2.8
	 */
	protected function set_hooks()
	{
		\add_filter( 'wp_insert_post_data', [ $this, 'wp_insert_post_data' ], 10, 2 );
	}


	/**
	 * Method to filter "wp_insert_post_data".
	 *
	 * @since 0.2.8
	 */
	public function wp_insert_post_data( $data, $postarr )
	{
		$blocks = \parse_blocks( \stripslashes( $postarr[ 'post_content' ] ) );
		$blocks_modified = $this->modify_blocks( $blocks );
		$data[ 'post_content' ] = addslashes( \serialize_blocks( $blocks_modified ) );

		return $data;
	}


	/**
	 * Method to filter "modify_attributes".
	 *
	 * @since 0.2.8
	 */
	private function modify_blocks( $blocks )
	{
		$modified = [];

		foreach( $blocks as $block ) {
			if( isset( $block[ 'attrs' ][ 'tempId' ] ) ) {
				unset( $block[ 'attrs' ][ 'tempId' ] );
			}

			if( isset( $block[ 'attrs' ][ 'viewports' ][ 0 ][ 'style' ] ) ) {
				$block[ 'attrs' ][ 'style' ] = $block[ 'attrs' ][ 'viewports' ][ 0 ][ 'style' ];

				unset( $block[ 'attrs' ][ 'viewports' ][ 0 ][ 'style' ] );
				unset( $block[ 'attrs' ][ 'viewports' ][ 0 ] );
			}

			if( isset( $block[ 'attrs' ][ 'style' ] ) ) {
				$block = $this->modify_inline_styles( $block );
			}

			if( isset( $block[ 'innerBlocks' ] ) && ! empty( $block[ 'innerBlocks' ] ) ) {
				$block[ 'innerBlocks' ] = $this->modify_blocks( $block[ 'innerBlocks' ] );
			}

			$modified[] = $block;
		}

		return $modified;
	}


	/**
	 * Method to return modify inline styles.
	 *
	 * @param array (required) $block
	 *
	 * @since 0.2.8
	 * @version 0.2.14
	 */
	public function modify_inline_styles( $block )
	{
		$style_regex = '/style\s*=\s*["\'].*?["\']/';
		$style = preg_match( $style_regex, $block[ 'innerHTML' ], $matches );

		if( ! $style ) {
			return $block;
		}

		// Get the first match.
		$native_styles = substr( str_replace( 'style="', '', array_shift( $matches ) ), 0, -1 );
		$native_parsed = $this->parse_css( $native_styles );
		$inline_styles = isset( $block[ 'attrs' ][ 'inlineStyles' ] ) && ! empty( $block[ 'attrs' ][ 'inlineStyles' ] ) ? $block[ 'attrs' ][ 'inlineStyles' ] : [];

		// We first need to clear native_styles by inline_styles to get static properties.
		if( ! empty( $inline_styles ) ) {
			foreach( $inline_styles as $properties ) {
				foreach( $properties as $rules ) {
					foreach( $rules as $rule ) {

						if( 0 === strpos( $rule[ 'css' ], '%{' ) ) {
							$rule_parsed = $this->parse_css( $rule[ 'css' ] );

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

		$engine_styles = \wp_style_engine_get_styles( $block[ 'attrs' ][ 'style' ], [ 'selector' => '' ] );

		if( isset( $engine_styles[ 'css' ] ) ) {
			$engine_parsed = $this->parse_css( $engine_styles[ 'css' ] );
			$merged_parsed = array_merge( $native_parsed, $engine_parsed );
			$merged_styles = $this->stringify_css( $merged_parsed );

			$replaced = false;
			$block['innerHTML'] = preg_replace_callback(
				'/style\s*=\s*["\'][^"\']*["\']/',
				function( $matches ) use ( &$replaced, $merged_styles ) {
					if( ! $replaced ) {
						$replaced = true;
						return 'style="' . $merged_styles . ';"';
					}

					return $matches[0];
				},
				$block[ 'innerHTML' ],
				1
			);

			if( isset( $block[ 'innerContent' ][ 0 ] ) ) {
				$replaced = false;

				$block[ 'innerContent' ][ 0 ] = preg_replace_callback(
					'/style\s*=\s*["\'][^"\']*["\']/',
					function( $matches ) use ( &$replaced, $merged_styles ) {
						if( ! $replaced ) {
							$replaced = true;
							return 'style="' . $merged_styles . ';"';
						}
						return $matches[ 0 ];
					},
					$block[ 'innerContent' ][ 0 ],
					1
				);
			}
		}

		return $block;
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
					$css_array[ $property ] = $value;
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
}