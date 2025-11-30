<?php
/**
 * Extracts plugin info from plugin file path.
 *
 * @package QP\Viewports
 *
 * @phpcs:disable Squiz.Commenting.FunctionCommentThrowTag
 * @phpcs:disable WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase
 */

declare( strict_types=1 );

namespace QP\Viewports;

use Dhii\Package\Version\StringVersionFactoryInterface;
use Dhii\Package\Version\VersionInterface;
use Exception;
use RuntimeException;
use UnexpectedValueException;
use WpOop\WordPress\Plugin\FilePathPluginFactoryInterface;
use WpOop\WordPress\Plugin\PluginInterface;

/**
 * Creates Plugin instances from plugin file paths.
 */
class FilePathPluginFactory implements FilePathPluginFactoryInterface {

    /**
     * Factory responsible for creating version instances from strings.
     *
     * @var StringVersionFactoryInterface
     */
    protected $versionFactory;


    /**
     * Constructor.
     *
     * @param StringVersionFactoryInterface $versionFactory for creating VersionInterface instances.
     */
    public function __construct( StringVersionFactoryInterface $versionFactory )
    {
        $this->versionFactory = $versionFactory;
    }


    /**
     * Parses a plugin file and creates a Plugin instance.
     *
     * @param string $filePath Absolute path to the plugin's main file.
     *
     * @return PluginInterface The constructed plugin instance.
     *
     * @throws RuntimeException         If the file is unreadable.
     * @throws UnexpectedValueException If no valid plugin header was found.
     * @throws Exception                If a version string is malformed.
     */
    public function createPluginFromFilePath( string $filePath ): PluginInterface
    {
        $this->assertReadable( $filePath );

        $pluginData = $this->readPluginHeader( $filePath );
        $pluginData = $this->mergePluginDefaults( $pluginData );

        $baseDir    = dirname( $filePath );
        $baseName   = plugin_basename( $filePath );
        $slug       = $this->pluginSlug( $baseName );
        $textDomain = $pluginData[ 'TextDomain' ] ?: $slug;

        return new Plugin(
            $pluginData['Name'],
            $this->createVersion( $pluginData[ 'Version' ] ),
            $baseDir,
            $baseName,
            $pluginData['PluginURI'],
            $pluginData['Description'],
            $textDomain,
            $this->createVersion($pluginData[ 'RequiresPHP' ] ),
            $this->createVersion($pluginData[ 'RequiresWP' ] )
        );
    }


    /**
     * Ensures that the provided file path is readable.
     *
     * @param string $filePath Path to check.
     *
     * @throws RuntimeException If the file is not readable or does not exist.
     */
    private function assertReadable( string $filePath ): void
    {
        if ( ! is_readable( $filePath ) ) {
            throw new RuntimeException(
                sprintf( 'Plugin file "%s" does not exist or is not readable', $filePath )
            );
        }
    }


    /**
     * Reads plugin header information from a file.
     *
     * @param string $filePath Path to the plugin file.
     *
     * @return array<string,string> Associative array of plugin header fields.
     *
     * @throws UnexpectedValueException If no valid plugin header is found.
     */
    private function readPluginHeader( string $filePath ): array
    {
        $headers = [
            'Name'            => 'Plugin Name',
            'PluginURI'       => 'Plugin URI',
            'Version'         => 'Version',
            'Description'     => 'Description',
            'TextDomain'      => 'Text Domain',
            'RequiresWP'      => 'Requires at least',
            'RequiresPHP'     => 'Requires PHP',
            'RequiresPlugins' => 'Requires Plugins',
        ];

        $data = get_file_data(
            $filePath,
            $headers,
            'plugin'
        );

        if ( empty( $data ) ) {
            throw new UnexpectedValueException(
                sprintf( 'Plugin file "%s" does not have a valid plugin header', $filePath )
            );
        }

        return $data;
    }


    /**
     * Merges plugin header data with default fallback values.
     *
     * @param array<string,string> $data Extracted plugin header data.
     *
     * @return array<string,string> Complete and normalized plugin data.
     */
    private function mergePluginDefaults(array $data): array
    {
        return array_merge(
            [
                'Name'        => '',
                'Version'     => '0.1.0-alpha1+default',
                'Title'       => '',
                'Description' => '',
                'TextDomain'  => '',
                'RequiresWP'  => '6.5',
                'RequiresPHP' => '7.4',
            ],
            $data
        );
    }


    /**
     * Creates a new version from a version string.
     *
     * @param string $versionString The SemVer-compliant version string.
     *
     * @return VersionInterface The new version.
     *
     * @throws Exception If version string is malformed.
     */
    protected function createVersion( string $versionString ): VersionInterface
    {
        return $this->versionFactory->createVersionFromString( $versionString );
    }


    /**
     * Extracts a slug from a plugin basename.
     *
     * If the plugin resides in a directory, the directory name is used.
     * Otherwise, the file name without extension is used.
     *
     * @param string $baseName Result of plugin_basename().
     *
     * @return string Slug derived from basename.
     */
    protected function pluginSlug( string $baseName ): string
    {
        $directorySeparator = '/';

        // If plugin is in a directory, use directory name.
        if ( strstr( $baseName, $directorySeparator ) !== false ) {
            $parts = explode( $directorySeparator, $baseName );
            if ( $parts ) {
                return $parts[0];
            }
        }

        // If plugin is not in a directory, return plugin file basename.
        return basename( $baseName );
    }
}
