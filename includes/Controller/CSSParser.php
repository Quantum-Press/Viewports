<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

use QP\Viewports\Model\CSSRuleset;

/**
 * CSS parser class.
 *
 * This class handles parsing css back and forth.
 *
 * @class    QP\Viewports\CSSParser
 * @package  QP\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class CSSParser
{
    /**
     * Parses block args to CSSRuleset object.
     *
     * @param array $blockData
     * @param null|string $blockHTML
     *
     * @return CSSRuleset
     */
    public static function parseBlock( array $blockData, null|string $blockHTML = null ) : CSSRuleset
    {
        return new CSSRuleset( $blockData, $blockHTML );
    }


    /**
     * Parses a CSS string and returns an associative array of properties and values.
     *
     * @param string $cssString
     *
     * @return array
     */
    public static function parse( string $cssString ) : array
    {
        // Set result.
        $result = [];

        // Split the CSS string into individual declarations.
        $declarations = self::getDeclarations( $cssString );

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
                    // Error notice?
                    continue;
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
     * Extracts the inner HTML of an element manually from its full HTML string.
     *
     * @param string $html
     * @param string $tagName
     *
     * @return string The inner HTML content.
     */
    public static function extractInnerHTML( string $html, string $tagName ) : string
    {
        $pattern = sprintf(
            '/<%s[^>]*>(.*?)<\/%s>/is',
            preg_quote( $tagName, '/' ),
            preg_quote( $tagName, '/' )
        );

        if( preg_match( $pattern, $html, $matches ) ) {
            return $matches[ 1 ] ?? '';
        }

        return '';
    }


    /**
     * Replaces the inner HTML with given HTML string by tagName.
     *
     * @param string $html
     * @param string $innerHTML
     * @param string $tagName
     *
     * @return string The inner HTML content.
     */
    public static function replaceInnerHTML( string $html, string $innerHTML, string $tagName ) : string
    {
        $pattern = sprintf(
            '/<%s[^>]*>(.*?)<\/%s>/is',
            preg_quote( $tagName, '/' ),
            preg_quote( $tagName, '/' )
        );

        if( preg_match( $pattern, $html, $matches ) ) {
            $search = $matches[ 1 ] ?? '';

            if( ! empty( $search ) ) {
                return str_replace( $search, $innerHTML, $html );
            }
        }

        return $html;
    }


    /**
     * Method to check if given selector is valid.
     *
     * @param string $selector
     *
     * @return bool
     */
    public static function isValidSelector( string $selector ) : bool
    {
        if( false !== self::getSelectorParts( $selector ) ) {
            return true;
        }

        return false;
    }


    /**
     * Method to return selector parts sanitized for \WP_HTML_Tag_Processor queries.
     *
     * @param string $selector
     *
     * @return array|false Return array of selector parts or boolean false on invalid format
     */
    public static function getSelectorParts( string $selector ) : array|false
    {
        $selector = self::removeWildcard( $selector );

        $allowedElements = [ #TODO Auslagern.
            'div', 'img', 'span', 'p', 'article', 'section', 'header', 'footer', 'nav', 'ul',
            'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'form', 'input', 'button', 'table',
            'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'figcaption', 'figure', 'main', 'mark'
        ];

        // The selector is only allowed to contain at least an element or with optional trailing class eg. div.test or combinations.
        // This is neccessary cause \WP_HTML_Tag_Processor only supports this as cssQuery format.
        $pattern = '/^([a-zA-Z0-9]+(\.[a-zA-Z0-9_-]+)*|\*)(\s*(>|\+|~|\s)*\s*[a-zA-Z0-9]+(\.[a-zA-Z0-9_-]+)*)*(\s*(,)\s*)*$/';

        // Check if we match something.
        if( preg_match( $pattern, $selector ) ) {

            // Split selector into parts, to check each for format issues.
            $parts = preg_split( '/[\s,]+/', $selector );
            foreach( $parts as $part ) {

                // Check if the part is matching the expected format.
                if( preg_match( '/^([a-zA-Z0-9]+)(\.[a-zA-Z0-9_-]+)*$/', $part, $matches ) ) {

                    // Check if first match is an element.
                    $element = strtolower( $matches[ 1 ] );
                    if( ! in_array( $element, $allowedElements ) && $element !== '*' ) {
                        return false;
                    }
                }
            }

            return $parts;
        }

        return false;
    }


    /**
     * Method to remove leading wildcards from selector.
     *
     * @param string $selector
     *
     * @return array|false Return array of selector parts or boolean false on invalid format
     */
    public static function removeWildcard( string $selector ) : string
    {
        $cleaned = preg_replace( '/%\s*(>|~|\+|\s)?\s*/', '', $selector );

        return trim( $cleaned );
    }


    /**
     * Static method to return split css string as declarations.
     *
     * @param string $css
     *
     * @return array
     */
    public static function getDeclarations( string $css ) : Array
    {
        $css = self::removeSelectors( $css );
        $css = trim( $css ); // Remove unnecessary leading and trailing whitespace.
        $css = html_entity_decode(
            $css,
            ENT_QUOTES | ENT_HTML5,
            'UTF-8'
        ); // Remove special chars for this process.

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
     * @return string
     */
    public static function removeSelectors( string $css ) : string
    {
        if( empty( $css ) ) {
            return '';
        }

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
     * @return string
     */
    public static function getSelector( string $css ) : string
    {
        // First clean css from selectors.
        $cleaned = self::removeSelectors( $css );

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
     * @return string
     */
    public static function stringify( array $css_array ) : string
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
