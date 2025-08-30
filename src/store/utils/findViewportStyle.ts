import { ViewportStyleSet, ViewportStyleSets } from "@viewports/types";

/**
 * Set function to find merged viewportStyle from ViewportStyleSet.
 *
 * @param {ViewportStyleSets} viewportStyleSets
 *
 * @return {ViewportStyleSet}
 */
export const findViewportStyle = ( viewportStyleSets : ViewportStyleSets ) : ViewportStyleSet => {
	const viewportStyle : ViewportStyleSet = {
		style: {},
	};

	for( const key in viewportStyleSets ) {
		if( ! viewportStyleSets.hasOwnProperty( key ) ) {
			continue;
		}

		const viewportStyleSet : ViewportStyleSet = viewportStyleSets[ key ];

		if( viewportStyleSet.style ) {
			Object.assign( viewportStyle.style, viewportStyleSet.style );
		}
	}

	return viewportStyle;
}
