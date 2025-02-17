import { isObject, cleanupObject } from "./";

const {
	isUndefined,
	isNull
} = window[ 'lodash' ];


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