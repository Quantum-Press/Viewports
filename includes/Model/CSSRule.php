<?php

declare( strict_types=1 );

namespace QP\Viewports\Model;

/**
 * Represents a single CSS rule with selector, properties, and media queries.
 *
 * Provides methods to generate CSS strings, compressed CSS, and manage properties.
 *
 * @package QP\Viewports\Model
 */
class CSSRule {

    /**
     * MD5 hash of the CSS properties for comparison.
     *
     * @var string
     */
    private string $hash = '';

    /**
     * Slug representing the selector and media info.
     *
     * @var string
     */
    private string $slug = '';

    /**
     * Source of the CSS rule.
     *
     * @var string
     */
    private string $source = '';

    /**
     * CSS property name.
     *
     * @var string
     */
    private string $property = '';

    /**
     * Selector string.
     *
     * @var string
     */
    private string $selector = '';

    /**
     * Array of CSS property => value pairs.
     *
     * @var array
     */
    private array $properties = [];

    /**
     * Media type, e.g., "screen".
     *
     * @var string
     */
    private string $media = '';

    /**
     * Media query minimum width in pixels.
     *
     * @var int
     */
    private int $minWidth = 0;

    /**
     * Media query maximum width in pixels.
     *
     * @var int
     */
    private int $maxWidth = -1;

    /**
     * Cached generated CSS string.
     *
     * @var string|null
     */
    private string|null $css = null;


    /**
     * Constructor to initialize a CSS rule.
     *
     * @param string $source
     * @param string $property
     * @param string $selector
     * @param array  $properties
     * @param string $media
     * @param int    $minWidth
     * @param int    $maxWidth
     */
    public function __construct(
        string $source,
        string $property,
        string $selector,
        array $properties,
        string $media = 'screen',
        int $minWidth = 0,
        int $maxWidth = -1,
    ) {

        $this->source = $source;
        $this->property = $property;
        $this->selector = $selector;
        $this->properties = $properties;
        $this->media = $media;
        $this->minWidth = $minWidth;
        $this->maxWidth = $maxWidth;

        $this->slug = str_replace( ' ', '-', sprintf(
            '%s-%s-%s-%s',
            $media,
            $selector,
            $minWidth,
            $maxWidth,
        ) );

        $this->generateHash();
    }


    /**
     * Generates MD5 hash from CSS properties for comparison.
     *
     * @return void
     */
    private function generateHash() : void
    {
        $this->hash = md5( serialize( $this->properties() ) );
    }


    /**
     * Returns the CSS rule hash.
     *
     * @return string
     */
    public function hash() : string
    {
        return $this->hash;
    }


    /**
     * Returns the slug of the rule.
     *
     * @return string
     */
    public function slug() : string
    {
        return $this->slug;
    }


    /**
     * Returns the source of the rule.
     *
     * @return string
     */
    public function source() : string
    {
        return $this->source;
    }


    /**
     * Returns the property name.
     *
     * @return string
     */
    public function property() : string
    {
        return $this->property;
    }


    /**
     * Returns the selector string.
     *
     * @return string
     */
    public function selector() : string
    {
        return $this->selector;
    }


    /**
     * Adds multiple CSS properties to the rule.
     *
     * @param array $properties
     * @param bool  $compress Whether to mark as compressed.
     *
     * @return void
     */
    public function addCSSProperties( array $properties, bool $compress = false ) : void
    {
        foreach( $properties as $property => $value ) {
            $this->addCSSProperty( $property, $value );
        }

        $this->generateHash();

        if( $compress ) {
            $this->property = 'compressed';
        }
    }


    /**
     * Returns all CSS properties.
     *
     * @return array
     */
    public function properties() : array
    {
        return $this->properties;
    }


    /**
     * Returns CSS properties as a string.
     *
     * @return string
     */
    public function propertiesCss() : string
    {
        $cssString = '';

        foreach( $this->properties as $property => $value ) {
            $cssString .= "\n\t$property:$value;";
        }

        return $cssString;
    }


    /**
     * Returns compressed CSS properties as a string.
     *
     * @return string
     */
    public function compressedPropertiesCss() : string
    {
        $cssString = '';

        foreach( $this->properties as $property => $value ) {
            $cssString .= "$property:$value;";
        }

        return $cssString;
    }


