import { isObject, getMergedAttributes, traverseGet, traverseExist } from '../utils';
import { Generator } from './generator';
import type { Attributes } from '../utils';
import type { Styles, SpectrumState, SpectrumProperties, State, ViewportStyle, ViewportStyleSet, BlockDifferences } from './types';

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
 * @param {object} viewports
 *
 * @since 0.1.0
 *
 * @return {integer} highest viewport
 */
export const getHighestPossibleViewport = ( viewports : object, width : number ) : number => {

	// Iterates over the viewports and returns the highest possible viewport
	// smaller than the iframe width.
	let highestViewport = 0;
	for ( const [ viewportDirty ] of Object.entries( viewports ) ) {
		const viewport = parseInt( viewportDirty );
		if ( viewport > width ) {
			break;
		}

		highestViewport = viewport;
	}

	return highestViewport;
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
 * Set function to find block saves.
 *
 * @param {string} clientId
 * @param {object} attributes
 *
 * @since 0.1.0
 *
 * @return {Attributes} saves
 */
export const findBlockSaves = ( attributes : Attributes ) : Attributes => {
	const style = traverseGet( [ 'style' ], attributes ) || {};

	let saves = {
		0: {
			style: cloneDeep( style ),
		}
	}

	const viewports = traverseGet( [ 'viewports' ], attributes ) || {}

	if( Object.keys( viewports ).length ) {
		saves = getMergedAttributes( saves, cloneDeep( viewports ) );
	}

	return saves;
}


/**
 * Set function to find differences in block styles.
 *
 * @param {string} clientId
 * @param {Attributes} attributes
 * @param {State} state
 *
 * @since 0.2.11
 *
 * @return {BlockDifferences}
 */
export const findBlockDifferences = ( clientId : string, attributes : Attributes, state : State, viewport : number ) : BlockDifferences => {

	// Set states.
	const isEditing = state.isEditing;
	const viewports = state.viewports;

	// Set state objects to get changes from.
	const style = traverseGet( [ 'style' ], attributes, {} );
	const valid = traverseGet( [ clientId, viewport, 'style' ], state.valids, {} );

	// Cleanup style output.
	const styleCleaned = 'undefined' !== typeof style && null !== style ? style : {};

	// Get all changes for actual valid viewport settings.
	const validChanges = findObjectChanges( cloneDeep( styleCleaned ), cloneDeep( valid ) );
	const validRemoves = findObjectChanges( cloneDeep( valid ), cloneDeep( styleCleaned ) );

	// Filter changes by property out of removes.
	if( 0 < Object.keys( validChanges ).length && 0 < Object.keys( validRemoves ).length ) {
		for( const property in validChanges ) {
			if( validRemoves.hasOwnProperty( property ) ) {
				delete validRemoves[ property ];
			}
		}
	}

	// Set initial blockChanges and blockRemoves.
	const blockChanges = {} as ViewportStyleSet;
	const blockRemoves = {} as ViewportStyleSet;

	// Check if we need to set on a specific viewport.
	if( isEditing ) {
		if( traverseExist( [ clientId, viewport, 'style' ], state.changes ) ) {
			blockChanges[ viewport ] = {
				style: {
					... state.changes[ clientId ][ viewport ].style,
					... validChanges,
				}
			}
		} else {
			blockChanges[ viewport ] = {
				style: validChanges,
			}
		}

		if( traverseExist( [ clientId, viewport, 'style' ], state.removes ) ) {
			blockRemoves[ viewport ] = {
				style: {
					... state.removes[ clientId ][ viewport ].style,
					... validRemoves,
				}
			}
		} else {
			blockRemoves[ viewport ] = {
				style: validRemoves,
			}
		}

	} else {

		// Iterate over valid changes to compare with its default viewport setting.
		for( const property in validChanges ) {
			if ( ! validChanges.hasOwnProperty( property ) ) {
				continue;
			}

			let lastViewport = 0;

			// Iterate over viewports to find saves viewport to map on changes.
			for( const viewportDirty in viewports ) {
				const compare = parseInt( viewportDirty );

				if( viewport < compare ) {
					continue;
				}

				if( traverseExist( [ clientId, compare, 'style', property ], state.saves ) ) {
					lastViewport = compare;
				}

				if( traverseExist( [ clientId, compare, 'style', property ], state.changes ) ) {
					lastViewport = compare;
				}
			}

			if( traverseExist( [ lastViewport, 'style' ], blockChanges ) ) {
				blockChanges[ lastViewport ] = {
					style: {
						... blockChanges[ lastViewport ].style,
						[ property ]: validChanges[ property ],
					}
				}

				continue;
			}

			blockChanges[ lastViewport ] = {
				style: {
					[ property ]: validChanges[ property ],
				}
			}
		}

		// Iterate over valid removes to compare with its default viewport setting.
		for( const property in validRemoves ) {
			if ( ! validRemoves.hasOwnProperty( property ) ) {
				continue;
			}

			let lastViewport = 0;

			// Iterate over viewports to find saves viewport to map on removes.
			for( const viewportDirty in viewports ) {
				const compare = parseInt( viewportDirty );

				if( viewport < compare ) {
					continue;
				}

				if( traverseExist( [ clientId, compare, 'style', property ], state.saves ) ) {
					lastViewport = compare;
				}
			}

			if( traverseExist( [ lastViewport, 'style' ], blockRemoves ) ) {
				blockRemoves[ lastViewport ] = {
					style: {
						... blockRemoves[ lastViewport ].style,
						[ property ]: validRemoves[ property ],
					}
				}

				continue;
			}

			blockRemoves[ lastViewport ] = {
				style: {
					[ property ]: validRemoves[ property ],
				}
			}
		}
	}

	if( 0 < Object.keys( blockChanges ).length ) {
		for( const viewportDirty in blockChanges ) {
			if ( ! blockChanges.hasOwnProperty( viewportDirty ) ) {
				continue;
			}

			if( 0 === Object.keys( traverseGet( [ 'style' ], blockChanges[ viewportDirty ], {} ) ).length ) {
				delete blockChanges[ viewportDirty ];
			}
		}
	}

	if( 0 < Object.keys( blockRemoves ).length ) {
		for( const viewportDirty in blockRemoves ) {
			if ( ! blockRemoves.hasOwnProperty( viewportDirty ) ) {
				continue;
			}

			if( 0 === Object.keys( traverseGet( [ 'style' ], blockRemoves[ viewportDirty ], {} ) ).length ) {
				delete blockRemoves[ viewportDirty ];
			}
		}
	}

	// Return blockChanges per viewport.
	return {
		changes: blockChanges,
		removes: blockRemoves,
	}
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

	const blockSaves = traverseGet( [ clientId ], saves ) || {};
	const blockChanges = traverseGet( [ clientId ], changes ) || {};

	const blockValids : ViewportStyle = {
		0: {
			style: {},
		},
	};

	let last = 0;
	for ( const [ viewportDirty ] of Object.entries( viewports ) ) {
		const viewport = parseInt( viewportDirty );
		const lastBlockValids = cloneDeep( blockValids[ last ] );

		if ( blockSaves.hasOwnProperty( viewport ) ) {
			if ( blockChanges.hasOwnProperty( viewport ) ) {
				blockValids[ viewport ] = getMergedAttributes( lastBlockValids, blockSaves[ viewport ], blockChanges[ viewport ] );
			} else {
				blockValids[ viewport ] = getMergedAttributes( lastBlockValids, blockSaves[ viewport ] );
			}
		} else {
			if ( blockChanges.hasOwnProperty( viewport ) ) {
				blockValids[ viewport ] = getMergedAttributes( lastBlockValids, blockChanges[ viewport ] );
			} else {
				blockValids[ viewport ] = lastBlockValids;
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

	if( null === attributes || 'undefined' === typeof attributes ) {
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

		if( isObject( attributeValue ) ) {
			changes[ attributeKey ] = { ... attributeValue };
		} else if( Array.isArray( attributeValue ) ) {
			changes[ attributeKey ] = [ ... attributeValue ];
		} else {
			changes[ attributeKey ] = attributeValue;
		}
	}

	return changes;
}


/**
 * Set function to find object similarities.
 *
 * @param {object} attributes
 * @param {object} valids
 *
 * @since 0.1.0
 *
 * @return {object} similarities
 */
export const findObjectSimilarities = ( attributes : Attributes, valids : Attributes ) : Attributes => {
	let similarities : Attributes = {};

	if( null === attributes ) {
		return {};
	}

	// Iterate through attributes.
	for ( const [ attributeKey, attributeValue ] of Object.entries( attributes ) ) {
		const validValue = valids.hasOwnProperty( attributeKey ) ? valids[ attributeKey ] : undefined;

		if( ! isEqual( attributeValue, validValue ) ) {
			continue;
		}

		if ( isObject( attributeValue ) && isObject( validValue ) ) {
			let subChanges = findObjectSimilarities( attributeValue, validValue );

			if ( 0 < Object.keys( subChanges ).length ) {
				similarities[ attributeKey ] = { ... subChanges };
			}

			continue;
		}

		if( isObject( attributeValue ) ) {
			similarities[ attributeKey ] = { ... attributeValue };
		} else if( Array.isArray( attributeValue ) ) {
			similarities[ attributeKey ] = [ ... attributeValue ];
		} else {
			similarities[ attributeKey ] = attributeValue;
		}
	}

	return similarities;
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

	for ( const [ attributeKey, attributeValue ] of Object.entries( cloneDeep( attributes ) ) ) {
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
