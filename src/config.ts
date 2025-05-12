import { versionCompare } from "./utils/version";

/**
 * Retrieves the global configuration object for qpViewports.
 *
 * @returns {Readonly<Record<string, any>>} - A frozen object containing configuration settings.
 */
export const getConfig = (): Readonly<Record<string, any>> => {
	return Object.freeze( ( window as any ).qpViewportsConfig || {} );
};


/**
 * Retrieves a specific configuration value by key.
 *
 * @template T
 *
 * @param {string} key - The configuration key to retrieve.
 * @param {T} [defaultValue=null] - The default value to return if the key is not found. Defaults to `null` if not provided.
 *
 * @returns {T} - The value associated with the key, or the default value if the key does not exist.
 */
export const getConfigValue = <T>( key: string, defaultValue: T = null ): T => {
	const settings = getConfig();

	return ( key in settings ? settings[ key ] : defaultValue ) as T;
};


/**
 * Compares the `gutenbergVersion` from the config with a provided version.
 *
 * @param {string} compareVersion - The version to compare against the `gutenbergVersion` from the configuration.
 *
 * @returns {number} - Returns `-1` if the `gutenbergVersion` is older than `compareVersion`, `1` if it is newer, and `0` if they are equal.
 *
 * @throws {Error} - Throws an error if `gutenbergVersion` is not found in the configuration.
 */
export const gutenbergVersionCompare = ( compareVersion: string ): number => {
	const gutenbergVersion = getConfigValue( 'gutenbergVersion' ) as string|null;
	if( ! gutenbergVersion ) {
		throw new Error( 'gutenbergVersion not found in the config' );
	}

	return versionCompare( gutenbergVersion, compareVersion );
};


/**
 * Checks if a given block name is in the block blacklist from the configuration.
 *
 * @param {string} blockName - The name of the block to check against the blacklist.
 *
 * @returns {boolean} - Returns `true` if the block name is in the blacklist, `false` otherwise.
 *
 * @throws {Error} - Throws an error if `blockBlacklist` is not found in the configuration.
 */
export const isInBlockBlacklist = ( blockName: string ): boolean => {
	const blockBlacklist = getConfigValue( 'blockBlacklist' ) as string[]|null;
	if( ! blockBlacklist ) {
		throw new Error( 'blockBlacklist not found in the config' );
	}

	return blockBlacklist.includes( blockName );
};
