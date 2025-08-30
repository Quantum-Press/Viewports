import {
	ViewportSet,
	ViewportSetIterators,
	ViewportSetOccurence,
} from "@viewports/types";
import {
	isNumeric,
	sortViewportArray,
	uniqueArray
} from "@viewports/utils";


/**
 * Set function to find highest viewport occurences from viewportSet by given value.
 *
 * @param {ViewportSet} viewportSet
 * @param {boolean} reverse
 *
 * @return {number} viewport
 */
export const findViewportSetIterators = (
	viewportSet : ViewportSet | ViewportSetOccurence,
	reverse : boolean = true,
) : ViewportSetIterators => {

	const collectViewports = [];
	const collectMaxWidths = [];

	// Iterate over viewportSet.
	for( const viewportDirty of Object.keys( viewportSet ) ) {
		if( isNumeric( viewportDirty ) ) {
			const viewport = parseInt( viewportDirty as string );

			collectViewports.push( viewport );
		} else {
			collectViewports.push( viewportDirty );
		}

		for( const maxWidthDirty of Object.keys( viewportSet[ viewportDirty ] ) ) {
			const maxWidth = parseInt( maxWidthDirty as string );

			collectMaxWidths.push( maxWidth );
		}
	}

	const viewports = sortViewportArray( uniqueArray( collectViewports ), reverse ? 'desc' : 'asc' );
	const maxWidths = sortViewportArray( uniqueArray( collectMaxWidths ), reverse ? 'desc' : 'asc' );

	return {
		viewports,
		maxWidths,
	};
}
