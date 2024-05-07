import { isObject, getMergedAttributes, sanitizeAttributes } from '../utils';
import { Generator } from './generator';
import type { Attributes } from '../utils';
import type { Styles, SpectrumState, SpectrumProperties, State } from './types';

const { isEqual, cloneDeep } = window[ 'lodash' ];

/**
 * Set function to indicate whether given viewport is in range of desktop size.
 *
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {boolean} indication
 */
export const isInDesktopRange = ( viewport : number ) : boolean => {
	if ( viewport >= 1280 ) {
		return true;
	}

	return false;
}


/**
 * Set function to indicate whether given viewport is in range of tablet size.
 *
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {boolean} indication
 */
export const isInTabletRange = ( viewport : number ) : boolean => {
	if ( viewport >= 540 && viewport <= 1279 ) {
		return true;
	}

	return false;
}


/**
 * Set function to indicate whether given viewport is in range of mobile size.
 *
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {boolean} indication
 */
export const isInMobileRange = ( viewport : number ) : boolean => {
	if ( viewport <= 539 ) {
		return true;
	}

	return false;
}


/**
 * Set function to get the highest possible viewport for actual maxWidth.
 *
 * @since 0.1.0
 *
 * @return {integer} viewport
 */
export const getIframeViewport = () : number => {

	// Get the iframe width.
	const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );

	if ( iframe ) {
		return iframe?.getBoundingClientRect().width
	}

	const wrapper = document.querySelector( '.editor-styles-wrapper' );

	if ( wrapper ) {
		return wrapper?.getBoundingClientRect().width
	}

	return 800;
}


/**
 * Set function to get the highest possible viewport for actual maxWidth.
 *
 * @param {object} viewports
 *
 * @since 0.1.0
 *
 * @return {integer} highest viewport
 */
export const getHighestPossibleViewport = ( viewports : object ) : number => {
	const iframeWidth = getIframeViewport()

	// Iterates over the viewports and returns the highest possible viewport
	// smaller than the iframe width.
	let highestViewport = 0;
	for ( const [ viewport ] of Object.entries( viewports ) ) {
		if ( +viewport > iframeWidth ) {
			break;
		}
		highestViewport = +viewport;
	}

	return highestViewport;
}


/**
 * Set function to find block defaults.
 *
 * @param {string} clientId
 * @param {object} attributes
 *
 * @since 0.1.0
 *
 * @return {object} defaults
 */
export const findBlockDefaults = ( clientId : string, attributes : Attributes ) : Attributes => {
	const defaults : Attributes = {};

	if ( ! attributes.hasOwnProperty( 'style' ) ) {
		return {};
	}

	defaults[ clientId ] = cloneDeep( sanitizeAttributes( attributes ) );

	return defaults;
}


/**
 * Set function to find block saves.
 *
 * @param {string} clientId
 * @param {object} attributes
 *
 * @since 0.1.0
 *
 * @return {object} saves
 */
export const findBlockSaves = ( clientId : string, attributes : Attributes ) : Attributes => {
	const saves : Attributes = {};

	if ( attributes.hasOwnProperty( 'viewports' ) && 'undefined' !== typeof attributes.viewports ) {
		saves[ clientId ] = cloneDeep( attributes.viewports );
	}

	return saves;
}


/**
 * Set function to clear empty saves.
 *
 * @param {object} saves
 *
 * @since 0.1.0
 *
 * @return {object} cleaned
 */
export const clearEmptySaves = ( saves : Attributes ) : Attributes => {
	if ( ! Object.keys( saves ).length ) {
		return {};
	}

	let cleared : Attributes = {};

	// Iterate over save entries.
	for ( const [ dirtyViewport, { style } ] of Object.entries( saves ) ) {

		// Check if we have viewport styles.
		if ( isObject( style ) && Object.keys( style ).length ) {
			const viewport = parseInt( dirtyViewport );
			const clearedProperties = clearEmptyProperties( style );

			// Check if we have viewport style properties.
			if( Object.keys( clearedProperties ).length ) {

				// Check if we need to add viewport.
				if( ! cleared.hasOwnProperty( viewport ) ) {
					cleared[ viewport ] = {
						style: {},
					};
				}

				// Set cleared properties.
				cleared[ viewport ][ 'style' ] = { ... clearedProperties };
			}
		}
	}

	return cleared;
}