    /**
     * Returns a single CSS property value if it exists.
     *
     * @param string $property
     *
     * @return string|null
     */
    public function propertyValue( string $property ) : string|null
    {
        if( isset( $this->properties[ $property ] ) ) {
            return $this->properties[ $property ];
        }

        return null;
    }


    /**
     * Adds a single CSS property if not already set.
     *
     * @param string $property
     * @param mixed  $value
     *
     * @return void
     */
    private function addCSSProperty( string $property, mixed $value ) : void
    {
        if( ! isset( $this->properties[ $property ] ) ) {
            $this->properties[ $property ] = $value;
        }
    }


    /**
     * Removes a CSS property if it exists.
     *
     * @param string $property
     *
     * @return void
     */
    public function removeCSSProperty( string $property ) : void
    {
        if( isset( $this->properties[ $property ] ) ) {
            unset( $this->properties[ $property ] );
        }
    }


    /**
     * Returns the media type of the rule.
     *
     * @return string
     */
    public function media() : string
    {
        return $this->media;
    }


    /**
     * Returns the media query minimum width.
     *
     * @return int
     */
    public function minWidth() : int
    {
        return $this->minWidth;
    }


    /**
     * Returns the media query maximum width.
     *
     * @return int
     */
    public function maxWidth() : int
    {
        return $this->maxWidth;
    }


    /**
     * Returns the generated CSS string for a selector.
     *
     * @param string $selector
     *
     * @return string
     */
    public function css( string $selector ) : string
    {
        if( null === $this->css ) {
            $this->generateCSS( $selector );
        }

        return $this->css;
    }


    /**
     * Generates the CSS string with media query and selector replacements.
     *
     * @param string $selector
     *
     * @return void
     */
    private function generateCSS( string $selector ) : void
    {
        $cssBody = $this->generateCSSBody( $selector );
        if( empty( $cssBody ) ) {
            $this->css = '';
            return;
        }

        $css = '';

        // Set media query with min-width and max-width.
        if( $this->minWidth > 0 && -1 !== $this->maxWidth ) {
            $css = sprintf(
                '@media (min-width: %spx) and (max-width: %spx) { %s }',
                $this->minWidth,
                $this->maxWidth,
                $cssBody
            );
        }

        // Set media query with min-width.
        if( $this->minWidth > 0 && -1 === $this->maxWidth ) {
            $css = sprintf(
                '@media (min-width: %spx) { %s }',
                $this->minWidth,
                $cssBody
            );
        }

        // Set media query with max-width.
        if( $this->minWidth === 0 && 0 < $this->maxWidth ) {
            $css = sprintf(
                '@media (max-width: %spx) { %s }',
                $this->maxWidth,
                $cssBody
            );
        }

        // Set without media query as default fallback.
        if( $this->minWidth === 0 && -1 === $this->maxWidth ) {
            $css = $cssBody;
        }

        $this->css = $css;
    }


    /**
     * Generates CSS body with selector replacement.
     *
     * @param string $selector
     *
     * @return string
     */
    public function generateCSSBody( string $selector = '%' ) : string
    {
        $propertiesCss = $this->propertiesCss();
        if( empty( $propertiesCss ) ) {
            return '';
        }

        return sprintf(
            "\n%s{%s\n}",
            str_replace( '%', $selector, $this->selector ),
            $propertiesCss
        );
    }


    /**
     * Generates compressed CSS body with selector replacement.
     *
     * @param string $selector
     *
     * @return string
     */
    public function generateCompressedCSSBody( string $selector = '%' ) : string
    {
        $propertiesCss = $this->compressedPropertiesCss();
        if( empty( $propertiesCss ) ) {
            return '';
        }

        return sprintf(
            "\n%s{%s\n}",
            str_replace( '%', $selector, $this->selector ),
            $propertiesCss
        );
    }


    /**
     * Determines if this rule requires a media query wrapper.
     *
     * @return bool
     */
    public function needsMediaQuery() : bool
    {
        if( 'screen' === $this->media && ( $this->minWidth > 0 || $this->maxWidth > -1 ) ) {
            return true;
        }

        return false;
    }


    /**
     * Determines if this rule is an inline style without media query.
     *
     * @return bool
     */
    public function isInlineStyle() : bool
    {
        if( 'screen' === $this->media && 0 === $this->minWidth && -1 === $this->maxWidth ) {
            return true;
        }

        return false;
    }
}
