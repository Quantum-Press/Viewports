<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * CSS parser class.
 *
 * This class handles parsing css back and forth.
 *
 * @class    Quantum\Viewports\CSS_Parser
 * @since    0.2.15
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class CSS_Parser
{
	/**
	 * Parses a CSS string and returns an associative array of properties and values.
	 *
	 * @param string $cssString
	 *
	 * @since 0.2.15
	 *
	 * @return array
	 */
	public static function parse( $cssString )
	{
		// Set result.
		$result = [];

		// Split the CSS string into individual declarations.
		$declarations = self::get_declarations( $cssString );

		// Iterate over declarations.
		foreach( $declarations as $declaration ) {

			// If the declaration is not empty, process it
			if ( ! empty( $declaration ) ) {

				// Split the declaration into property and value by the first colon
				$parts = explode( ':', $declaration, 2 );

				// Ensure both property and value are present
				if( count( $parts ) === 2 ) {
					$property = trim( $parts[ 0 ] );
					$value = trim( $parts[ 1 ] );

					// Store the property-value pair in the result array
					$result[ $property ] = $value;
				} else {
					throw new \Exception( sprintf( 'There is a part of css that cant get interpreted: %s', $cssString ) );
				}

				// Split the declaration into property and value by the first colon
				list( $property, $value ) = explode( ':', $declaration, 2 );

				// Trim unnecessary whitespace around the property
				$property = trim( $property );
				$value = trim( $value );

				// Store the property-value pair in the result array
				$result[ $property ] = $value;
			}
		}

		return $result;
	}


	/**
	 * Static method to return split css string as declarations.
	 *
	 * @param string $css
	 *
	 * @since 0.2.15
	 *
	 * @return array
	 */
	public static function get_declarations( $css ) : Array
	{
		$css = self::remove_selectors( $css );
		$css = trim( $css ); // Remove unnecessary leading and trailing whitespace.
		$css = html_entity_decode( $css, ENT_QUOTES | ENT_HTML5, 'UTF-8' ); // Remove special chars for this process.

		$parts = explode( ';', $css ); // Split string at semicolons.

		foreach( $parts as $index => $part ) {

			// Check for not existing colons, to remove declare.
			if( false === strpos( $part, ':' ) ) {
				unset( $parts[ $index ] );
			} else {
				$part = trim( $part );
				$parts[ $index ] = $part;
			}
		}

		return $parts;
	}


	/**
	 * Static method to remove selectors from css string.
	 *
	 * @param string $css
	 *
	 * @since 0.2.15
	 *
	 * @return string
	 */
	public static function remove_selectors( $css ) : string
	{
		// Regular expression to match selectors up to and including the opening brace
		$pattern = '/[^\{\}]+\s*\{/';

		// Use preg_replace to remove all matches
		$cleaned = preg_replace( $pattern, '', $css );

		// Check for ending }.
		if( ( strlen( $cleaned ) - 1 ) === strpos( $cleaned, '}' ) ) {
			$cleaned = substr( $cleaned, 0, -1 );
		}

		// Remove any remaining whitespace and newlines
		return trim( $cleaned );
	}


	/**
	 * Static method to remove selectors from css string.
	 *
	 * @param string $css
	 *
	 * @since 0.2.15
	 *
	 * @return string
	 */
	public static function get_selector( $css ) : string
	{
		// First clean css from selectors.
		$cleaned = self::remove_selectors( $css );

		// Then set the position the css starts.
		$cleaned_position = strpos( $css, $cleaned );

		// Return the leading selector by removing the css including starting bracket "{"
		return substr( $css, 0, $cleaned_position - 1 );
	}


	/**
	 * Static method to stringify an associative array of CSS declarations back to a CSS string.
	 *
	 * @param array $css_array
	 *
	 * @since 0.2.15
	 *
	 * @return string
	 */
	public static function stringify( $css_array ) : string
	{
		$css_string = '';
		foreach ( $css_array as $property => $value ) {
			$css_string .= $property . ': ' . $value . '; ';
		}

		return rtrim( $css_string, '; ' );
	}


	/**
	 * Static method to deeply merge two array with each other.
	 *
	 * @param array $array1
	 * @param array $array2
	 *
	 * @since 0.2.15
	 *
	 * @return string
	 */
	public static function deep_merge( array $array1, array $array2 ) : array
	{
		$merged = $array1;

		foreach( $array2 as $key => $value ) {
			if( is_array( $value ) && isset( $merged[ $key ] ) && is_array( $merged[ $key ] ) ) {
				$merged[ $key ] = self::deep_merge( $merged[ $key ], $value );
			} else {
				$merged[ $key ] = $value;
			}
		}

		return $merged;
	}
}
