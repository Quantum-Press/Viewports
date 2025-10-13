import {
	findObjectChanges
} from "@quantum-viewports/utils";

const {
	isEqual,
} = window[ 'lodash' ];


/**
 * Set function to check if a given value is a plain object.
 *
 * @param {unknown} item - The value to check.
 *
 * @returns {boolean} `true` if the value is a plain object, otherwise `false`.
 */
export const isObject = (
	item: unknown
): boolean => {
	return !! item
		&& typeof item === 'object'
		&& ! Array.isArray( item )
		&& ! ( item instanceof Date )
		&& ! ( item instanceof Map )
		&& ! ( item instanceof Set )
		&& ! ( typeof item === 'function' );
};


/**
 * Set function to check if a given value is a string.
 *
 * @param {unknown} item - The value to check.
 *
 * @returns {boolean} `true` if the value is a string, otherwise `false`.
 */
export const isString = (
	item: unknown
): boolean => {
	return typeof item === "string";
};


/**
 * Set function to check if a given value is a number.
 *
 * @param {unknown} item - The value to check.
 *
 * @returns {boolean} `true` if the value is a number, otherwise `false`.
 */
export const isNumber = (
	item: unknown
): boolean => {
	return typeof item === "number" && ! isNaN( item );
};


/**
 * Set function to check if a given value is a numeric string.
 *
 * @param {unknown} value - The value to check.
 *
 * @returns {boolean} `true` if the value is a number, otherwise `false`.
 */
export const isNumeric = (
	value: unknown
): value is string | number => {
	return ( typeof value === "number" || ( typeof value === "string" && /^-?\d+(\.\d+)?$/.test( value ) ) );
};


/**
 * Set function to check if a given value is a literal.
 *
 * @param {unknown} value - The value to check.
 *
 * @returns {boolean} `true` if the value is a literal, otherwise `false`.
 */
export const isLiteral = (
	value: unknown
): value is string | number => {
	return isString( value ) || isNumber( value );
};


/**
 * Set function to determine the differences between two values (arrays, objects, or primitives).
 *
 * @param {any} current - The current value.
 * @param {any} original - The original value.
 *
 * @returns {any} The detected changes or `undefined` if no changes exist.
 */
export const findChanges = (
	current: any,
	original: any
): any => {

	// Return a new copy of the array if any changes are detected
	if( Array.isArray( current ) && Array.isArray( original ) ) {
		return [ ... current ];
	}

	// Delegate deep object comparison to `findObjectChanges`
	if( isObject( current ) && isObject( original ) ) {
		return findObjectChanges( current, original );
	}

	// Return current value if it differs from the original
	if( ! isEqual( current, original ) ) {
		return current;
	}

	// No changes detected
	return undefined;
};


/**
 * Deeply compares two values for equality.
 *
 * @param {any} a - First value.
 * @param {any} b - Second value.
 *
 * @returns True if values are deeply equal, otherwise false.
 */
export function deepEqual(
	a: any,
	b: any
): boolean {
	if( a === b ) return true;
	if( typeof a !== 'object' || typeof b !== 'object' || a === null || b === null ) return false;
	let keysA = Object.keys( a ), keysB = Object.keys( b );
	if( keysA.length !== keysB.length ) return false;

	return keysA.every( key => deepEqual( a[ key ], b[ key ] ) );
}
