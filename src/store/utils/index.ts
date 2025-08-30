import { tabletBreakpoint, desktopBreakpoint } from '@viewports/store/default';
import { Generator } from '@viewports/store/generator';
import type {
	clientId,
	SpectrumState,
	SpectrumProperties,
	ViewportStyleSets,
	Viewports,
	viewportType,
	SpectrumSet,
} from '@viewports/types';

export * from './cleanupViewportSet';
export * from './cleanupViewportStyleSets';
export * from './collapseViewportSet';
export * from './collapseViewportSetProperty';
export * from './findRemoves';
export * from './findCleanedChanges';
export * from './findBlockSaves';
export * from './findBlockValids';
export * from './findBlockDifferences'
export * from './findViewportSetIterators';
export * from './findViewportSetOccurence';
export * from './findViewportStyle';
export * from './findViewportStylePath';
export * from './findViewportStyleProperties';
export * from './reverseViewportKeys';
export * from './updateBlockDifferences';
export * from './updateStyleProperty';

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
 * Set function to return in range function for given viewportType.
 *
 * @param {viewportType} viewportType
 *
 * @return {Function|null}
 */
export const getInRange = ( viewportType : viewportType ) : Function|null => {
	let inRange = null;

	switch( viewportType ) {
		case 'mobile' :
			inRange = isInMobileRange;
			break;

		case 'tablet' :
			inRange = isInTabletRange;
			break;

		case 'desktop' :
			inRange = isInDesktopRange;
			break;
	}

	return inRange;
}


/**
 * Set function to indicate whether spectrumSet has given viewportType.
 *
 * @param {viewportType} viewportType
 * @param {SpectrumSet} spectrumSet
 *
 * @return {boolean}
 */
export const hasSpectrumSetViewportType = ( viewportType : viewportType, spectrumSet : SpectrumSet ) : boolean =>  {
	const inRange = getInRange( viewportType );

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
