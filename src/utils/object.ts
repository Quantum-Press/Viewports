import {
	isObject,
	cleanupArray,
	deepEqual,
	isLiteral,
} from '@viewports/utils';
import {
	AnyObject,
	DeepPartial,
	ObjectOccurence
} from '@viewports/types';

const {
	isEmpty,
	isEqual,
	isUndefined,
	isNull
} = window[ 'lodash' ];


/**
 * Recursively compares two objects and returns the changes (differences) between them.
 *
 * @param {AnyObject} attributes - The object containing the attributes to compare.
 * @param {AnyObject} valids - The object containing the valid values to compare against.
 *
 * @returns {AnyObject} - A new object containing the changes between attributes and valids.
 */
export const findObjectChanges = (
	baseObj: AnyObject,
	compObj: AnyObject
): AnyObject => {
	let changes = {};

	if( null === baseObj || 'undefined' === typeof baseObj ) {
		return {};
	}

	// Iterate through attributes.
	for ( const [ baseKey, baseVal ] of Object.entries( baseObj ) ) {
		const validValue = compObj.hasOwnProperty( baseKey ) ? compObj[ baseKey ] : undefined;

		if( isEqual( baseVal, validValue ) ) {
			continue;
		}

		if ( isObject( baseVal ) && isObject( validValue ) ) {
			let subChanges = findObjectChanges( baseVal, validValue );

			if ( 0 < Object.keys( subChanges ).length ) {
				changes[ baseKey ] = { ... subChanges };
			}

			continue;
		}

		if( isObject( baseVal ) ) {
			changes[ baseKey ] = { ... baseVal };
		} else if( Array.isArray( baseVal ) ) {
			changes[ baseKey ] = [ ... baseVal ];
		} else {
			changes[ baseKey ] = baseVal;
		}
	}

	return changes;
}


/**
 * Recursively compares two objects and returns the differences between them.
 *
 * @param {T} baseObj - The base object to check for different properties.
 * @param {T} compObj - The object to compare against.
 * @param {boolean} [strict=false] - If true, only strictly unequal properties are included; if false, shallow differences are included.
 *
 * @returns {DeepPartial<T>} - A new object containing the differences between obj1 and obj2.
 */
export const findObjectDifferences = <T extends AnyObject | any[]>(
	baseObj: T,
	compObj: T,
	strict: boolean = false
): DeepPartial<T> => {

	// Typanpassung für result, um es als DeepPartial<T> zu behandeln.
	const result = ( Array.isArray( baseObj ) ? [] : {} ) as DeepPartial<T>;

	for( const key in baseObj ) {
		if( baseObj.hasOwnProperty( key ) ) {
			if( compObj.hasOwnProperty( key ) ) {
				if( typeof baseObj[ key ] === 'object' && baseObj[ key ] !== null && typeof compObj[ key ] === 'object' && compObj[ key ] !== null ) {
					const diff = findObjectDifferences( baseObj[ key ], compObj[ key ] );

					if( Object.keys( diff ).length > 0 ) {
						( result as any )[ key ] = diff;
					}
				} else if( strict && baseObj[ key ] !== compObj[ key ] ) {
					( result as any ) [ key ] = baseObj[ key ];
				}
			} else {
				( result as any ) [ key ] = baseObj[ key ];
			}
		}
	}

	return result;
};


/**
 * Recursively finds properties that exist in the base object but not in the comparison object.
 *
 * @param {T} baseObj - The base object to check for unique properties.
 * @param {U} compObj - The object to compare against.
 *
 * @returns {Omit<T, keyof U>} - A new object containing only properties from baseObj that do not exist in compObj.
 */
export const findUniqueProperties = <T extends object, U extends object>(
	baseObj: T,
	compObj: U,
	strict: boolean = false
): Partial<T> => {
	const result: Partial<T> = {};

	for( const key in baseObj ) {
		if( Object.prototype.hasOwnProperty.call( baseObj, key ) ) {
			const baseValue = baseObj[ key as keyof T ];
			const compValue = ( compObj as Record<string, any> )[ key ];

			const baseHasKey = isObject( compObj ) && key in compObj;
			const valuesDiffer = strict ? JSON.stringify( baseValue ) !== JSON.stringify( compValue ) : false;

			if( ! baseHasKey || valuesDiffer ) {
				if(
					typeof baseValue === 'object' &&
					baseValue !== null &&
					typeof compValue === 'object' &&
					compValue !== null
				) {
					const nestedResult = findUniqueProperties( baseValue as any, compValue as any, strict );
					if( Object.keys( nestedResult ).length > 0 ) {
						result[ key as keyof T ] = nestedResult as T[ Extract<keyof T, string> ];
					}
				} else {
					result[ key as keyof T ] = baseValue;
				}
			}
		}
	}

	return result;
};


