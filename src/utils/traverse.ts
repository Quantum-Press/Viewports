import { isObject } from "@quantum-viewports/utils";

const {
	get,
	set,
} = window[ 'lodash' ];


/**
 * Set function to check existing property by traversing path.
 *
 * @param {Array<string | number>} path
 * @param {object|any} object
 *
 * @return {boolean}
 */
export const traverseExist = ( path : Array<string | number>, object : object|any ) : boolean => {
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