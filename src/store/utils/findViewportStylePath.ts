import { viewport, ViewportSet } from "@viewports/types";

/**
 * Set function to find path to property in viewportSet.
 *
 * @param {viewport} viewport
 * @param {string} property
 * @param {ViewportSet} viewportSet
 *
 * @return {string[] | null}
 */
export const findViewportStylePath = (
	viewport: viewport,
	property: string,
	viewportSet: ViewportSet
) : ( string|number )[] | null => {
	if( ! viewportSet.hasOwnProperty( viewport ) ) return null;

	const viewportStyles = viewportSet[ viewport ];

	for( const maxWidth in viewportStyles ) {
		if( ! viewportStyles.hasOwnProperty( maxWidth ) ) continue;

		const styleObj = viewportStyles[ maxWidth ]?.style;
		if( styleObj && styleObj.hasOwnProperty( property ) ) {
			return [ viewport, parseInt( maxWidth ), "style", property ];
		}
	}

	return null;
};
