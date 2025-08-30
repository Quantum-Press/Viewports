import {
	isObject,
	cleanupObject,
} from '@viewports/utils';
import type { viewport } from '@viewports/types';

const {
	isEqual,
	isUndefined,
	isNull,
	orderBy,
} = window[ 'lodash' ];


/**
 * Recursively compares two arrays and returns the changes (differences) between them.
 *
 * @param {any[]} baseArray - The array containing the base values to compare.
 * @param {any[]} compArray - The array containing the values to compare against.
 *
 * @returns {any[]} - A new array containing the changes between baseArray and compArray.
 */
export const findArrayChanges = (
	baseArray: any[],
	compArray: any[]
): any[] => {
	if( isEqual( baseArray, compArray ) ) {
		return [];
	}

	return [ ... baseArray ];
};


/**
 * Set function to cleanup an array.
 *
 * @param {T} arr
 *
 * @return {T}
 */
export const cleanupArray = <T extends Array<any>>( arr : T ) : T => {
	for( let i = 0; i < arr.length; i++ ) {
		const value = arr[ i ];

		if( isNull( value ) || isUndefined( value ) ) {
			continue;
		}

		if( isObject( value ) ) {
			arr[ i ] = cleanupObject( value );
		} else if( Array.isArray( value ) ) {
			arr[ i ] = cleanupArray( value );
		} else {
			arr[ i ] = value;
		}
	}

	return arr;
}

/**
 * Set function to unique array values.
 *
 * @param {T[]} arr
 *
 * @return {T[]}
 */
export const uniqueArray = <T>( arr : T[] ) : T[] => Array.from( new Set( arr ) );


/**
 * Sorts an array of viewports in ascending or descending order.
 *
 * - Ascending ("asc"): Numeric values first in ascending order, followed by strings.
 * - Descending ("desc"): Strings first, followed by numeric values in descending order.
 *
 * @param {viewport[]} arr - The array of viewports to be sorted.
 * @param {'desc' | 'asc'} order - The sorting order ("asc" for ascending, "desc" for descending).
 *
 * @return {viewport[]} - The sorted array of viewports.
 */
export const sortViewportArray = ( arr : viewport[], order : 'desc' | 'asc' = 'desc' ) : viewport[] => {
	return orderBy(
		arr,
		[ (val) => ( typeof val === 'number' ? val : order === 'asc' ? Infinity : -Infinity ) ],
		[ order ]
	);
};