/**
 * Recursively compares two objects or arrays and finds their occurrences (matches and missing properties).
 *
 * @param {any} obj1 - The first object or array to compare.
 * @param {any} obj2 - The second object or array to compare against.
 *
 * @returns {ObjectOccurence} - An object containing the matching (`found`) and missing (`missing`) properties.
 */
export const findObjectOccurence = ( obj1: any, obj2: any ) : ObjectOccurence => {
	const subtracted = subtractObject( obj1, obj2 );
	const equal = findEqualProperties( obj1, obj2 );

	return {
		found: equal,
		missing: subtracted,
	};

	/*
	const isObject1 = isObject( obj1 );
	const isObject2 = isObject( obj2 );
	const hasObjects = isObject1 || isObject2;
	const isArray1 = Array.isArray( obj1 );
	const isArray2 = Array.isArray( obj2 );
	const hasArrays = isArray1 || isArray2;

	if(
		( ! hasObjects && ! hasArrays ) ||
		obj1 === null ||
		obj2 === null
	) {
		return obj1 === obj2
			? { found: obj1, missing: null }
			: { found: null, missing: obj1 };
	}

	if( isObject1 && isObject2 ) {
		const found : any = {};
		const missing : any = {};
		let hasMissing = false;

		// Iteriere durch obj1 und vergleiche mit obj2
		for( const key in obj1 ) {
			if( Object.prototype.hasOwnProperty.call( obj1, key ) ) {
				const result = findObjectOccurence( obj1[ key ], obj2[ key ] );

				if( result.found !== null ) {
					found[ key ] = result.found;
				}

				if( result.missing !== null ) {
					missing[ key ] = result.missing;
					hasMissing = true;
				}
			}
		}

		return {
			found,
			missing: hasMissing ? missing : null
		};
	}

	if( isArray1 && isArray2 ) {
		const foundArr = [];
		const missingArr = [];

		obj1.forEach( ( item, index ) => {
			const result = findObjectOccurence( item, obj2[ index ] );

			if( result.missing === null ) {
				foundArr.push( result.found );
			} else {
				missingArr.push( result.missing );
			}
		} );

		return {
			found: foundArr,
			missing: missingArr.length ? missingArr : null
		};
	}
	*/
}


/**
 * Recursively finds equal properties between two objects.
 *
 * @param {T} baseObj - The base object to filter.
 * @param {U} compObj - The object to compare against.
 * @param {boolean} [strict=false] - If true, values must match exactly; if false, only structure matters.
 *
 * @returns {Partial<T>|Array<T>} - A new object | array containing only properties | indezes from baseObj that match compObj.
 */
export const findEqualProperties = <T extends object, U extends object>(
	baseObj: T,
	compObj: U,
	strict: boolean = false
): Partial<T>|Array<T> => {
	const result: Partial<T> = {};

	if( isObject( baseObj ) ) {
		for( const key in baseObj ) {
			if( baseObj.hasOwnProperty( key ) && compObj.hasOwnProperty( key ) ) {
				const baseValue = baseObj[ key ] as unknown;
				const compValue = compObj[ key as unknown as keyof U ] as unknown;

				if (
					typeof baseValue === "object" &&
					baseValue !== null &&
					typeof compValue === "object" &&
					compValue !== null
				) {
					const nestedMatch = findEqualProperties(
						baseValue as any,
						compValue as any,
						strict
					);

					if( Object.keys( nestedMatch ).length > 0 ) {
						result[ key ] = nestedMatch as T[ Extract<keyof T, string> ];
					}

				} else if( ! strict || baseValue === compValue ) {
					result[ key ] = baseValue as T[ Extract<keyof T, string> ];
				}
			}
		}
	}

	if( Array.isArray( baseObj ) ) {
		if( isEqual( baseObj, compObj ) ) {
			return [ ... baseObj ] as Array<T>;
		}

		return [];
	}

	if( isLiteral( baseObj ) ) {
		return baseObj as T;
	}

	return result;
};


