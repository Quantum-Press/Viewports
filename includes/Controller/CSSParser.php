<?php

declare( strict_types=1 );

namespace QP\Viewports\Controller;

use QP\Viewports\Model\CSSRuleset;

/**
 * Handles parsing and manipulating CSS for blocks.
 *
 * Provides utilities to convert block data into CSSRuleset objects,
 * parse CSS strings into associative arrays, extract or replace
 * inner HTML, validate selectors, and merge CSS structures.
 *
 * @package QP\Viewports\Controller
 */
class CSSParser
{
    /**
     * Converts block data into a CSSRuleset object.
     *
     * @param array       $blockData The block data array.
     * @param string|null $blockHtml Optional block HTML.
     *
     * @return CSSRuleset The generated CSSRuleset object.
     */
    public static function parseBlock( array $blockData, null|string $blockHtml = null ) : CSSRuleset
    {
        return new CSSRuleset( $blockData, $blockHtml );
    }


    /**
     * Parses a CSS string into an associative array of property-value pairs.
     *
     * @param string $cssString The CSS string to parse.
     *
     * @return array Associative array of CSS properties and values.
     */
    public static function parse( string $cssString ) : array
    {
        // Set result.
        $result = [];

        // Split the CSS string into individual declarations.
        $declarations = self::splitDeclarations( $cssString );

        // Iterate over declarations.
        foreach( $declarations as $declaration ) {

            // If the declaration is not empty, process it
            if ( ! empty( $declaration ) ) {

                // Split the declaration into property and value by the first colon
                $parts = explode( ':', $declaration, 2 );

                // Ensure both property and value are present
                if( count( $parts ) !== 2 ) {
                    continue;
                }

                $property = trim( $parts[ 0 ] );
                $value = trim( $parts[ 1 ] );

                // Store the property-value pair in the result array
                $result[ $property ] = $value;

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
     * Extracts the inner HTML content of a specific element tag.
     *
     * @param string $html    Full HTML string.
     * @param string $tagName The tag name to extract.
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
     * Replaces the inner HTML content of a specific element tag.
     *
     * @param string $html       Full HTML string.
     * @param string $innerHtml  Replacement inner HTML content.
     * @param string $tagName    The tag name to replace content for.
     *
     * @return string Modified HTML string with replaced inner content.
     */
    public static function replaceInnerHTML( string $html, string $innerHtml, string $tagName ) : string
    {
        $pattern = sprintf(
            '/<%s[^>]*>(.*?)<\/%s>/is',
            preg_quote( $tagName, '/' ),
            preg_quote( $tagName, '/' )
        );

        if( preg_match( $pattern, $html, $matches ) ) {
            $search = $matches[ 1 ] ?? '';

            if( ! empty( $search ) ) {
                return str_replace( $search, $innerHtml, $html );
            }
        }

        return $html;
    }


    /**
     * Checks whether a given CSS selector is valid.
     *
     * @param string $selector The CSS selector string.
     *
     * @return bool True if valid, false otherwise.
     */
    public static function isValidSelector( string $selector ) : bool
    {
        if( false !== self::sanitizeSelectorParts( $selector ) ) {
            return true;
        }

        return false;
    }


    /**
     * Returns sanitized parts of a selector suitable for \WP_HTML_Tag_Processor queries.
     *
     * @param string $selector The CSS selector string.
     *
     * @return array|false Array of selector parts, or false if invalid.
     */
    public static function sanitizeSelectorParts( string $selector ) : array|false
    {
        $selector = self::removeWildcard( $selector );

        $allowedElements = [ #TODO Outsource elements.json
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
     * Removes leading wildcard characters from a selector.
     *
     * @param string $selector The selector string.
     *
     * @return string Cleaned selector string.
     */
    public static function removeWildcard( string $selector ) : string
    {
        $cleaned = preg_replace( '/%\s*(>|~|\+|\s)?\s*/', '', $selector );

        return trim( $cleaned );
    }


    /**
     * Splits a CSS string into individual declarations.
     *
     * @param string $css The CSS string.
     *
     * @return array Array of individual CSS declarations.
     */
    public static function splitDeclarations( string $css ) : Array
    {
        $css = self::removeSelectors( $css );
        $css = trim( $css ); // Remove unnecessary leading and trailing whitespace.
        $css = html_entity_decode(
            $css,
            ENT_QUOTES | ENT_HTML5,
            'UTF-8'
        ); // Remove special chars for this process.

        $parts = explode( ';', $css ); // Split string at semicolons.
        $split = [];

        foreach( $parts as $index => $part ) {

            // Check for not existing colons, to remove declare.
            if( false !== strpos( $part, ':' ) ) {
                $part = trim( $part );
                $parts[ $index ] = $part;
            }
        }

        return $parts;
    }


    /**
     * Removes selectors from a CSS string, leaving only the declarations.
     *
     * @param string $css The CSS string.
     *
     * @return string CSS declarations only.
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
     * Extracts the selector part of a CSS string.
     *
     * @param string $css The full CSS string.
     *
     * @return string Selector portion of the CSS.
     */
    public static function extractSelector( string $css ) : string
    {
        // First clean css from selectors.
        $cleaned = self::removeSelectors( $css );

        // Then set the position the css starts.
        $cleanedPosition = strpos( $css, $cleaned );

        // Return the leading selector by removing the css including starting bracket "{"
        return substr( $css, 0, $cleanedPosition - 1 );
    }


    /**
     * Converts an associative array of CSS properties back into a CSS string.
     *
     * @param array $cssArray Associative array of CSS declarations.
     *
     * @return string CSS string.
     */
    public static function stringify( array $cssArray ) : string
    {
        $cssString = '';
        foreach ( $cssArray as $property => $value ) {
            $cssString .= $property . ': ' . $value . '; ';
        }

        return rtrim( $cssString, '; ' );
    }
}
