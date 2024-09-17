import { isObject, getMergedAttributes, traverseGet, traverseExist } from '../utils';
import { Generator } from './generator';
import type { Attributes } from '../utils';
import type { Styles, SpectrumState, SpectrumProperties, State, ViewportStyle, ViewportStyleSet, BlockDifferences } from './types';

const { isEqual, cloneDeep, isEmpty, isUndefined, isNull } = window[ 'lodash' ];

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
 * Set function to find highest viewport from viewportStyle.
 *
 * @param {string} property
 * @param {number} actionViewport
 * @param {ViewportStyle} viewportStyle
 *
 * @since 0.2.13
 *
 * @return {number} viewport
 */
export const findHighestPropertyViewportStyle = ( property : string, actionViewport: number, viewportStyle : ViewportStyle ) : number => {

	// Reverse Iteration to get the latest from iframeViewport on.
	const viewportsSaves = Object.keys( viewportStyle ).reverse();

	// Iterate over changes to check property to remove.
	for( const dirtyViewport of viewportsSaves ) {
		let viewport = parseInt( dirtyViewport );

		if( viewport > actionViewport ) {
			continue;
		}

		if( traverseExist( [ viewport, 'style', property ], viewportStyle ) ) {
			return viewport;
		}
	}

	return 0;
}


/**
 * Set function to cleanu an object.
 *
 * @param {T} obj
 *
 * @since 0.2.15
 *
 * @return {T}
 */
export const cleanupObject = <T extends object>( obj : T ) : T => {
	for( const [ property, value ] of Object.entries( obj ) ) {
		if( isNull( value ) || isUndefined( value ) ) {
			delete obj[ property ];
			continue;
		}

		if( isObject( value ) ) {
			obj[ property ] = cleanupObject( value );
		} else if( Array.isArray( value ) ) {
			obj[ property ] = cleanupArray( value );
		}
	}

	return obj;
}


/**
 * Set function to cleanup an array.
 *
 * @param {T} arr
 *
 * @since 0.2.15
 *
 * @return {T}
 */
export const cleanupArray = <T extends Array<any>>( arr : T ) : T => {
	for( let i = 0; i < arr.length; i++ ) {
		const value = arr[ i ];

		if( isNull( value ) || isUndefined( value ) ) {
			continue;
		}

		if( isObject( value ) ) {
			arr[ i ] = cleanupObject( value );
		} else if( Array.isArray( value ) ) {
			arr[ i ] = cleanupArray( value );
		} else {
			arr[ i ] = value;
		}
	}

	return arr;
}


/**
 * Set function to find differences in block styles.
 *
 * @param {string} clientId
 * @param {Attributes} attributes
 * @param {State} state
 * @param {number} actionViewport
 *
 * @since 0.2.11
 *
 * @return {BlockDifferences}
 */
