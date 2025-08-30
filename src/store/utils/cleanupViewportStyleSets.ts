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
 * @param {ViewportStyleSets} viewportStyleSets
 *
 * @return {ViewportStyleSets}
 */
export const cleanupViewportStyleSets = ( viewportStyleSets : ViewportStyleSets ) : ViewportSet => {
	const cleaned: Record<string, any> = {};

	if( ! isEmpty( viewportStyleSets ) ) {
		const maxWidths = Object.keys( viewportStyleSets );

		maxWidths.forEach( maxWidth => {
			if( traverseFilled( [ maxWidth, 'style' ], viewportStyleSets ) ) {
				traverseSet( [ maxWidth, 'style' ], cleaned, traverseGet( [ maxWidth, 'style' ], viewportStyleSets ) );
			}
		} );
	}

	return cleaned;
};