import type {
	Spectrum
} from '../../types';
import { STORE_NAME } from '../../store';
import { useHighlightProperty } from '../../hooks';

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

/**
 * Set function to render a style component for given spectrum.
 *
 * @param {object}
 */
export const Style = ( attributes ) => {

	// Deconstruct attributes.
	const {
		clientId,
		viewport,
	} = attributes;

	// Set spectrum.
	const spectrum = attributes.spectrum as Spectrum;

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


	// Set clientId shorthand to replace in selector.
	const clientIdSplit = spectrum.selector.split( '-' );
	const clientIdShort = clientIdSplit.shift() + '-' + clientIdSplit.shift();

	// Render component.
	return (
		<div className={ classNames.join( ' ' ) } data-viewport={ spectrum.viewport }>
			{ '' !== spectrum.media && viewport < spectrum.from &&
				<div className="media">{ '@media (' + spectrum.media + ')' }</div>
			}
			{ '' !== spectrum.media && viewport >= spectrum.from &&
				<div className="media active">{ '@media (' + spectrum.media + ')' }</div>
			}
			<div className="selector-start">
				{ spectrum.selector.replace( '#block-' + clientId, clientIdShort ) }
				<br/>{ "{" }
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
			{ Object.entries( spectrum.properties ).map( entry => {
				const property = entry[ 0 ];
				const value = entry[ 1 ];

				if( ! property || ! value ) {
					return null;
				}

				const classNames = [ 'css-wrap' ];
				if( spectrum.changesProperties.hasOwnProperty( property ) ) {
					classNames.push( 'changed' );
				}
				if( spectrum.removesProperties.hasOwnProperty( property ) ) {
					classNames.push( 'removed' );
				}

				return (
					<div className={ classNames.join( ' ' ) }>
						<div className="css-status"></div>
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