export const findBlockDifferences = ( clientId : string, attributes : Attributes, state : State, actionViewport : number ) : BlockDifferences => {

	// Deconstruct plain from state.
	const {
		iframeViewport,
		isEditing,
	} = state;

	// Set selected viewport.
	const selectedViewport = actionViewport ? actionViewport : iframeViewport ? iframeViewport : 0;

	// Set styles from attributes.
	const styles = cloneDeep( traverseGet( [ 'style' ], attributes) ) || {} as Styles;

	// Set next block states.
	const nextBlockValids = cloneDeep( traverseGet( [ clientId ], state.valids ) ) || {};
	const nextBlockChanges = cloneDeep( traverseGet( [ clientId ], state.changes ) ) || {};
	const nextBlockRemoves = cloneDeep( traverseGet( [ clientId ], state.removes ) ) || {};
	const nextBlockSaves = cloneDeep( traverseGet( [ clientId ], state.saves ) ) || {};


	/**
	 * Set function to cleanup viewport styles.
	 *
	 * @since 0.2.13
	 */
	const cleanupViewportStyles = () => {

		// Set viewports to iterate over.
		const viewportsChanges = Object.keys( nextBlockChanges );
		const viewportsRemoves = Object.keys( nextBlockRemoves );

		// Set empty result.
		const result = {
			changes: {},
			removes: {},
		} as BlockDifferences;

		// Iterate over viewports to clear empty changes.
		for( const viewport of viewportsChanges ) {
			const viewportStyles = traverseGet( [ viewport, 'style' ], nextBlockChanges, undefined );

			// Set changes if viewportStyles filled.
			if( ! isUndefined( viewportStyles ) && ! isNull( viewportStyles ) && ( ! isObject( viewportStyles ) || ( isObject( viewportStyles ) && ! isEmpty( viewportStyles ) ) ) ) {

				if( ! traverseExist( [ clientId ], result.changes ) ) {
					result.changes[ clientId ] = {
						[ viewport ]: {
							style: {
								... viewportStyles,
							}
						}
					};

					continue;
				}

				if( ! traverseExist( [ clientId, viewport ], result.changes ) ) {
					result.changes[ clientId ][ viewport ] = {
						style: viewportStyles,
					};

					continue;
				}

				result.changes[ clientId ][ viewport ][ 'style' ] = viewportStyles;
			}
		}

		// Iterate over viewports to clear empty removes.
		for( const viewport of viewportsRemoves ) {
			const viewportStyles = traverseGet( [ viewport, 'style' ], nextBlockRemoves, undefined );

			// Set removes if viewportStyles filled.
			if( ! isUndefined( viewportStyles ) && ! isNull( viewportStyles ) && ( ! isObject( viewportStyles ) || ( isObject( viewportStyles ) && ! isEmpty( viewportStyles ) ) ) ) {

				if( ! traverseExist( [ clientId ], result.removes ) ) {
					result.removes[ clientId ] = {
						[ viewport ]: {
							style: viewportStyles,
						}
					};

					continue;
				}

				if( ! traverseExist( [ clientId, viewport ], result.removes ) ) {
					result.removes[ clientId ][ viewport ] = {
						style: viewportStyles,
					};

					continue;
				}

				result.removes[ clientId ][ viewport ][ 'style' ] = viewportStyles;
			}
		}

		return cleanupObject( result );
	}


	// Set viewport relating blockValids.
	const viewportValids = traverseGet( [ selectedViewport, 'style' ], nextBlockValids, undefined ) as Styles;

	// Check if we get a viewport valid.
	if( isUndefined( viewportValids ) || isNull( viewportValids ) ) {
		console.error( 'You tried to change styles without having a valid viewport' );

		return cleanupViewportStyles();
	}

	// Set property lists.
	const stylesPropertyList = getViewportStyleProperties( { 0: { style: styles } } );
	const validsPropertyList = getViewportStyleProperties( nextBlockValids );
	const removesPropertyList = getViewportStyleProperties( nextBlockRemoves );

	// Set property list from valids, removes and styles.
	const properties = Array.from( new Set( [ ... validsPropertyList, ... removesPropertyList, ... stylesPropertyList ] ) );
	// console.log( 'properties', validsPropertyList, removesPropertyList, stylesPropertyList );


	/**
	 * Set function to reset property.
	 *
	 * @since 0.2.13
	 */
	const resetProperty = ( property ) => {

		// Reverse Iteration to get the latest from iframeViewport on.
		const viewportsSaves = Object.keys( nextBlockSaves ).reverse();

		// Iterate over changes to check property to remove.
		for( const viewport of viewportsSaves ) {

			// Skip all viewports above iframeViewport to ignore.
			if( parseInt( viewport ) > iframeViewport ) {
				continue;
			}

			// Check if there are changes for the property.
			let nextPropertySaves = traverseGet( [ viewport, 'style', property ], nextBlockSaves );
			if( ! nextPropertySaves ) {
				continue;
			}

			// Set nextBlockRemoves.
			if( ! traverseExist( [ viewport ], nextBlockRemoves ) ) {
				nextBlockRemoves[ viewport ] = {
					style: {
						[ property ]: nextPropertySaves,
					}
				}

				continue;
			}

			if( ! traverseExist( [ viewport, 'style' ], nextBlockRemoves ) ) {
				nextBlockRemoves[ viewport ][ 'style' ] = {
					[ property ]: nextPropertySaves,
				}

				continue;
			}

			nextBlockRemoves[ viewport ][ 'style' ][ property ] = nextPropertySaves;
		}

		// Reverse Iteration to get the latest from iframeViewport on.
		const viewportsChanges = Object.keys( nextBlockChanges ).reverse();

		// Iterate over changes to check property to remove.
		for( const viewport of viewportsChanges ) {

			// Skip all viewports above iframeViewport to ignore.
			if( parseInt( viewport ) > iframeViewport ) {
				continue;
			}

			// Check if there are changes for the property.
			let nextPropertyChanges = traverseGet( [ viewport, 'style', property ], nextBlockChanges );
			if( ! nextPropertyChanges ) {
				continue;
			}

			// Remove property from changes.
			delete nextBlockChanges[ viewport ][ 'style' ][ property ];
		}
	}


	/**
	 * Set function to change property value.
	 *
	 * @since 0.2.13
	 */
	const changePropertyValue = ( property, value ) => {
		const changesViewport = isEditing ? iframeViewport : findHighestPropertyViewportStyle( property, iframeViewport, nextBlockChanges );
		const savesViewport = isEditing ? iframeViewport : findHighestPropertyViewportStyle( property, iframeViewport, nextBlockSaves );

		// Set highest viewport valid for propery.
		let viewport = 0;
		if( changesViewport >= savesViewport ) {
			viewport = changesViewport;
		}
		if( savesViewport > changesViewport ) {
			viewport = savesViewport;
		}

		// Set value to cut with into states.
		let changeValue = traverseGet( [ property ], value );

		// Set values from removes.
		let changesValue = traverseGet( [ viewport, 'style', property ], nextBlockChanges );
		let removesValue = traverseGet( [ viewport, 'style', property ], nextBlockRemoves );
		let savesValue = traverseGet( [ viewport, 'style', property ], nextBlockSaves );

		// Check if we need to kill removes occuring in changeValue.
		if( ! isNull( removesValue ) ) {
			removesValue = findObjectDifferences( removesValue, changeValue );

			if( ! isEmpty( removesValue ) ) {
				nextBlockRemoves[ viewport ][ 'style' ][ property ] = removesValue;
			} else {
				delete nextBlockRemoves[ viewport ][ 'style' ][ property ];
			}

			// Set values from saves.
			let saveValue = traverseGet( [ viewport, 'style', property ], nextBlockSaves );
			if( ! isNull( saveValue ) ) {
				changeValue = findChanges( changeValue, saveValue );

				if( isEmpty( changeValue ) ) {
					changeValue = saveValue;
				}
			}
		}

		if( ! isEmpty( changesValue ) ) {
			changeValue = findChanges( changeValue, changesValue );
		} else if( ! isEmpty( savesValue ) ) {
			changeValue = findChanges( changeValue, savesValue );
		}

		if( ! isEmpty( changeValue ) ) {
			if( ! nextBlockChanges.hasOwnProperty( viewport ) ) {
				nextBlockChanges[ viewport ] = {
					style: {
						[ property ]: changeValue,
					}
				}
			} else {
				if( ! nextBlockChanges[ viewport ].hasOwnProperty( 'style' ) ) {
					nextBlockChanges[ viewport ][ 'style' ] = {
						[ property ]: changeValue,
					}
				} else {
					const nextChanges = nextBlockChanges[ viewport ][ 'style' ][ property ];

					if( isObject( nextChanges ) && isObject( changeValue ) ) {
						nextBlockChanges[ viewport ][ 'style' ][ property ] = getMergedAttributes( nextBlockChanges[ viewport ][ 'style' ][ property ], changeValue );
					} else {
						nextBlockChanges[ viewport ][ 'style' ][ property ] = changeValue;
					}
				}
			}
		}
	}


	/**
	 * Set function to remove property value.
	 *
	 * @since 0.2.13
	 */
	const removePropertyValue = ( property, value ) => {
		const removeValue = traverseGet( [ property ], value );

		// Reverse Iteration to get the latest from iframeViewport on.
		const viewportsChanges = Object.keys( nextBlockChanges ).reverse();

		// Iterate over changes to check property to remove.
		for( const viewport of viewportsChanges ) {

			// Skip all viewports above iframeViewport to ignore.
			if( parseInt( viewport ) > iframeViewport ) {
				continue;
			}

			// Check if there are changes for the property.
			let nextPropertyChanges = traverseGet( [ viewport, 'style', property ], nextBlockChanges, undefined );
			if( ! nextPropertyChanges ) {
				continue;
			}

			nextPropertyChanges = findObjectChanges( { [ property ]: nextPropertyChanges }, { [ property ]: removeValue } );

			if( nextPropertyChanges.hasOwnProperty( property ) ) {
				nextBlockChanges[ viewport ][ 'style' ][ property ] = nextPropertyChanges[ property ];
			} else {
				delete nextBlockChanges[ viewport ][ 'style' ][ property ];
			}
		}

		// Reverse Iteration to get the latest from iframeViewport on.
		const viewportsSaves = Object.keys( nextBlockSaves ).reverse();

		// Iterate over changes to check property to remove.
		for( const viewport of viewportsSaves ) {

			// Skip all viewports above iframeViewport to ignore.
			if( parseInt( viewport ) > iframeViewport ) {
				continue;
			}

			// Check if there are savess for the property.
			let nextPropertySaves = traverseGet( [ viewport, 'style', property ], nextBlockSaves );
			if( ! nextPropertySaves ) {
				continue;
			}

			// Set nextBlockRemoves.
			if( ! traverseExist( [ viewport ], nextBlockRemoves ) ) {
				nextBlockRemoves[ viewport ] = {
					style: {
						[ property ]: fillObjectProperties( removeValue, nextPropertySaves ),
					}
				}

				continue;
			}

			if( ! traverseExist( [ viewport, 'style' ], nextBlockRemoves ) ) {
				nextBlockRemoves[ viewport ][ 'style' ] = {
					[ property ]: fillObjectProperties( removeValue, nextPropertySaves ),
				}

				continue;
			}

			nextBlockRemoves[ viewport ][ 'style' ][ property ] = fillObjectProperties( removeValue, nextPropertySaves );
		}
	}


	/**
	 * Set function to fill object properties from another object.
	 *
	 * @since 0.2.13
	 */
	const fillObjectProperties = ( fillObject, getObject ) => {

		// Iterate through fillObject to fill it with data from getObject.
		for ( const [ property, fillValue ] of Object.entries( fillObject ) ) {

			// Check if we get at least any value from getObject.
			const getValue = traverseGet( [ property ], getObject, undefined );
			if( isUndefined( getValue ) ) {
				continue;
			}

			// Check if both values needs to get filled recursively.
			if ( isObject( fillValue ) && isObject( getValue ) ) {

				let subFills = fillObjectProperties( fillValue, getValue );

				if ( 0 < Object.keys( subFills ).length ) {
					fillObject[ property ] = { ... subFills };
				}

				continue;
			}

			fillObject[ property ] = getValue;
		}

		return fillObject;
	}


	// Iterate over properties to compare to each state.
	for( let index = 0; index < properties.length; index++ ) {
		const property = properties[ index ];

		// Set values by property for each blockState.
		const stylesValue = cloneDeep( traverseGet( [ property ], styles, undefined ) );
		const validsValue = cloneDeep( traverseGet( [ property ], viewportValids, undefined ) );

		// Set flags to indicate define.
		const definedStyles = ! isUndefined( stylesValue ) && ! isNull( stylesValue ) && ( ! isObject( stylesValue ) || ( isObject( stylesValue ) && ! isEmpty( stylesValue ) ) );
		const definedValids = ! isUndefined( validsValue ) && ! isNull( validsValue ) && ( ! isObject( validsValue ) || ( isObject( validsValue ) && ! isEmpty( validsValue ) ) );

		// If both is undefined, the properties origin is the remove state, so we continue to next property.
		if( ! definedStyles && ! definedValids ) {
			// console.log( '! definedStyles && ! definedValids', property );
			continue;
		}

		// If only validsValue is defined, this seems to be a full reset of the property.
		if( ! definedStyles ) {
			// console.log( 'resetProperty', property );
			resetProperty( property );
			continue;
		}

		// Find object changes between style and valid state in both directions to also find removings from valids.
		const changeDifferenceValue = findObjectChanges( { [ property ]: stylesValue }, { [ property ]: validsValue } );
		const removeDifferenceValue = findObjectChanges( { [ property ]: validsValue }, { [ property ]: stylesValue } );

		// If both difference values are empty, we can skip.
		if(
			isEmpty( changeDifferenceValue ) &&
			isEmpty( removeDifferenceValue )
		) {
			// console.log( 'empty changeDifferenceValue & removeDifferenceValue', property, changeDifferenceValue, removeDifferenceValue, stylesValue, validsValue );
			continue;
		}

		if( isEmpty( changeDifferenceValue ) ) {
			removePropertyValue( property, removeDifferenceValue );
			// console.log( 'remove property', property, changeDifferenceValue, removeDifferenceValue, nextBlockChanges, nextBlockRemoves );
			continue;
		} else {
			changePropertyValue( property, changeDifferenceValue );
			// console.log( 'change property', property, changeDifferenceValue, removeDifferenceValue, nextBlockChanges, nextBlockSaves );
			continue;
		}
	}

	// Cleanup before return.
	return cleanupViewportStyles();
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
	const { saves, changes, removes, viewports } = state;

	const blockSaves = traverseGet( [ clientId ], saves ) || {};
	const blockChanges = traverseGet( [ clientId ], changes ) || {};
	const blockRemoves = traverseGet( [ clientId ], removes ) || {};

	const blockValids : ViewportStyle = {
		0: {
			style: {},
		},
	};

	let last = 0;
	for( const [ viewportDirty ] of Object.entries( viewports ) ) {
		const viewport = parseInt( viewportDirty );
		const lastBlockValids = cloneDeep( blockValids[ last ] );

		if( blockSaves.hasOwnProperty( viewport ) && blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedAttributes( lastBlockValids, blockSaves[ viewport ], blockChanges[ viewport ] );
		} else if( blockSaves.hasOwnProperty( viewport ) && ! blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedAttributes( lastBlockValids, blockSaves[ viewport ] );
		} else if( ! blockSaves.hasOwnProperty( viewport ) && blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedAttributes( lastBlockValids, blockChanges[ viewport ] );
		} else {
			blockValids[ viewport ] = lastBlockValids;
		}

		// At last we filter out difference between valids and removes.
		if( blockRemoves.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = findObjectDifferences( blockValids[ viewport ], blockRemoves[ viewport ] );

			if( isEmpty( blockValids[ viewport ] ) ) {
				blockValids[ viewport ] = { style: {} };
			}
		}

		last = viewport;
	}

	return blockValids;
}


