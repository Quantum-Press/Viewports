import { ViewportSet } from "@viewports/types";
import { findViewportStyle } from "@viewports/store/utils";


/**
 * Set function to return propertyList from viewportStyle.
 *
 * @param {ViewportSet} viewportSet
 *
 * @return {Array<string | number>}
 */
export const findViewportStyleProperties = ( viewportSet: ViewportSet ) : Array<string | number> => {

	// Initialize a Set to store unique keys
	const allKeys = new Set<string | number>();

	// Iterate over each style within the viewport
	for( const viewport in viewportSet ) {
		if( viewportSet.hasOwnProperty( viewport ) ) {
			const viewportStyle = findViewportStyle( viewportSet[ viewport ] );

			// Get all the properties from the Styles object and add to the Set
			Object.keys( viewportStyle.style ).forEach( ( key ) => {
				allKeys.add( key );
			} );
		}
	}

	// Convert the Set to an Array and return it
	return Array.from( allKeys );
};
