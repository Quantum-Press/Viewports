import {
	AnyObject,
	DeepPartial
} from "@quantum-viewports/types";
import {
	isObject,
	cleanupArray
} from "@quantum-viewports/utils";

const {
	isEqual,
	isUndefined,
	isNull
} = window[ 'lodash' ];


/**
 * Set function to find object changes.
 *
 * @param {AnyObject} attributes
 * @param {AnyObject} valids
 *
 * @return {AnyObject} changes
 */
export const findObjectChanges = ( attributes: AnyObject, valids: AnyObject ) => {
	let changes = {};

	if( null === attributes || 'undefined' === typeof attributes ) {
		return {};
	}

	// Iterate through attributes.
	for ( const [ attributeKey, attributeValue ] of Object.entries( attributes ) ) {
		const validValue = valids.hasOwnProperty( attributeKey ) ? valids[ attributeKey ] : undefined;

		if( isEqual( attributeValue, validValue ) ) {
			continue;
		}

		if ( isObject( attributeValue ) && isObject( validValue ) ) {
			let subChanges = findObjectChanges( attributeValue, validValue );

			if ( 0 < Object.keys( subChanges ).length ) {
				changes[ attributeKey ] = { ... subChanges };
			}

			continue;
		}

		if( isObject( attributeValue ) ) {
			changes[ attributeKey ] = { ... attributeValue };
		} else if( Array.isArray( attributeValue ) ) {
			changes[ attributeKey ] = [ ... attributeValue ];
		} else {
			changes[ attributeKey ] = attributeValue;
		}
	}

	return changes;
}


/**
 * Set function to find differences between to objects.
 *
 * @param {T extends AnyObject | any[]} obj1
 * @param {T extends AnyObject | any[]} obj2
 * @param {boolean} hard comparement
 *
 * @return {DeepPartial<T>}
 */
export const findObjectDifferences = <T extends AnyObject | any[]>( obj1: T, obj2: T, hard: boolean = false ): DeepPartial<T> => {

	// Typanpassung für result, um es als DeepPartial<T> zu behandeln.
	const result = ( Array.isArray( obj1 ) ? [] : {} ) as DeepPartial<T>;

	for( const key in obj1 ) {
		if( obj1.hasOwnProperty( key ) ) {
			if( obj2.hasOwnProperty( key ) ) {
				if( typeof obj1[ key ] === 'object' && obj1[ key ] !== null && typeof obj2[ key ] === 'object' && obj2[ key ] !== null ) {
					const diff = findObjectDifferences( obj1[ key ], obj2[ key ] );

					if( Object.keys( diff ).length > 0 ) {
						( result as any )[ key ] = diff;
					}
				} else if( hard && obj1[ key ] !== obj2[ key ] ) {
					( result as any ) [ key ] = obj1[ key ];
				}
			} else {
				( result as any ) [ key ] = obj1[ key ];
			}
		}
	}

	return result;
};


/**
 * Set function to return merged attributes.
 *
 * @param {T extends AnyObject[]} objects
 *
 * @return {T[number]}
 */
export const getMergedObject = <T extends AnyObject[]>( ... objects: T ) : T[number] => {
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
 * Set function to cleanup empty properties on given object.
 *
 * @param {T extends AnyObject} obj
 *
 * @return {T}
 */
export const cleanupObject = <T extends AnyObject>( obj: T ) : T => {
	const cleanedObject = {} as T;

	for( const [ property, value ] of Object.entries( obj ) ) {
		if( isNull( value ) || isUndefined( value ) ) {
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
