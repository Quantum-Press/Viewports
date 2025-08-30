import { isObject } from '@viewports/utils';
import type { AnyObject } from '@viewports/types';

/**
 * Set function to find removes by keys array.
 *
 * @param {Array<string>} keys
 * @param {T} compare
 *
 * @return {T} removes
 */
export const findRemoves = <T extends AnyObject>( keys: Array<string>, compare: T ) : T => {
	const result = {} as T;
	const key: string | undefined = keys.shift();

	// Check if there is no key to return.
	if( ! key || ! compare.hasOwnProperty( key ) ) {
		return {} as T;
	}

	let nextCompare = compare[key];

	// If there are no keys left to iterate over, return result.
	if( keys.length === 0 && isObject( nextCompare ) ) {
		result[ key as keyof T ] = nextCompare;
		return result;
	}

	// Wenn der Wert ein Objekt ist, rekursiv fortfahren
	if( isObject( nextCompare ) ) {
		result[ key as keyof T ] = findRemoves( keys, nextCompare );
	} else {
		result[ key as keyof T ] = nextCompare;
	}

  return result;
};