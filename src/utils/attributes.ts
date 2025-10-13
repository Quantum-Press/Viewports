import { BlockAttributes } from "@quantum-viewports/types";

/**
 * Set function to sanitize attributes.
 *
 * @param {BlockAttributes} attributes
 *
 * @return {BlockAttributes}
 */
export const sanitizeAttributes = ( attributes : BlockAttributes ) : BlockAttributes => {
	return attributes.hasOwnProperty( 'style' ) ? {
		style: attributes.style,
	} : {};
}
