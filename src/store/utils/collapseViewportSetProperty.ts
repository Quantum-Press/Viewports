import { collapseViewportSet } from '@viewports/store/utils';
import {
	BlockStyles,
	viewport,
	ViewportSet,
} from '@viewports/types';
import { traverseGet } from '@viewports/utils';

const {
	isEmpty,
} = window[ 'lodash' ];

/**
 * Set function to collapse viewportSet till given viewport to return the resulting BlockStyles property value.
 *
 * @param {ViewportSet} viewportSet
 * @param {number} tillViewport
 * @param {string} property
 *
 * @return {BlockStyles}
 */
export const collapseViewportSetProperty = ( viewportSet : ViewportSet, tillViewport : viewport, property : string ) : BlockStyles => {
	const collapsed = collapseViewportSet( viewportSet, tillViewport );

	return traverseGet( [ property ], collapsed );
}
