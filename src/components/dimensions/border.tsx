import { getFilledStyles, getFormattedStyles } from './utils';

/**
 * Imports lodash ressources.
 */
const {
	isObject,
	merge,
} = window[ 'lodash' ];


/**
 * Function to render border interface.
 */
const Border = ({ block }) => {

	// Deconstruct block.
	const {
		attributes: {
			style,
		}
	} = block;

	// Set schema.
	const schema = {
		top: '-',
		right: '-',
		bottom: '-',
		left: '-',
		width: null,
		style: null,
		color: null,
	}


	/**
	 * Set function to return formatted border.
	 */
	const getFormattedBorderStyles = ( styles ) => {
		const formatted = {
			top: '-',
			right: '-',
			bottom: '-',
			left: '-',
		};

		// Check for seperate borders.
		const borderKeys = [ 'top', 'right', 'bottom', 'left' ];
		for( const key of borderKeys ) {
			if( styles.hasOwnProperty( key ) && isObject( styles[ key ] ) ) {
				const border = styles[ key ];

				formatted[ key ] = getFormattedBorderValue( border );
			}
		}

		// Fill with base value.
		const formattedBaseValue = getFormattedBorderValue( styles );
		for( const key of borderKeys ) {
			if( '-' === formatted[ key ] ) {
				formatted[ key ] = formattedBaseValue;
			}
		}

		return formatted;
	}


	/**
	 * Set function to return formatted border.
	 */
	const getFormattedBorderValue = ( border ) => {
		const defaults = {
			width: null,
			style: null,
			color: null,
		}

		const parts = getFormattedStyles( merge( defaults, border ) );

		if( parts[ 'width' ] && ! parts[ 'style' ] ) {
			parts[ 'style' ] = 'solid';
		}

		let value = '';

		if( parts[ 'width' ] && parts[ 'style' ] ) {
			value = value + parts[ 'width' ] + ' ' + parts[ 'style' ];

			if( parts[ 'color' ] ) {
				value = value + ' ' + parts[ 'color' ];
			}
		}

		if( '' === value ) {
			return '-';
		}

		return value;
	}


	// Set margin.
	const border = getFilledStyles( 'border', style, schema );

	// Set formatted.
	const formatted = getFormattedBorderStyles( border );

	// Render component.
	return (
		<div className="qp-viewports-dimension border" data-dimension="border">
			<div className="view-label">{ 'border' }</div>
			<div className="view-content">
				<div className="view-top">{ formatted.top }</div>
				<div className="view-right">{ formatted.right }</div>
				<div className="view-bottom">{ formatted.bottom }</div>
				<div className="view-left">{ formatted.left }</div>
			</div>
		</div>
	);
}

export default Border;