/**
 * Set function to clear empty properties.
 *
 * @param {object} saves
 *
 * @since 0.2.5
 *
 * @return {object} cleaned
 */
export const clearEmptyProperties = ( properties : Styles ) : Styles => {
	let cleared : Styles = {};

	// Iterate over style properties.
	for ( const [ property, styles ] of Object.entries( properties ) ) {
		if ( styles && isObject( styles ) && Object.keys( styles ).length ) {

			// Iterate over styles.
			for ( const [ key, value ] of Object.entries( styles ) ) {

				// Clear empty array.
				if( Array.isArray( value ) && ! value.length ) {
					continue;
				}

				// Clear empty object.
				if( isObject( value ) && ! Object.keys( value ) ) {
					continue;
				}

				// Set property.
				if( ! cleared.hasOwnProperty( property ) ) {
					cleared[ property ] = {};
				}

				// Set key value pairs.
				cleared[ property ][ key ] = value;
			}
		}
	}

	return cleared;
}


/**
 * Set function to clear empty saves.
 *
 * @param {object} saves
 *
 * @since 0.1.0
 *
 * @return {object} cleaned
 */
export const clearDuplicateSaves = ( saves : Attributes ) : Attributes => {
	var valids : Attributes = {};
	var cleared : Attributes = {};

	for( const [ dirtyViewport, styles ] of Object.entries( saves ) ) {
		const viewport = parseInt( dirtyViewport );

		if( ! styles.hasOwnProperty( 'style' ) ) {
			continue;
		}

		for( const [ property, style ] of Object.entries( styles[ 'style' ] ) ) {
			if( valids.hasOwnProperty( property ) && isEqual( valids[ property ], style ) ) {
				continue;
			}

			if( ! cleared.hasOwnProperty( viewport ) ){
				cleared[ viewport ] = {
					style: {}
				};
			}

			cleared[ viewport ][ 'style' ][ property ] = cloneDeep( style );
			valids[ property ] = cloneDeep( style );
		}
	}

	return cleared;
}


/**
 * Set function to find changes in block.
 *
 * @param {integer} viewport
 * @param {string}  clientId
 * @param {object}  attributes
 * @param {object}  state
 *
 * @since 0.1.0
 *
 * @return {object} changes
 */
export const findBlockChanges = ( viewport : number, clientId : string, attributes : Attributes, state : State ) : Attributes => {
	const valids = findBlockValids( clientId, state );

	const style = attributes.hasOwnProperty( 'style' ) && isObject( attributes[ 'style' ] ) ? cloneDeep( attributes[ 'style' ] ) : {};
	const valid = valids.hasOwnProperty( viewport ) &&
				  valids[ viewport ].hasOwnProperty( 'style' ) &&
				  isObject( valids[ viewport ]['style'] ) ?
				  cloneDeep( valids[ viewport ][ 'style' ] ) : {};

	return findObjectChanges( style, valid );
}


/**
 * Set function to find block valids.
 *
 * @param {string} clientId
 * @param {object} state
 *
 * @since 0.1.0
 *
 * @return {object} valids
 */
export const findBlockValids = ( clientId : string, state : State ) : Attributes => {
	const { saves, changes, viewports } = state;

	const blockSaves = saves.hasOwnProperty( clientId ) ? cloneDeep( saves[ clientId ] ) : {};
	const blockChanges = changes.hasOwnProperty( clientId ) ? cloneDeep( changes[ clientId ] ) : {};

	const blockValids : Attributes = {
		0: {},
	};

	let last = 0;
	for ( const [ dirty ] of Object.entries( viewports ) ) {
		let viewport = parseInt( dirty );

		if ( blockSaves.hasOwnProperty( viewport ) ) {
			if ( blockChanges.hasOwnProperty( viewport ) ) {
				blockValids[ viewport ] = getMergedAttributes( blockValids[ last ], blockSaves[ viewport ], blockChanges[ viewport ] );
			} else {
				blockValids[ viewport ] = getMergedAttributes( blockValids[ last ], blockSaves[ viewport ] );
			}
		} else {
			if ( blockChanges.hasOwnProperty( viewport ) ) {
				blockValids[ viewport ] = getMergedAttributes( blockValids[ last ], blockChanges[ viewport ] );
			} else {
				blockValids[ viewport ] = cloneDeep( blockValids[ last ] );
			}
		}

		last = viewport;
	}

	return blockValids;
}


