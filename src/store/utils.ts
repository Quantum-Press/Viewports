import {
	isObject,
	getMergedObject,
	traverseGet,
	traverseExist,
	cleanupObject,
	findObjectDifferences,
	findObjectChanges,
	findChanges,
} from '../utils';
import {
	tabletBreakpoint,
	desktopBreakpoint,
} from './default';
import { Generator } from './generator';
import type {
	clientId,
	BlockStyles,
	SpectrumState,
	SpectrumProperties,
	State,
	ViewportStyleSets,
	BlockDifferences,
	Viewports,
	viewportType,
	deviceType,
	SpectrumSet,
	BlockAttributes,
	AnyObject
} from '../types';

const {
	isEqual,
	cloneDeep,
	isEmpty,
	isUndefined,
	isNull
} = window[ 'lodash' ];

/**
 * Set function to indicate whether given viewport is in range of desktop size.
 *
 * @param {number} viewport
 *
 * @return {boolean} indication
 */
export const isInDesktopRange = ( viewport : number ) : boolean => {
	if ( viewport >= desktopBreakpoint ) {
		return true;
	}

	return false;
}


/**
 * Set function to indicate whether given viewport is in range of tablet size.
 *
 * @param {number} viewport
 *
 * @return {boolean} indication
 */
export const isInTabletRange = ( viewport : number ) : boolean => {
	if ( viewport >= tabletBreakpoint && viewport <= ( desktopBreakpoint - 1 ) ) {
		return true;
	}

	return false;
}


/**
 * Set function to indicate whether given viewport is in range of mobile size.
 *
 * @param {number} viewport
 *
 * @return {boolean} indication
 */
export const isInMobileRange = ( viewport : number ) : boolean => {
	if ( viewport <= ( tabletBreakpoint - 1 ) ) {
		return true;
	}

	return false;
}


/**
 * Set function to get the prev viewport from viewports.
 *
 * @param {number} viewport
 * @param {Viewports} viewports
 *
 * @return {number}
 */
export const getPrevViewport = ( viewport : number, viewports : Viewports ) : number => {
	let last = 0;

	for( const [ dirtyViewport ] of Object.entries( viewports ) ) {
		const checkViewport = parseInt( dirtyViewport );

		if( viewport === checkViewport ) {
			break;
		}

		last = checkViewport;
	}

	return last;
}


/**
 * Set function to get the next viewport from viewports.
 *
 * @param {number} viewport
 * @param {Viewports} viewports
 *
 * @return {number}
 */
export const getNextViewport = ( viewport : number, viewports : Viewports ) : number => {
	let next = 0;

	for( const [ dirtyViewport ] of Object.entries( viewports ) ) {
		const checkViewport = parseInt( dirtyViewport );

		next = checkViewport;

		if( viewport < checkViewport ) {
			break;
		}
	}

	return next;
}


/**
 * Set function to get the prev viewport from viewports.
 *
 * @param {viewportType} viewportType
 * @param {Viewports} viewports
 *
 * @return {Viewports}
 */
export const getViewports = ( viewportType : viewportType, viewports : Viewports ) : Viewports => {
	const cleaned = {};

	switch( viewportType ) {
		case '' :
			return viewports;

		case 'mobile' :
			for( const [ dirtyViewport, viewportLabel ] of Object.entries( viewports ) ) {
				const viewport = parseInt( dirtyViewport );

				if( 0 !== viewport && isInMobileRange( viewport ) ) {
					cleaned[ viewport ] = viewportLabel
				}
			}

			break;

		case 'tablet' :
			for( const [ dirtyViewport, viewportLabel ] of Object.entries( viewports ) ) {
				const viewport = parseInt( dirtyViewport );

				if( isInTabletRange( viewport ) ) {
					cleaned[ viewport ] = viewportLabel
				}
			}

			break;

		case 'desktop' :
			for( const [ dirtyViewport, viewportLabel ] of Object.entries( viewports ) ) {
				const viewport = parseInt( dirtyViewport );

				if( isInDesktopRange( viewport ) ) {
					cleaned[ viewport ] = viewportLabel
				}
			}

			break;
	}

	return cleaned;
}


/**
 * Set function to get the highest possible viewport for given width in px.
 *
 * @param {Viewports} viewports
 * @param {number} width
 *
 * @return {number} highest viewport
 */
