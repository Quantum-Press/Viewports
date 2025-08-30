import { isObject } from '@viewports/utils';
import type { AnyObject } from '@viewports/types';

const {
	isEqual,
	cloneDeep,
} = window[ 'lodash' ];

/**
 * Set function to find cleaned changes with removes.
 *
 * @param {T} attributes
 * @param {T} removes
 *
 * @return {T} cleaned
 */
export const findCleanedChanges = <T extends AnyObject>(attributes: T, removes: T): T => {
	const cleaned: T = {} as T;

	if ( isEqual( attributes, removes ) ) {
		return cleaned;
	}

	for ( const [ attributeKey, attributeValue ] of Object.entries( cloneDeep( attributes ) ) ) {
		if ( ! removes.hasOwnProperty( attributeKey ) ) {
			cleaned[ attributeKey as keyof T ] = attributeValue;
			continue;
		}

		const removeValue = removes[ attributeKey ];

		if ( isObject( attributeValue ) && isObject( removeValue ) ) {
			cleaned[ attributeKey as keyof T ] = findCleanedChanges( attributeValue, removeValue );
		}
	}

	return cleaned;
}