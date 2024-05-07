/**
 * Imports lodash ressources.
 */
const {
	isString,
	isObject,
} = window[ 'lodash' ];


/**
 * Set function to fill styles with attributes.
 *
 * @since 0.2.3
 */
export const getFilledStyles = ( path : string, style, schema ) => {
	const parts = path.split( '.' );
	const styleKey = parts.shift();
	const styleValue = style && style.hasOwnProperty( styleKey ) ? style[ styleKey ] : false;

	// Check parts to recursively call itself.
	if( parts.length > 0 ) {
		if( ! styleValue ) {
			return schema;
		}

		return getFilledStyles( parts.join( '.' ), styleValue, schema );
	}

	// Check if there is an object inside values.
	if( isObject( styleValue ) ) {
		const styleKeys = Object.keys( schema );

		for( const key of styleKeys ) {
			if( styleValue.hasOwnProperty( key ) ) {
				schema[ key ] = styleValue[ key ];
			}
		}

		return schema;
	}

	// Check if there is a string inside values.
	if( isString( styleValue ) ) {
		const styleKeys = Object.keys( schema );

		for( const key of styleKeys ) {
			if( styleValue.hasOwnProperty( key ) ) {
				schema[ key ] = styleValue;
			}
		}
	}

	return schema;
}


/**
 * Set function to format style.
 *
 * @since 0.2.3
 */
export const getFormattedStyles = ( styles ) => {
	const styleKeys = Object.keys( styles );

	// Iterate through styles.
	for( const key of styleKeys ) {
		if( ! isString( styles[ key ] ) ) {
			continue;
		}

		let styleValue = styles[ key ] as string;

		// Check whether we find a css var, to shorten and directly show size and unit.
		if( 0 === styleValue.indexOf( 'var:' ) ) {
			const varParts = styleValue.split( ':' );
			delete varParts[ 0 ];

			const varValue = '--wp--' + varParts[ 1 ].split( '|' ).join( '--' );
			const computed = getComputedStyle( document.body );
			const value = computed.getPropertyValue( varValue );

			styles[ key ] = value;
		}
	}

	return styles;
}