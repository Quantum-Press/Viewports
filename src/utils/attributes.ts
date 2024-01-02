import type { Attributes } from './types';

/**
 * Set function to indicate an object.
 *
 * @param {any} item
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isObject = ( item : any ) => typeof item === 'object' && ! Array.isArray( item );


/**
 * Set function to return merged attributes.
 *
 * @param {array} objects
 *
 * @since 0.1.0
 *
 * @return {object}
 */
export const getMergedAttributes = ( ... objects : Array<any>) => {
	return objects.reduce( ( prev, obj ) => {
		for( const [ key, value ] of Object.entries( obj ) ) {
			const prevValue   = prev[ key ];
			const objectValue = obj[ key ];

			if( isObject( prevValue ) && isObject( objectValue ) ) {
				prev[ key ] = getMergedAttributes( prevValue, objectValue );
			} else if ( Array.isArray( prevValue ) && Array.isArray( objectValue ) && 0 < objectValue.length ) {
				prev[ key ] = [ ... objectValue ];
			} else if ( isObject( objectValue ) ) {
				prev[ key ] = { ... objectValue };
			} else {
				prev[ key ] = objectValue;
			}
		}

		return prev;
	}, {});
};


/**
 * Set function to sanitize attributes.
 *
 * @param {object} attributes
 *
 * @since 0.1.0
 *
 * @return {object}
 */
export const sanitizeAttributes = ( attributes : Attributes ) : Attributes => {
	const sanitized : Attributes = {};

	for ( const [ key, value ] of Object.entries( attributes ) ) {
		if ( 'style' === key && 'undefined' !== typeof value ) {
			sanitized[ key ] = value;
		}
	}

	return sanitized;
}


/**
 * Set function to fill empty attributes for false attributes.
 *
 * @param {object} fill
 * @param {object} filler
 *
 * @since 0.1.0
 *
 * @return {object}
 */
export const fillEmpty = ( fill : Attributes, filler : Attributes ) : Attributes => {
	const filled : Attributes = {};

	// Loop through to fill object to build up filled.
	for ( const [ key, value ] of Object.entries( fill ) ) {
		if ( false === value || 'undefined' === typeof value ) {
			filled[ key ] = filler[ key ];
			continue;
		}

		if ( isObject( value ) && filler.hasOwnProperty( key ) ) {
			filled[ key ] = fillEmpty( value, filler[ key ] );
			continue;
		}

		filled[ key ] = value;
	}

	return filled;
}



export default { getMergedAttributes, sanitizeAttributes, isObject, fillEmpty };
