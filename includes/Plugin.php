<?php

declare( strict_types=1 );

namespace QP\Viewports;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

use Dhii\Package\Version\VersionInterface;
use WpOop\WordPress\Plugin\PluginInterface;

/**
 * Plugin properties.
 */
class Plugin implements PluginInterface {

    /**
     * The plugin name.
     *
     * @var string
     */
    protected $name;

    /**
     * The plugin version.
     *
     * @var VersionInterface
     */
    protected $version;

    /**
     * The path to the plugin base directory.
     *
     * @var string
     */
    protected $baseDir;

    /**
     * The plugin base name.
     *
     * @var string
     */
    protected $baseName;

    /**
     * The plugin URI.
     *
     * @var string
     */
    protected $pluginUri;

    /**
     * The plugin description.
     *
     * @var string
     */
    protected $description;

    /**
     * The text domain of this plugin
     *
     * @var string
     */
    protected $textDomain;

    /**
     * The minimal version of PHP required by this plugin.
     *
     * @var VersionInterface
     */
    protected $minPhpVersion;

    /**
     * The minimal version of WP required by this plugin.
     *
     * @var VersionInterface
     */
    protected $minWpVersion;


    /**
     * Plugin constructor.
     *
     * @param string           $name The plugin name.
     * @param VersionInterface $version The plugin version.
     * @param string           $baseDir The path to the plugin base directory.
     * @param string           $baseName The plugin base name.
     * @param string           $pluginUri The plugin URI.
     * @param string           $description The plugin description.
     * @param string           $textDomain The text domain of this plugin.
     * @param VersionInterface $minPhpVersion The minimal version of PHP required by this plugin.
     * @param VersionInterface $minWpVersion The minimal version of WP required by this plugin.
     */
    public function __construct(
        string $name,
        VersionInterface $version,
        string $baseDir,
        string $baseName,
        string $pluginUri,
        string $description,
        string $textDomain,
        VersionInterface $minPhpVersion,
        VersionInterface $minWpVersion
    ) {

        $this->name = $name;
        $this->description = $description;
        $this->version = $version;
        $this->baseDir = $baseDir;
        $this->baseName = $baseName;
        $this->pluginUri = $pluginUri;
        $this->textDomain = $textDomain;
        $this->minPhpVersion = $minPhpVersion;
        $this->minWpVersion = $minWpVersion;
    }


    /**
     * The plugin name.
     */
    public function getName(): string // phpcs:ignore
    {
        return $this->name;
    }


    /**
     * The plugin description.
     */
    public function getDescription(): string // phpcs:ignore
    {

        $allowedTags = array(
            'abbr'    => [ 'title' => true ],
            'acronym' => [ 'title' => true ],
            'code'    => true,
            'em'      => true,
            'strong'  => true,
            'a'       => [
                'href'  => true,
                'title' => true,
            ],
        );

        // phpcs:disable
        $text = \__( $this->description, $this->textDomain );

        /**
         * @psalm-suppress InvalidArgument
         */
        return wp_kses( $text, $allowedTags );
        // phpcs:enable
    }


    /**
     * The plugin version.
     */
    public function getVersion(): VersionInterface // phpcs:ignore
    {
        return $this->version;
    }


    /**
     * The path to the plugin base directory.
     */
    public function getBaseDir(): string // phpcs:ignore
    {
        return $this->baseDir;
    }


    /**
     * The plugin base name.
     */
    public function getBaseName(): string // phpcs:ignore
    {
        return $this->baseName;
    }


    /**
     * The text domain of this plugin.
     */
    public function getTextDomain(): string // phpcs:ignore
    {
        return $this->textDomain;
    }


    /**
     * The plugin URI.
     */
    public function getUri(): string // phpcs:ignore
    {
        return esc_url( $this->pluginUri );
    }


    /**
     * The plugin title.
     */
    public function getTitle(): string // phpcs:ignore
    {
        return '<a href="' . $this->getUri() . '">' . $this->getName() . '</a>';
    }


    /**
     * The minimal version of PHP required by this plugin.
     */
    public function getMinPhpVersion(): VersionInterface // phpcs:ignore
    {
        return $this->minPhpVersion;
    }


    /**
     * The minimal version of WP required by this plugin.
     */
    public function getMinWpVersion(): VersionInterface // phpcs:ignore
    {
        return $this->minWpVersion;
    }
}
