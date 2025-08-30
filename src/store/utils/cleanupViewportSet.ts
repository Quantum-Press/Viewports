import { ViewportSet, ViewportStyleSets } from '@viewports/types';
import {
	traverseFilled,
	traverseGet,
	traverseSet
} from '@viewports/utils';

const {
	isEmpty,
} = window[ 'lodash' ];

/**
 * Set function to cleanup viewport styles.
 *
 * @param {ViewportSet} viewportSet
 *
 * @return {ViewportSet}
 */
export const cleanupViewportSet = ( viewportSet : ViewportSet ) : ViewportSet => {
	const cleaned: Record<string, any> = {};

	for( const viewport in viewportSet ) {
		if( ! viewportSet.hasOwnProperty( viewport ) ) continue;

		const viewportStyleSets : ViewportStyleSets = traverseGet( [ viewport ], viewportSet );
		if( ! isEmpty( viewportStyleSets ) ) {

			const maxWidths = Object.keys( viewportStyleSets );

			maxWidths.forEach( maxWidth => {
				if( traverseFilled( [ viewport, maxWidth, 'style' ], viewportSet ) ) {
					traverseSet( [ viewport, maxWidth, 'style' ], cleaned, traverseGet( [ viewport, maxWidth, 'style' ], viewportSet ) );
				}
			} );
		}
	}

	return cleaned;
};