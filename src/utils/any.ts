import {
	findArrayChanges,
	findObjectChanges,
	getMergedObject
} from '@viewports/utils';

const {
	isEqual,
} = window[ 'lodash' ];


/**
 * Checks whether a given value is a plain object.
 *
 * Returns true if the value is a non-null object that is:
 * - Not an array
 * - Not a Date
 * - Not a Map or Set
 * - Not a function
 *
 * This is useful for identifying plain JavaScript objects (e.g., for deep comparison or merging).
 *
 * @param {unknown} item - The value to check.
 *
 * @returns {boolean} - True if the value is a plain object, false otherwise.
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
 * Checks whether a given value is a string.
 *
 * Returns true if the value is of type "string".
 *
 * @param {unknown} item - The value to check.
 *
 * @returns {boolean} - True if the value is a string, false otherwise.
 */
export const isString = (
	item: unknown
): boolean => {
	return typeof item === "string";
};


/**
 * Checks whether a given value is a valid number.
 *
 * Returns true if the value is of type "number" and is not NaN.
 *
 * @param {unknown} item - The value to check.
 *
 * @returns {boolean} - True if the value is a valid number, false otherwise.
 */
export const isNumber = (
	item: unknown
): boolean => {
	return typeof item === "number" && ! isNaN( item );
};


/**
 * Checks whether a given value is numeric (a number or a numeric string).
 *
 * This type guard returns true if the value is a number or a string that represents a valid number,
 * including negative and decimal numbers.
 *
 * Examples of valid numeric strings: "42", "-3.14", "0"
 * Non-numeric examples: "abc", "42abc", null, undefined
 *
 * @param {unknown} value - The value to evaluate.
 *
 * @returns {value is string | number} - True if the value is numeric, false otherwise.
 */
export const isNumeric = (
	value: unknown
): value is string | number => {
	return ( typeof value === "number" || ( typeof value === "string" && /^-?\d+(\.\d+)?$/.test( value ) ) );
};


/**
 * Determines whether a given value is a literal (string or number).
 *
 * This type guard returns true if the value is either a string or a number,
 * and narrows the type accordingly.
 *
 * @param {unknown} value - The value to check.
 *
 * @returns {value is string | number} - True if the value is a string or number, false otherwise.
 */
export const isLiteral = (
	value: unknown
): value is string | number => {
	return isString( value ) || isNumber( value );
};


/**
 * Recursively compares two values (objects, arrays, or primitives) and returns the differences.
 *
 * This function determines the changes between a current value and an original value.
 * - If both values are arrays, it delegates to `findArrayChanges`.
 * - If both values are objects, it delegates to `findObjectChanges`.
 * - If the values are primitive and different, it returns the current value.
 * - If there are no differences, it returns null.
 *
 * @param {any} current - The current value to compare.
 * @param {any} original - The original value to compare against.
 *
 * @returns {any} - A structure representing the differences, or null if there are none.
 */
export const findChanges = (
	current: any,
	original: any
): any => {
	if( Array.isArray( current ) && Array.isArray( original ) ) {
		return findArrayChanges( current, original );
	}

	if( isObject( current ) && isObject( original ) ) {
		return findObjectChanges( current, original );
	}

	if( ! isEqual( current, original ) ) {
		return current;
	}

	return null;
};


/**
 * Performs a deep equality check between two values.
 *
 * Compares two values recursively to determine if they are deeply equal.
 * This function handles objects and primitive values, but does not account for special cases like Dates,
 * Maps, Sets, functions, or circular references.
 *
 * @param {any} a - The first value to compare.
 * @param {any} b - The second value to compare.
 *
 * @returns {boolean} - True if both values are deeply equal, false otherwise.
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


/**
 * Merges two values (primitives, arrays, or objects) following specific rules:
 *
 * - If both values are objects (excluding arrays), it performs a deep merge using `getMergedObject`.
 * - If both values are arrays, it always keeps the base array (`baseValue`).
 * - If the types differ, it keeps the base value.
 * - In all other cases, it uses the compare value.
 *
 * This utility is designed to handle a variety of data types while enforcing predictable merging behavior.
 *
 * @template T - Type of the base value
 * @template U - Type of the value to compare/merge
 *
 * @param {T} baseValue - The initial or default value to preserve if conflicts occur
 * @param {U} compareValue - The new value to merge in
 *
 * @returns {T | U} - The resulting merged value, respecting the rules above
 *
 * @example
 * getMerged({ a: 1 }, { b: 2 }) // => { a: 1, b: 2 }
 * getMerged([1, 2], [3, 4])     // => [1, 2]
 * getMerged(42, "hello")        // => 42
 */
export const getMerged = <T extends any, U extends any>(
	baseValue: T,
	compareValue: U
  ): T | U => {
	if( isObject( baseValue ) && isObject( compareValue ) ) {
		return getMergedObject( baseValue, compareValue );
	}

	return baseValue;
};