/**
 * Recursively finds common properties and their values between two objects or arrays.
 *
 * @param {any} obj1 - The first object or array to compare.
 * @param {any} obj2 - The second object or array to compare.
 *
 * @returns {any} - An object or array containing the common properties and their values.
 */
export const findObjectPropertiesOccuring = (
	obj1: any,
	obj2: any
): any => {
	if( Array.isArray( obj1 ) && Array.isArray( obj2 ) ) {

		const minLength = Math.min(obj1.length, obj2.length);
		return obj1.slice( 0, minLength ).map( ( item, index ) =>
			findObjectPropertiesOccuring( item, obj2[ index ] )
		);
	} else if( isObject( obj1 ) && isObject( obj2 ) ) {
		let commonStructure: any = {};

		for( const key in obj1 ) {
			if( obj2.hasOwnProperty( key ) ) {
				commonStructure[ key ] = findObjectPropertiesOccuring( obj1[ key ], obj2[ key ] );
			}
		}

		return commonStructure;
	} else {
		return obj1;
	}
};


/**
 * Recursively merges multiple objects or arrays into a single object.
 *
 * @template T - The type of the objects or arrays to merge.
 * @param {...T} objects - The objects or arrays to merge.
 *
 * @returns {T[number]} - A new object or array that is the result of merging all input objects.
 */
export const getMergedObject = <T extends AnyObject[]>(
	... objects: T
) : T[number] => {
	return objects.reduce( ( prev, obj ) => {
		for( const [ key ] of Object.entries( obj ) ) {
			const prevValue = prev[ key ];
			const objectValue = obj[ key ];

			if( isObject( prevValue ) && isObject( objectValue ) ) {
				prev[ key ] = getMergedObject( prevValue, objectValue );
			} else if ( Array.isArray( prevValue ) && Array.isArray( objectValue ) && 0 < objectValue.length ) {
				prev[ key ] = [ ... objectValue ];
			} else if ( isObject( objectValue ) ) {
				prev[ key ] = { ... objectValue };
			} else {
				prev[ key ] = objectValue;
			}
		}

		return prev;
	}, {} );
};


/**
 * Recursively removes null, undefined, empty objects, and empty arrays from an object.
 *
 * @param {T} obj - The object to clean up.
 *
 * @returns {T} - A new object with all null, undefined, empty objects, and empty arrays removed.
 */
export const cleanupObject = <T extends AnyObject>(
	obj: T
) : T => {
	const cleanedObject = {} as T;

	for( const [ property, value ] of Object.entries( obj ) ) {
		if(
			isNull( value ) ||
			isUndefined( value ) ||
			( isObject( value ) && isEmpty( value ) ) ||
			( Array.isArray( value ) && isEmpty( value ) )
		) {
			continue;
		}

		if( isObject( value ) ) {
			cleanedObject[ property as keyof T ] = cleanupObject( value ) as T[keyof T];
		} else if( Array.isArray( value ) ) {
			cleanedObject[ property as keyof T ] = cleanupArray( value ) as T[keyof T];
		} else {
			cleanedObject[ property as keyof T ] = value;
		}
	}

	return cleanedObject;
};


/**
 * Recursively removes properties from the first object that match properties in the second object.
 *
 * @param {T} obj1 - The object from which properties will be removed.
 * @param {U} obj2 - The object containing the properties to match and remove from obj1.
 *
 * @returns {Partial<T>} - A new object with properties from obj1 that don't match properties in obj2.
 */
export const omitObjectMatching = <T extends Record<string, any>, U extends Record<string, any>>(
	obj1: T,
	obj2: U
) : Partial<T> => {
	function recursiveSubtract(
		o1: any,
		o2: any
	) : any {
		if( Array.isArray( o1 ) && Array.isArray( o2 ) ) {
			return o1.filter( item => ! o2.includes( item ) );
		} else if(
			typeof o1 === 'object' &&
			typeof o2 === 'object' &&
			o1 !== null &&
			o2 !== null
		) {
			let result : Record<string, any> = {};

			for( let key in o1 ) {
				if( ! o2.hasOwnProperty( key ) ) {
					result[ key ] = o1[ key ];
				} else {
					let deepResult = recursiveSubtract( o1[ key ], o2[ key ] );
					if(
						Array.isArray( deepResult ) ? deepResult.length > 0 : typeof deepResult === 'object' &&
						Object.keys( deepResult ).length > 0
					) {
						result[ key ] = deepResult;
					}
				}
			}

			return result;
		}

		return undefined;
	}

	return recursiveSubtract( obj1, obj2 ) as Partial<T>;
}


