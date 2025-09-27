<?php

declare( strict_types=1 );

namespace QP\Viewports\Model;

/**
 * This model class handles a single css rule.
 *
 * @class    QP\Viewports\Model\CSSRule
 * @package  QP\Viewports\Model\
 * @category Class
 */
class CSSRule {

    /**
     * Property contains the hash of CSSProperties.
     *
     * @var string
     */
    private string $hash = '';

    /**
     * Property contains the slug of the selector.
     *
     * @var string
     */
    private string $slug = '';

    /**
     * Property contains the source of the rule.
     *
     * @var string
     */
    private string $source = '';

    /**
     * Property contains property name.
     *
     * @var string
     */
    private string $property = '';

    /**
     * Property contains selector.
     *
     * @var string
     */
    private string $selector = '';

    /**
     * Property contains css property value pairs.
     *
     * @var array
     */
    private array $properties = [];

    /**
     * Property contains media.
     *
     * @var string
     */
    private string $media = '';

    /**
     * Property contains media query min-width.
     *
     * @var integer
     */
    private int $minWidth = 0;

    /**
     * Property contains media query max-width.
     *
     * @var integer
     */
    private int $maxWidth = -1;

    /**
     * Property contains css.
     *
     * @var string|null
     */
    private string|null $css = null;


    /**
     * Constructor to build CSSRule object.
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
     * Method to generate hash (md5) from CSSProperties to compare later.
     */
    private function generateHash()
    {
        $this->hash = md5( serialize( $this->getCSSProperties() ) );
    }


    /**
     * Method to generate hash (md5) from all relevant CSSRule informations to compare later.
     *
     * @return string
     */
    public function getHash() : string
    {
        return $this->hash;
    }


    /**
     * Method to return the slug.
     *
     * @return string
     */
    public function getSlug() : string
    {
        return $this->slug;
    }


    /**
     * Method to return the source.
     *
     * @return string
     */
    public function getSource() : string
    {
        return $this->source;
    }


    /**
     * Method to return the property.
     *
     * @return string
     */
    public function getProperty() : string
    {
        return $this->property;
    }


    /**
     * Method to return the selector.
     *
     * @return string
     */
    public function getSelector() : string
    {
        return $this->selector;
    }


    /**
     * Method to remove a property from properties.
     *
     * @param array $properties
     * @param boolean $compress
     */
    public function addCSSProperties( $properties, $compress = false )
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
     * Method to return all properties.
     *
     * @return array
     */
    public function getCSSProperties() : array
    {
        return $this->properties;
    }


    /**
     * Method to return properties css.
     *
     * @return string
     */
    public function getPropertiesCSS() : string
    {
        $cssString = '';

        foreach( $this->properties as $property => $value ) {
            $cssString .= "\n\t$property:$value;";
        }

        return $cssString;
    }



    /**
     * Method to return properties css compressed.
     *
     * @return string
     */
    public function getCompressedPropertiesCSS() : string
    {
        $cssString = '';

        foreach( $this->properties as $property => $value ) {
            $cssString .= "$property:$value;";
        }

        return $cssString;
    }


    /**
     * Method to return a property from properties.
     *
     * @param string $property
     *
     * @return string|null
     */
    public function getCSSProperty( $property ) : string|null
    {
        if( isset( $this->properties[ $property ] ) ) {
            return $this->properties[ $property ];
        }

        return null;
    }


    /**
     * Method to remove a property from properties.
     *
     * @param string $property
     */
    private function addCSSProperty( $property, $value )
    {
        if( ! isset( $this->properties[ $property ] ) ) {
            $this->properties[ $property ] = $value;
        }
    }


    /**
     * Method to remove a property from properties.
     *
     * @param string $property
     */
    public function removeCSSProperty( $property )
    {
        if( isset( $this->properties[ $property ] ) ) {
            unset( $this->properties[ $property ] );
        }
    }


    /**
     * Method to return the media property.
     *
     * @return string
     */
    public function getMedia() : string
    {
        return $this->media;
    }


    /**
     * Method to return the minWidth property.
     *
     * @return int
     */
    public function getMinWidth() : int
    {
        return $this->minWidth;
    }


    /**
     * Method to return the maxWidth property.
     *
     * @return int
     */
    public function getMaxWidth() : int
    {
        return $this->maxWidth;
    }


    /**
     * Method to return the css property.
     *
     * @param string $selector
     *
     * @return string
     */
    public function getCSS( $selector ) : string
    {
        if( null === $this->css ) {
            $this->generateCSS( $selector );
        }

        return $this->css;
    }


    /**
     * Method to generate css with replacing wildcard selector.
     *
     * @param string $selector
     */
    private function generateCSS( $selector )
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
     * Method to return the css property.
     *
     * @param string $selector
     *
     * @return string
     */
    public function generateCSSBody( $selector = '%' ) : string
    {
        $propertiesCSS = $this->getPropertiesCSS();
        if( empty( $propertiesCSS ) ) {
            return '';
        }

        return sprintf(
            "\n%s{%s\n}",
            str_replace( '%', $selector, $this->selector ),
            $propertiesCSS
        );
    }


    /**
     * Method to return the css property.
     *
     * @param string $selector
     *
     * @return string
     */
    public function generateCompressedCSSBody( $selector = '%' ) : string
    {
        $propertiesCSS = $this->getCompressedPropertiesCSS();
        if( empty( $propertiesCSS ) ) {
            return '';
        }

        return sprintf(
            "\n%s{%s\n}",
            str_replace( '%', $selector, $this->selector ),
            $propertiesCSS
        );
    }


    /**
     * Method to indicate whether the rule needs a mediaQuery container.
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
     * Method to indicate whether the rule is an inline style.
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
