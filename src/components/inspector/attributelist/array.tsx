import type { Spectrum } from '@quantum-viewports/types';
import { isObject } from '@quantum-viewports/utils';
import ObjectList from './object';

const { isUndefined, isNull } = window[ 'lodash' ];

/**
 * Set function to render a style component for given spectrum.
 *
 * @param {object}
 */
export const ArrayList = ( {
	combined,
	changes,
	removes,
	spectrum,
} : {
	combined : any,
	changes : any,
	removes : any,
	spectrum : Spectrum
} ) => {

	// console.log( 'array', combined );

	// Render component.
	return (

		<div className="arraylist-wrap">
			<div className="arraylist-start">{ '[' }</div>
			{ combined.map( ( value, property ) => {
				if( isUndefined( value ) || isNull( value ) ) {
					return null;
				}

				const classNames = [ 'arraylist-row' ];
				if( Array.isArray( changes ) && property in changes ) {
					classNames.push( 'changed' );
				}
				if( Array.isArray( removes ) && property in removes ) {
					classNames.push( 'removed' );
				}

				if( isObject( value ) ) {
					return (
						<div className={ classNames.join( ' ' ) }>
							<div className="array-key">{ property }:</div>
							<ObjectList
								combined={ value }
								changes={ changes && property in changes ? changes[ property ] : undefined }
								removes={ removes && property in removes ? removes[ property ] : undefined }
								spectrum={ spectrum }
							/>
						</div>
					);
				}

				if( Array.isArray( value ) ) {
					// console.log( 'array in array', property, value );

					return (
						<div className={ classNames.join( ' ' ) }>
							<div className="array-key">{ property }:</div>
							<ArrayList
								combined={ value }
								changes={ changes && property in changes ? changes[ property ] : undefined }
								removes={ removes && property in removes ? removes[ property ] : undefined }
								spectrum={ spectrum }
							/>
						</div>
					);
				}

				return (
					<div className={ classNames.join( ' ' ) }>
						<div className="array-key">{ property }:</div>
						<div className="array-value">{ value };</div>
					</div>
				);

			} ) }
			<div className="arraylist-end">{ ']' }</div>
		</div>
	);
}