/**
 * General function to find changes between two values (arrays or objects).
 *
 * @param {any} current - The current value state.
 * @param {any} original - The original value state.
 *
 * @since 0.2.15
 *
 * @return {any} changes - Detected changes.
 */
const findChanges = ( current: any, original: any ) : any => {
	if( Array.isArray( current ) && Array.isArray( original ) ) {
		return [ ... current ];
	} else if ( isObject( current ) && isObject( original ) ) {
		return findObjectChanges( current, original );
	} else if ( ! isEqual( current, original ) ) {
		return current; // Primitive or non-equal types
	}

	return undefined; // No changes detected
};


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


type DeepPartial<T> = T extends (infer U)[] // Falls T ein Array ist
  ? DeepPartial<U>[] // Wendet DeepPartial rekursiv auf den Typ der Elemente an
  : T extends object // Falls T ein Objekt ist
  ? { [K in keyof T]?: DeepPartial<T[K]> } // Wendet DeepPartial auf alle Schlüssel an
  : T; // Andernfalls gibt den Typ selbst zurück

/**
 * Funktion zur Ermittlung von Unterschieden zwischen zwei Objekten.
 *
 * @param {T} obj1 - Erstes Objekt
 * @param {T} obj2 - Zweites Objekt
 * @param {T} hard - Harter Vergleich zwischen
 *
 * @since 0.2.14
 *
 * @return {DeepPartial<T>} - Unterschiede zwischen obj1 und obj2
 */