/**
 * Set function to find object changes.
 *
 * @param {object} attributes
 * @param {object} valids
 *
 * @since 0.1.0
 *
 * @return {object} changes
 */
export const findObjectChanges = ( attributes : Attributes, valids : Attributes ) : Attributes => {
	let changes : Attributes = {};

	if( null === attributes ) {
		return {};
	}

	// Iterate through attributes.
	for ( const [ attributeKey, attributeValue ] of Object.entries( attributes ) ) {
		const validValue = valids.hasOwnProperty( attributeKey ) ? valids[ attributeKey ] : undefined;

		if( isEqual( attributeValue, validValue ) ) {
			continue;
		}

		if ( isObject( attributeValue ) && isObject( validValue ) ) {
			let subChanges = findObjectChanges( attributeValue, validValue );

			if ( 0 < Object.keys( subChanges ).length ) {
				changes[ attributeKey ] = { ... subChanges };
			}

			continue;
		}

		if ( isObject( attributeValue ) ) {
			changes[ attributeKey ] = { ... attributeValue };
		} else if ( Array.isArray( attributeValue ) ) {
			changes[ attributeKey ] = [ ... attributeValue ];
		} else {
			changes[ attributeKey ] = attributeValue;
		}
	}

	return changes;
}


/**
 * Set function to find removes by keys array.
 *
 * @param {array}  keys
 * @param {object} compare
 *
 * @since 0.1.0
 *
 * @return {object} removes
 */
export const findRemoves = ( keys : Attributes, compare : Attributes ) : Attributes => {
	const result : Attributes = {};
	const key : string = keys.shift();

	if ( compare.hasOwnProperty( key ) ) {
		compare = compare[ key ];
		result[ key ] = {};
	} else {
		return {};
	}

	if ( 0 === keys.length && isObject( compare ) ) {
		result[ key ] = compare;
		return result;
	}

	if ( isObject( compare ) ) {
		result[ key ] = findRemoves( keys, compare );
	} else {
		result[ key ] = compare;
	}

	return result;
}


/**
 * Set function to find cleaned changes with removes.
 *
 * @param {object} attributes
 * @param {object} removes
 *
 * @since 0.1.0
 *
 * @return {object} cleaned
 */
export const findCleanedChanges = ( attributes : Attributes, removes : Attributes ) : Attributes => {
	const cleaned = {};

	if ( isEqual( attributes, removes ) ) {
		return cleaned;
	}

	for ( const [ attributeKey, attributeValue ] of Object.entries( attributes ) ) {
		if ( ! removes.hasOwnProperty( attributeKey ) ) {
			cleaned[ attributeKey ] = attributeValue;
			continue;
		}

		const removeValue = removes[ attributeKey ];

		if ( isObject( attributeValue ) && isObject( removeValue ) ) {
			cleaned[ attributeKey ] = findCleanedChanges( attributeValue, removeValue );
		}
	}

	return cleaned;
}


/**
 * Set function to return spectrumSet from new generator.
 *
 * @param {string} clientId
 * @param {SpectrumState} state
 *
 * @since 0.2.5
 *
 * @return {SpectrumProperties}
 */
export const getSpectrumProperties = ( clientId : string, state : SpectrumState ) : SpectrumProperties => {

	// Set styles generator and get spectrumSet.
	const generator = new Generator( clientId, state );

	// Return properties.
	return {
		css: generator.getCSSViewportSet(),
		spectrumSet: generator.getSpectrumSet(),
		inlineStyle: generator.getInlineStyle(),
	}
}
