import type { Spectrum } from '../../generator/types';

interface Style {
	baseKeys : Array<any>;
	origKeys : Array<any>;
	styleKey : string;
	styleValue : any;
	onClickFunction : Function;
}

/**
 * Set function to render a style component for given spectrum.
 *
 * @param {object}
 *
 * @since 0.2.2
 */
export const Style = ( attributes ) => {

	// Deconstruct attributes.
	const {
		viewport,
	} = attributes;

	// Set spectrum.
	const spectrum = attributes.spectrum as Spectrum;

	// Render component.
	return (
		<div className="qp-viewports-inspector-style" data-viewport={ spectrum.viewport }>
			{ '' !== spectrum.media && viewport < spectrum.viewport &&
				<div className="media">{ '@media (' + spectrum.media + ')' }</div>
			}
			{ '' !== spectrum.media && viewport >= spectrum.viewport &&
				<div className="media active">{ '@media (' + spectrum.media + ')' }</div>
			}
			<div className="selector-start">
				{ spectrum.selector + ' {' }
			</div>
			<div className="property">{ "<" + spectrum.property + ">" }</div>
			{ Object.entries( spectrum.properties ).map( entry => {
				const property = entry[ 0 ];
				const value = entry[ 1 ];

				if( ! property || ! value ) {
					return null;
				}

				return (
					<div className="css-wrap">
						<div className="css-key">{ property }:</div>
						<div className="css-value">{ value };</div>
					</div>
				);
			} ) }
			<div className="selector-end">{ '}' }</div>
		</div>
	);
}

export default Style;