export const findObjectDifferences = <T extends Record<string, any> | any[]>( obj1: T, obj2: T, hard: boolean = false ): DeepPartial<T> => {

	// Typanpassung für result, um es als DeepPartial<T> zu behandeln.
	const result = ( Array.isArray( obj1 ) ? [] : {} ) as DeepPartial<T>;

	for( const key in obj1 ) {
		if( obj1.hasOwnProperty( key ) ) {
			if( obj2.hasOwnProperty( key ) ) {
				if( typeof obj1[ key ] === 'object' && obj1[ key ] !== null && typeof obj2[ key ] === 'object' && obj2[ key ] !== null ) {
					const diff = findObjectDifferences( obj1[ key ], obj2[ key ] );

					if( Object.keys( diff ).length > 0 ) {
						( result as any )[ key ] = diff;
					}
				} else if( hard && obj1[ key ] !== obj2[ key ] ) {
					( result as any ) [ key ] = obj1[ key ];
				}
			} else {
				( result as any ) [ key ] = obj1[ key ];
			}
		}
	}

	return result;
};


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


/**
 * Set function to return propertyList from viewportStyle.
 *
 * @param {viewportStyle} viewportStyle
 *
 * @since 0.2.13
 *
 * @return {Array<string | number>}
 */
export const getViewportStyleProperties = ( viewportStyle: ViewportStyle ) : Array<string | number> => {

	// Initialize a Set to store unique keys
	const allKeys = new Set<string | number>();

	// Iterate over each style within the viewport
	for( const styleKey in viewportStyle ) {
		if( viewportStyle.hasOwnProperty( styleKey ) ) {
			const styleObject = viewportStyle[ styleKey ].style;

			// Get all the properties from the Styles object and add to the Set
			Object.keys( styleObject ).forEach( ( key ) => {
				allKeys.add( key );
			} );
		}
	}

	// Convert the Set to an Array and return it
	return Array.from( allKeys );
};