export const getHighestPossibleViewport = ( viewports : Viewports, width : number ) : number => {

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
 * Set function to return in range function for given deviceType.
 *
 * @param {deviceType} deviceType
 *
 * @return {Function|null}
 */
export const getInRange = ( deviceType : deviceType ) : Function|null => {
	let inRange = null;

	switch( deviceType ) {
		case 'Mobile' :
			inRange = isInMobileRange;
			break;

		case 'Tablet' :
			inRange = isInTabletRange;
			break;

		case 'Desktop' :
			inRange = isInDesktopRange;
			break;
	}

	return inRange;
}


/**
 * Set function to indicate whether spectrumSet has given deviceType.
 *
 * @param {deviceType} deviceType
 * @param {SpectrumSet} spectrumSet
 *
 * @return {boolean}
 */
export const hasSpectrumSetViewportType = ( deviceType : deviceType, spectrumSet : SpectrumSet ) : boolean =>  {
	const inRange = getInRange( deviceType );

	let hasSpectrumSet = false;

	for( let index = 0; index < spectrumSet.length; index++ ) {
		const spectrum = spectrumSet[ index ];

		if( inRange( spectrum.from ) ) {
			hasSpectrumSet = true;
			break;
		}
	}

	return hasSpectrumSet;
}


/**
 * Set function to clear empty saves from ViewportStyleSets.
 *
 * @param {ViewportStyleSets} saves
 *
 * @return {ViewportStyleSets} cleaned saves
 */
export const clearEmptySaves = ( saves : ViewportStyleSets ) : ViewportStyleSets => {
	if ( ! Object.keys( saves ).length ) {
		return {};
	}

	let cleared : ViewportStyleSets = {};

	// Iterate over save entries.
	for ( const [ dirtyViewport, { style } ] of Object.entries( saves ) ) {

		// Check if we have viewport styles.
		if ( style && isObject( style ) && Object.keys( style ).length ) {
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
 * Set function to clear empty properties from BlockStyles.
 *
 * @param {BlockStyles} blockStyles
 *
 * @return {BlockStyles} cleaned
 */
export const clearEmptyProperties = ( blockStyles : BlockStyles ) : BlockStyles => {
	let cleared : BlockStyles = {};

	// Iterate over style properties.
	for ( const [ property, styles ] of Object.entries( blockStyles ) ) {
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

			continue;
		}

		// Set property if not empty.
		// #TODO Monitor if there will be arrays to iterate over.
		if( ! isEmpty( styles ) ) {
			cleared[ property ] = styles;
		}
	}

	return cleared;
}


/**
 * Set function to clear empty saves.
 *
 * @param {ViewportStyleSets} saves
 *
 * @return {ViewportStyleSets} cleaned saves
 */
export const clearDuplicateSaves = ( saves : ViewportStyleSets ) : ViewportStyleSets => {
	let valids : ViewportStyleSets = {};
	let cleared : ViewportStyleSets = {};

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
 * Set function to find block saves from BlockAttributes.
 *
 * @param {BlockAttributes} attributes
 *
 * @return {ViewportStyleSets} saves
 */
export const findBlockSaves = ( attributes : BlockAttributes ) : ViewportStyleSets => {
	const style = traverseGet( [ 'style' ], attributes ) || {};

	let saves = {
		0: {
			style: cloneDeep( style ),
		}
	}

	const viewports = traverseGet( [ 'viewports' ], attributes ) || {}

	if( Object.keys( viewports ).length ) {
		saves = getMergedObject( saves, cloneDeep( viewports ) );
	}

	return saves;
}


/**
 * Set function to find highest viewport from viewportStyle.
 *
 * @param {string} property
 * @param {number} actionViewport
 * @param {ViewportStyleSets} viewportStyle
 *
 * @return {number} viewport
 */
export const findHighestPropertyViewportStyle = ( property : string, actionViewport: number, viewportStyle : ViewportStyleSets ) : number => {

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
 * Set function to find differences in block styles.
 *
 * @param {clientId} clientId
 * @param {BlockAttributes} attributes
 * @param {State} state
 * @param {number} actionViewport
 *
 * @return {BlockDifferences}
 */
export const findBlockDifferences = ( clientId : clientId, attributes : BlockAttributes, state : State, actionViewport : number ) : BlockDifferences => {

	// Deconstruct plain from state.
	const {
		iframeViewport,
		isEditing,
	} = state;

	// Set selected viewport.
	const selectedViewport = actionViewport ? actionViewport : iframeViewport ? iframeViewport : 0;

	// Set styles from attributes.
	const styles = cloneDeep( traverseGet( [ 'style' ], attributes) ) || {} as BlockStyles;

	// Set next block states.
	const nextBlockValids = cloneDeep( traverseGet( [ clientId ], state.valids ) ) || {};
	const nextBlockChanges = cloneDeep( traverseGet( [ clientId ], state.changes ) ) || {};
	const nextBlockRemoves = cloneDeep( traverseGet( [ clientId ], state.removes ) ) || {};
	const nextBlockSaves = cloneDeep( traverseGet( [ clientId ], state.saves ) ) || {};


	/**
	 * Set function to cleanup viewport styles.
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
	const viewportValids = traverseGet( [ selectedViewport, 'style' ], nextBlockValids, undefined ) as BlockStyles;

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
						nextBlockChanges[ viewport ][ 'style' ][ property ] = getMergedObject( nextBlockChanges[ viewport ][ 'style' ][ property ], changeValue );
					} else {
						nextBlockChanges[ viewport ][ 'style' ][ property ] = changeValue;
					}
				}
			}
		}
	}


	/**
	 * Set function to remove property value.
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
 * Set function to find block valids from datastore.
 *
 * @param {clientId} clientId
 * @param {State} state
 *
 * @return {ViewportStyleSets} valids
 */
export const findBlockValids = ( clientId : string, state : State ) : ViewportStyleSets => {
	const { saves, changes, removes, viewports } = state;

	const blockSaves = traverseGet( [ clientId ], saves ) || {};
	const blockChanges = traverseGet( [ clientId ], changes ) || {};
	const blockRemoves = traverseGet( [ clientId ], removes ) || {};

	const blockValids : ViewportStyleSets = {
		0: {
			style: {},
		},
	};

	let last = 0;
	for( const [ viewportDirty ] of Object.entries( viewports ) ) {
		const viewport = parseInt( viewportDirty );
		const lastBlockValids = cloneDeep( blockValids[ last ] );

		if( blockSaves.hasOwnProperty( viewport ) && blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedObject( lastBlockValids, blockSaves[ viewport ], blockChanges[ viewport ] );
		} else if( blockSaves.hasOwnProperty( viewport ) && ! blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedObject( lastBlockValids, blockSaves[ viewport ] );
		} else if( ! blockSaves.hasOwnProperty( viewport ) && blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedObject( lastBlockValids, blockChanges[ viewport ] );
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
 * Set function to find removes by keys array.
 *
 * @param {Array<string>}  keys
 * @param {T} compare
 *
 * @return {T} removes
 */
export const findRemoves = <T extends AnyObject>(keys: Array<string>, compare: T ) : T => {
	const result = {} as T;
	const key: string | undefined = keys.shift();

	// Check if there is no key to return.
	if( ! key || ! compare.hasOwnProperty( key ) ) {
		return {} as T;
	}

	let nextCompare = compare[key];

	// If there are no keys left to iterate over, return result.
	if( keys.length === 0 && isObject( nextCompare ) ) {
		result[ key as keyof T ] = nextCompare;
		return result;
	}

	// Wenn der Wert ein Objekt ist, rekursiv fortfahren
	if( isObject( nextCompare ) ) {
		result[ key as keyof T ] = findRemoves( keys, nextCompare );
	} else {
		result[ key as keyof T ] = nextCompare;
	}

  return result;
};



/**
 * Set function to find cleaned changes with removes.
 *
 * @param {T} attributes
 * @param {T} removes
 *
 * @return {T} cleaned
 */
export const findCleanedChanges = <T extends AnyObject>(attributes: T, removes: T): T => {
	const cleaned: T = {} as T;

	if ( isEqual( attributes, removes ) ) {
		return cleaned;
	}

	for ( const [ attributeKey, attributeValue ] of Object.entries( cloneDeep( attributes ) ) ) {
		if ( ! removes.hasOwnProperty( attributeKey ) ) {
			cleaned[ attributeKey as keyof T ] = attributeValue;
			continue;
		}

		const removeValue = removes[ attributeKey ];

		if ( isObject( attributeValue ) && isObject( removeValue ) ) {
			cleaned[ attributeKey as keyof T ] = findCleanedChanges( attributeValue, removeValue );
		}
	}

	return cleaned;
}


/**
 * Set function to return spectrumSet from new generator.
 *
 * @param {clientId} clientId
 * @param {string} blockName
 * @param {SpectrumState} spectrumState
 *
 * @return {SpectrumProperties}
 */
export const getSpectrumProperties = ( clientId : clientId, blockName : string, spectrumState : SpectrumState ) : SpectrumProperties => {

	// Set styles generator and get spectrumSet.
	const generator = new Generator( clientId, blockName, spectrumState );

	// Return properties.
	return {
		cssViewportSet: generator.getCSSViewportSet(),
		spectrumSet: generator.getSpectrumSet(),
		inlineStyle: generator.getInlineStyle(),
	}
}


/**
 * Set function to return propertyList from viewportStyle.
 *
 * @param {ViewportStyleSets} viewportStyle
 *
 * @return {Array<string | number>}
 */
export const getViewportStyleProperties = ( viewportStyle: ViewportStyleSets ) : Array<string | number> => {

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