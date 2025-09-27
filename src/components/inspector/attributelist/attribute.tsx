import type {
	Spectrum
} from '../../../types';
import { STORE_NAME } from '../../../store';
import { useHighlightProperty } from '../../../hooks';
import { getMergedObject } from '../../../utils';

import ReactJson from "@webkinect/react-json-view";

interface Style {
	baseKeys : Array<any>;
	origKeys : Array<any>;
	styleKey : string;
	styleValue : any;
	onClickFunction : Function;
}

const { isEqual } = window[ 'lodash' ];
const {
	components: {
		Button,
	},
	data: {
		dispatch,
	}
} = window[ 'wp' ];

const theme = {
	base00: "transparent", // Hintergrund
	base01: "#252526",
	base02: "#373737",
	base03: "#c2c7c9",
	base04: "#c2c7c9", // Standard-Text
	base05: "#c2c7c9", // Keys
	base06: "#c2c7c9",
	base07: "#c2c7c9",
	base08: "#c2c7c9", // Strings
	base09: "#c2c7c9", // Numbers
	base0A: "#c2c7c9", // Booleans
	base0B: "#c2c7c9", // null / undefined
	base0C: "#c2c7c9",
	base0D: "#c2c7c9",
	base0E: "#c2c7c9",
	base0F: "#c2c7c9",
};

/**
 * Set function to render a style component for given spectrum.
 *
 * @param {object}
 */
export const Attribute = ( attributes ) => {

	// Deconstruct attributes.
	const {
		clientId,
		viewport,
	} = attributes;

	// Set spectrum.
	const spectrum = attributes.spectrum as Spectrum;

	// console.log( 'spectrum', spectrum );

	// Set useHighlightProperty hook.
	const [ highlightProperty, setHighlightProperty ] = useHighlightProperty();

	// Set indicators.
	const hasChanges = Object.keys( spectrum.changesProperties ).length ? true : false;
	const hasRemoves = Object.keys( spectrum.removesProperties ).length ? true : false;
	const canRestore = hasChanges || hasRemoves;
	const canRemove = ! isEqual( spectrum.savesProperties, spectrum.removesProperties );

	// Set classNames.
	const classNames = [ 'qp-viewports-inspector-style' ];
	if( hasChanges ) {
		classNames.push( 'has-changes' );
	}
	if( hasRemoves ) {
		classNames.push( 'has-removes' );
	}


	/**
	 * Set function to fire on click property.
	 */
	const onClickProperty = () => {
		setHighlightProperty( spectrum.selectors.panel );
	}


	/**
	 * Set function to fire on click remove.
	 */
	const onClickRemove = () => {
		dispatch( STORE_NAME ).removeBlockSaves( clientId, spectrum.blockName, [ spectrum.property ], spectrum.viewport );
	}


	/**
	 * Set function to fire on click remove.
	 */
	const onClickRestore = () => {
		dispatch( STORE_NAME ).restoreBlockSaves( clientId, spectrum.blockName, [ spectrum.property ], spectrum.viewport );
	}


	// Set combined attributes.
	const combined = getMergedObject( spectrum.removes, spectrum.saves, spectrum.changes );


	// Render component.
	return (
		<div className={ classNames.join( ' ' ) } data-viewport={ spectrum.viewport }>
			<div className="selector-start">
				{ '' === spectrum.media && viewport >= spectrum.from &&
					<div className="media active">{ 'Default' }</div>
				}
				{ '' !== spectrum.media && viewport < spectrum.from &&
					<div className="media">{ '@media (' + spectrum.media + ')' }</div>
				}
				{ '' !== spectrum.media && viewport >= spectrum.from &&
					<div className="media active">{ '@media (' + spectrum.media + ')' }</div>
				}
			</div>
			<div className="actions">
				<Button
					className="property"
					text={ "<" + spectrum.type + ':' + spectrum.property + ">" }
					onClick={ onClickProperty }
				/>
				<div className="state-actions">
					{ canRestore && <Button
						className="restore"
						icon="undo"
						onClick={ onClickRestore }
					/> }
					{ canRemove && <Button
						className="remove"
						icon="trash"
						onClick={ onClickRemove }
					/> }
				</div>
			</div>
			<ReactJson
				name={ spectrum.property }
				src={ combined }
				changes={ spectrum.hasChanges ? spectrum.changes : null }
				removes={ spectrum.hasRemoves ? spectrum.removes : null }
				collapsed={ 2 }
				enableClipboard={ true }
				displayDataTypes={ false }
				theme={ theme }
				quotesOnKeys={ false }
				displayObjectSize={ false }
			/>
		</div>
	);
}

export default Style;