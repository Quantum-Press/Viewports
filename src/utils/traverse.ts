import { isObject } from '@viewports/utils';

const {
	get,
	set,
} = window[ 'lodash' ];


/**
 * Traverses a path in an object and returns the deepest existing subpath.
 *
 * @param {Array<string | number>} path - The path to follow.
 * @param {object|any} object - The object to traverse.
 *
 * @returns {Array<string | number>} - The deepest existing subpath.
 */
export const traversePath = (
	path: Array<string | number>,
	object: object | any
): Array<string | number> => {
	const existingPath: Array<string | number> = [];
	let current = object;

	for( const key of path ) {
		if( current && typeof current === 'object' && key in current ) {
			existingPath.push( key );
			current = current[ key ];
		} else {
			break;
		}
	}

	return existingPath;
};


/**
 * Set function to check existing property by traversing path.
 *
 * @param {Array<string | number>} path
 * @param {object|any} object
 *
 * @return {boolean}
 */
export const traverseExist = ( path : Array<string | number>, object : object|any ) : boolean => {
	const pathCopy = [ ... path ];
	const property = pathCopy.shift();

	if( object && typeof object === "object" && object.hasOwnProperty( property ) ) {
		if( pathCopy.length ) {
			return traverseExist( pathCopy, object[ property ] );
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
	const pathCopy = [ ... path ];
	const property = pathCopy.shift();

	if( ! pathCopy.length && typeof object === "object" && object !== null && object.hasOwnProperty( property ) ) {
		return object[ property ];
	}

	if( pathCopy.length && typeof object === "object" && object !== null && object.hasOwnProperty( property ) ) {
		return traverseGet( pathCopy, object[ property ], fallback );
	}

	return fallback;
}


/**
 * Set function to update object value by traversing path.
 *
 * @param {Array<string | number>} path - An array of strings/numbers representing the object path
 * @param {object} object - The object to update
 * @param {any} value - The value to set at the specified path
 */
export const traverseSet = ( path : Array<string | number>, object : object, value : any ) : void => {
	const pathCopy = [ ... path ];
	const property = pathCopy.shift();

	if( ! pathCopy.length ) {
		if( property !== undefined) {
			object[ property as string | number ] = value;
		}
	} else {
		if( ! object[ property as string | number ] || typeof object[ property as string | number ] !== "object" ) {
			object[ property as string | number ] = {};
		}

		traverseSet( pathCopy, object[ property as string | number ], value );
	}
}


/**
 * Set function to delete an object property by traversing a path.
 *
 * @param {Array<string | number>} path - An array of strings/numbers representing the object path
 * @param {object} object - The object to update
 */
export const traverseDelete = ( path : Array<string | number>, object : object ): void => {
	if( path.length === 0 ) {
		return;
	}

	const pathCopy = [ ... path ];
	const lastKey = pathCopy.pop();

	let current: any = object;
	for( const key of pathCopy ) {
		if( ! ( key in current ) || typeof current[ key ] !== "object" || current[ key ] === null ) {
			return;
		}
		current = current[ key ];
	}

	if( lastKey !== undefined ) {
		delete current[ lastKey ];
	}
}


/**
 * Set function to delete an object property by traversing a path.
 * Cleans up empty objects/arrays backwards until a non-empty one is reached.
 *
 * @param {Array<string | number>} path - An array of strings/numbers representing the object path
 * @param {object} object - The object to update
 */
export const traverseDeleteCleanup = ( path : Array<string | number>, object : object ): void => {
	if( path.length === 0 ) {
		return;
	}

	const recursiveDelete = ( current : any, pathSlice : Array<string | number> ): boolean => {
		const [ key, ... rest ] = pathSlice;

		if( rest.length > 0 ) {
			if( ! ( key in current ) || typeof current[ key ] !== "object" || current[ key ] === null ) {
				return false;
			}

			const shouldDelete = recursiveDelete( current[ key ], rest );

			if( shouldDelete ) {
				if( Array.isArray( current[ key ] ) ) {
					current[ key ] = current[ key ].filter( ( v : any ) => v !== undefined && v !== null );
					if( current[ key ].length === 0 ) {
						delete current[ key ];
					}
				} else {
					delete current[ key ];
				}
			}
		} else {
			delete current[ key ];
		}

		if( Array.isArray( current ) ) {
			return current.every( ( v : any ) => v === undefined || v === null );
		}

		if( typeof current === "object" && current !== null ) {
			return Object.keys( current ).length === 0;
		}

		return false;
	};

	recursiveDelete( object, path );
};


/**
 * Set function to return a copy of the specified property object
 * filtered by the given property paths array.
 *
 * @param {any} obj The extraction target
 * @param {(string|number)[]} pathTokens An array of path tokens to extract from the given properties
 *
 * @return {object} containing the extracted properties
 */
export const ensureObjectPath = ( obj : any, pathTokens : ( string|number )[] ) : object => {
	const value = {};
	const ref = get( obj, pathTokens, value );

	if( ref !== value ) {
		return ref;
	}

	set( obj, pathTokens, value );

	return value;
}