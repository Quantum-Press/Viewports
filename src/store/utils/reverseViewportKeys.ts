import {
	viewport,
	ViewportAny,
} from "../../types";
import {
	isNumeric
} from "../../utils";

/**
 * Set function to return propertyList from viewportStyle.
 *
 * @param {ViewportAny} viewportKeys
 *
 * @return {viewport[]}
 */
export const reverseViewportKeys = ( viewportKeys : ViewportAny ) : viewport[] => {
	const sortedKeys = Object.keys( viewportKeys ).sort( ( a, b ) => {
		const isANumeric = isNumeric( a );
		const isBNumeric = isNumeric( b );

		if( ! isANumeric && ! isBNumeric ) {
			return 0;
		} else if ( ! isANumeric ) {
			return -1;
		} else if ( ! isBNumeric ) {
			return 1;
		} else {
			return Number( b ) - Number( a );
		}
	} );

	return sortedKeys;
}