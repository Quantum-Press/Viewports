const {
	get,
	set,
} = window[ 'lodash' ];


/**
 * Set interface for Attributes.
 */
export type Attributes = {
	[ key: string ] : any;
}


/**
 * Set function to indicate an object.
 *
 * @param {any} item
 *
 * @return {boolean}
 */
export const isObject = ( item : any ) => item && typeof item === 'object' && ! Array.isArray( item );


/**
 * Set function to return merged attributes.
 *
 * @param {array} objects
 *
 * @return {object}
 */
export const getMergedAttributes = ( ... objects : Array<any>) => {
	return objects.reduce( ( prev, obj ) => {
		for( const [ key ] of Object.entries( obj ) ) {
			const prevValue = prev[ key ];
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
 * Set function to return merged properties from multiple objects.
 *
 * @param {T[]} objects
 *
 * @return {Array<keyof T>}
 */
export const getMergedAttributeProperties = <T extends object>( ... objects : T[] ) : Array<keyof T> => {

	// Initialize a Set to store unique keys
	const allKeys = new Set<keyof T>();

	// Iterate over each object and add its keys to the Set
	for( const obj of objects ) {
		Object.keys( obj ).forEach( key => {
			allKeys.add( key as keyof T );
		} );
	}

	// Convert the Set to an Array and return it
	return Array.from( allKeys );
}


/**
 * Set function to sanitize attributes.
 *
 * @param {Attributes} attributes
 *
 * @return {Attributes}
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
 * @param {Attributes} fill
 * @param {Attributes} filler
 *
 * @return {Attributes}
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
 * @param {Array<string | number>} path
 * @param {object} object
 *
 * @return {boolean}
 */
export const traverseExist = ( path : Array<string | number>, object : object ) : boolean => {
	const property = path.shift();

	if( object && isObject( object ) && object.hasOwnProperty( property ) ) {
		if( path.length ) {
			return traverseExist( path, object[ property ] );
		}

		return true;
	}

	return false;
}


/**
 * Set function to check if object or array is filled by traversing path.
 *
 * @param {Array<string | number>} path
 * @param {object} object
 *
 * @return {boolean}
 */
export const traverseFilled = ( path : Array<string | number>, object : object ) : boolean => {
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
 * @param {Array<string | number>} path
 * @param {object} object
 * @param {any} fallback
 *
 * @return {any}
 */
export const traverseGet = ( path : Array<string | number>, object : object, fallback : any = null ) : any => {
	const property = path.shift();

	if( ! path.length && isObject( object ) && object.hasOwnProperty( property ) ) {
		return object[ property ];
	}

	if( path.length && isObject( object ) && object.hasOwnProperty( property ) ) {
		return traverseGet( path, object[ property ], fallback );
	}

	return fallback;
}


/**
 * Set function to return a copy of the specified property object
 * filtered by the given property paths array.
 *
 * @param {any} obj The extraction target
 * @param {string} path A list of paths to extract from the given properties
 *
 * @return {object} containing the extracted properties
 */
export const ensureObjectPath = ( obj : any, path : string ) : object => {
	const value = {};
	const pathTokens = path.split( '.' );
	const ref = get( obj, pathTokens, value );

	if( ref !== value ) {
		return ref;
	}

	set( obj, pathTokens, value );

	return value;
}
