import {
	BlockStyles,
	viewport,
	ViewportSet,
} from '@viewports/types';
import { isNumber, getMergedObject } from '@viewports/utils';

const {
	isEmpty,
} = window[ 'lodash' ];

/**
 * Set function to collapse viewportSet till given viewport to return the resulting BlockStyles.
 *
 * @param {ViewportSet} viewportSet
 * @param {number} tillViewport
 *
 * @return {BlockStyles}
 */
export const collapseViewportSet = ( viewportSet : ViewportSet, tillViewport : viewport ) : BlockStyles => {
	const stylesToMerge: BlockStyles[] = [];

	// Sort viewports.
	const sortedViewportKeys = Object.keys( viewportSet )
		.map( key => parseInt( key, 10 ) )
		.sort( ( a, b ) => a - b );

	// Iterate over viewports <= tillViewport.
	for ( const viewport of sortedViewportKeys ) {
		if( isNumber( viewport ) ) {

			// @ts-ignore
			if ( tillViewport >= viewport ) {
				const viewportStyleSets = viewportSet[ viewport ];
				let mergedViewportStyle: BlockStyles = {};

				// Sort maxWidth.
				const sortedMaxWidthKeys = Object.keys( viewportStyleSets )
					.map( key => parseInt( key, 10 ) )
					.sort( ( a, b ) => a - b );

				// Iterate over maxWidth keys to merge by maxWidth in dependency to viewport.
				for ( const maxWidth of sortedMaxWidthKeys ) {

					// @ts-ignore
					if ( maxWidth === 0 || tillViewport <= maxWidth ) {
						if( isEmpty( mergedViewportStyle ) ) {
							if( viewportStyleSets[ maxWidth ].style ) {
								mergedViewportStyle = viewportStyleSets[ maxWidth ].style;
							}
						} else {
							mergedViewportStyle = getMergedObject( mergedViewportStyle, viewportStyleSets[ maxWidth ].style );
						}
					}
				}

				stylesToMerge.push( mergedViewportStyle );
			}
		}
	}

	return getMergedObject( ... stylesToMerge );
}
