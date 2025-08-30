import {
	BlockAttributes,
	ViewportSet,
	ViewportStyleSets,
	DeprecatedViewportSet,
} from "@viewports/types";
import {
	getMergedObject,
	traverseGet
} from "@viewports/utils";

const {
	cloneDeep,
} = window[ 'lodash' ];


/**
 * Set function to find reference free block saves from BlockAttributes.
 *
 * @param {BlockAttributes} attributes
 *
 * @return {ViewportStyleSets} saves
 */
export const findBlockSaves = ( attributes : BlockAttributes ) : ViewportSet => {
	const style = traverseGet( [ 'style' ], attributes ) || {};

	let saves : ViewportSet = {
		0: {
			0: {
				style: cloneDeep( style ),
			}
		}
	}

	const viewports : ViewportSet|DeprecatedViewportSet = traverseGet( [ 'viewports' ], attributes ) || {};

	if ( Object.keys( viewports ).length ) {
		const transformedViewports : ViewportSet = {};

		Object.entries( viewports ).forEach( ( [ viewport, data ] ) => {
			if( 'style' in data ) {
				transformedViewports[ viewport ] = { 0: cloneDeep( data ) };
			} else {
				transformedViewports[viewport] = cloneDeep( data as ViewportStyleSets );
			}
		});

		saves = getMergedObject( saves, transformedViewports );
	}

	return saves;
}
