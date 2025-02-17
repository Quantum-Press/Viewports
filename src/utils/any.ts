import {
	findObjectChanges
} from "./";

const {
	isEqual,
} = window[ 'lodash' ];


/**
 * Set function to indicate an object.
 *
 * @param {any} item
 *
 * @return {boolean}
 */
export const isObject = ( item : any ) => item && typeof item === 'object' && ! Array.isArray( item );


/**
 * Set function to find changes between two values (arrays or objects).
 *
 * @param {any} current - The current value.
 * @param {any} original - The original value.
 *
 * @return {any} changes - Detected changes.
 */
export const findChanges = ( current: any, original: any ) : any => {
	if( Array.isArray( current ) && Array.isArray( original ) ) {
		return [ ... current ];
	} else if ( isObject( current ) && isObject( original ) ) {
		return findObjectChanges( current, original );
	} else if ( ! isEqual( current, original ) ) {
		return current;
	}

	return undefined;
};