/**
 * Recursively subtracts values from obj1 based on obj2.
 *
 * In strict mode, performs a deep comparison and only retains parts
 * of obj1 that differ from obj2. In non-strict mode, retains all
 * primitive values and only recurses into objects where obj2 has
 * strictly fewer keys than obj1.
 *
 * @param obj1  - The source value (object, array, or primitive).
 * @param obj2  - The value to subtract from obj1.
 * @param strict - When true, use deep (strict) comparison; when false,
 *                 use loose comparison for primitives and selective deep for objects.
 *
 * @returns A new object/array/primitive with differences, or null if nothing remains.
 */
export const subtractObject = (
	obj1: any,
	obj2: any,
	strict: boolean = true
): any => {

	// Handle array subtraction
	if ( Array.isArray( obj1 ) && Array.isArray( obj2 ) ) {
		return obj1.filter( item1 =>
			strict
				? ! obj2.some( item2 => deepEqual( item1, item2 ) )    // strict deep compare
				: ! obj2.some( item2 => looseEqual( item1, item2 ) )   // loose compare for non-strict
		);
	}

	// Handle object subtraction
	else if (
		typeof obj1 === 'object' && obj1 !== null &&
		typeof obj2 === 'object' && obj2 !== null
	) {
		const result: any = {};

		for ( const key of Object.keys( obj1 ) ) {

			// Key not present in obj2: always include
			if( ! ( key in obj2 ) ) {
				result[ key ] = obj1[ key ];
			} else {

				// Non-strict: if both are objects, and obj2 has fewer keys, recurse
				if (
					!strict &&
					typeof obj1[ key ] === 'object' && obj1[ key ] !== null &&
					typeof obj2[ key ] === 'object' && obj2[ key ] !== null
				) {
					const keysA = Object.keys( obj1[ key ] );
					const keysB = Object.keys( obj2[ key ] );

					if( keysB.length < keysA.length ) {
						const sub = subtractObject( obj1[ key ], obj2[ key ], false );

						// Include only if subtracted result is non-null and non-empty
						if (
							sub !== null &&
							( typeof sub !== 'object' || Object.keys( sub ).length > 0 )
						) {
							result[ key ] = sub;
						}
					}
					// else: obj2 covers all subkeys → drop entire branch
				}

				// Strict mode: always recurse deeply
				else if ( strict ) {
					const sub = subtractObject( obj1[ key ], obj2[ key ], true );

					if (
						sub !== null &&
						( typeof sub !== 'object' || Object.keys( sub ).length > 0 )
					) {
						result[ key ] = sub;
					}
				}
				// Non-strict & not both objects: drop key entirely
			}
		}

		// Return null if nothing left after subtraction
		return Object.keys( result ).length > 0 ? result : null;
	}

	// Handle primitives
	else {
		if( strict ) {

			// Strict compare: only keep if different
			return obj1 !== obj2 ? obj1 : null;
		} else {

			// Non-strict: always retain primitive value
			return obj1;
		}
	}
}


/**
 * Performs a loose deep equality check between two values.
 *
 * - Primitives are compared with `==`.
 * - Arrays require same length and element-wise loose equality.
 * - Objects require same key set and loose equality per key.
 *
 * @param a - First value to compare.
 * @param b - Second value to compare.
 *
 * @returns True if values are loosely equal; false otherwise.
 */
export const looseEqual = ( a: any, b: any ): boolean => {

	// Different types can never be equal
	if( typeof a !== typeof b ) return false;

	// Primitives or null comparison
	if( a === null || b === null || typeof a !== 'object' ) {
		return a == b;
	}

	// Array vs. array: same length and element-wise looseEqual
	if( Array.isArray( a ) && Array.isArray( b ) ) {
		return a.length === b.length && a.every( ( v, i ) => looseEqual( v, b[ i ] ));
	}

	// Object vs. object: same keys and looseEqual for each
	const ka = Object.keys( a ), kb = Object.keys( b );
	if( ka.length !== kb.length ) return false;
	return kb.every( k => k in a && looseEqual( a[ k ], b[ k ] ) );
}