import type {
	AnyObject,
	Spectrum
} from '@quantum-viewports/types';
import { isObject, isString, isNumber } from '@quantum-viewports/utils';
import { ArrayList } from './array';

interface Style {
	baseKeys : Array<any>;
	origKeys : Array<any>;
	styleKey : string;
	styleValue : any;
	onClickFunction : Function;
}

const {
	components: {
		Button,
	},
	data: {
		dispatch,
	}
} = window[ 'wp' ];

/**
 * Set function to render a style component for given spectrum.
 *
 * @param {object}
 */
export const ObjectList = ( {
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

	// Render component.
	return (

		<div className="objectlist-wrap">
			<div className="objectlist-start">{ '{' }</div>

			{ Object.entries( combined ).map( entry => {
				const property = entry[ 0 ];
				const value = entry[ 1 ] as string|number|AnyObject|Array<any>;

				if( ! property || ! value ) {
					return null;
				}

				const classNames = [ 'objectlist-row' ];
				if( isObject( changes ) && changes.hasOwnProperty( property ) ) {
					classNames.push( 'changed' );
				}
				if( isObject( removes ) && removes.hasOwnProperty( property ) ) {
					classNames.push( 'removed' );
				}

				if( isObject( value ) ) {
					return (
						<div className={ classNames.join( ' ' ) }>
							<div className="object-key">{ property }:</div>
							<ObjectList
								combined={ value }
								changes={ changes && changes.hasOwnProperty( property ) ? changes[ property ] : undefined }
								removes={ removes && removes.hasOwnProperty( property ) ? removes[ property ] : undefined }
								spectrum={ spectrum }
							/>
						</div>
					);
				}

				if( Array.isArray( value ) ) {
					return (
						<div className={ classNames.join( ' ' ) }>
							<div className="object-key">{ property }:</div>
							<ArrayList
								combined={ value }
								changes={ changes && changes.hasOwnProperty( property ) ? changes[ property ] : undefined }
								removes={ removes && removes.hasOwnProperty( property ) ? removes[ property ] : undefined }
								spectrum={ spectrum }
							/>

						</div>
					);
				}

				if( ! isString( value ) && ! isNumber( value ) ) {
					return null;
				}

				return (
					<div className={ classNames.join( ' ' ) }>
						<div className="object-key">{ property }:</div>
						<div className="object-value">{ value as string|number }:</div>
					</div>
				);

			} ) }
			<div className="objectlist-end">{ '}' }</div>
		</div>
	);
}

export default ObjectList;