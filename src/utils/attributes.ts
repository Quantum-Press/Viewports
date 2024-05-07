/**
 * Set interface for Attributes.
 *
 * @since 0.1.0
 */
export type Attributes = {
	[ key: string ] : any;
}


/**
 * Set function to indicate an object.
 *
 * @param {any} item
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isObject = ( item : any ) => item && typeof item === 'object' && ! Array.isArray( item );


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


/**
 * Set function to check existing property by traversing path.
 *
 * @param {string} path
 * @param {object} object
 *
 * @since 0.2.5
 */
export const traverseExist = ( path : string, object : object ) : boolean => {
	const parts = path.split( '.' );
	const property = parts.shift();

	if( object && isObject( object ) && object.hasOwnProperty( property ) ) {
		if( parts.length ) {
			return traverseExist( parts.join( '.' ), object[ property ] );
		}

		return true;
	}

	return false;
}


/**
 * Set function to check if object or array is filled by traversing path.
 *
 * @param {string} path
 * @param {object} object
 *
 * @since 0.2.5
 */
export const traverseFilled = ( path : string, object : object ) : boolean => {
	const value = traverseGet( path, object );

	if( isObject( value ) && Object.keys( value ).length ) {
		return true;
	}

	if( Array.isArray( value ) && value.length ) {
		return true;
	}

	return false;
}


/**
 * Set function to get object value by traversing path.
 *
 * @param {string} path
 * @param {object} object
 *
 * @since 0.2.5
 */
export const traverseGet = ( path : string, object : object ) : any => {
	const parts = path.split( '.' );
	const property = parts.shift();

	if( ! parts.length && isObject( object ) && object.hasOwnProperty( property ) ) {
		return object[ property ];
	}

	if( parts.length && isObject( object ) && object.hasOwnProperty( property ) ) {
		return traverseGet( parts.join( '.' ), object[ property ] );
	}

	return null;
}