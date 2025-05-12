import { STORE_NAME } from '../../../store';
import { SpectrumSet } from '../../../types';
import { Attribute } from './attribute';

const {
	data: {
		select,
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @param number storeId
 * @param SpectrumSet spectrumSet
 */
export const AttributeList = ( { storeId, spectrumSet } : { storeId : string, spectrumSet : SpectrumSet } ) => {

	// Set store dependencies.
	const {
		iframeViewport,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( storeId ),
			removes: store.getBlockRemoves( storeId ),
			iframeViewport: store.getIframeViewport(),
		};
	}, [] );

	// Render component.
	return (
		<div className="qp-viewports-inspector-attributelist">
			{ spectrumSet.map( spectrum => {
				return (
					<Attribute
						clientId={ storeId }
						spectrum={ spectrum }
						viewport={ iframeViewport }
					/>
				);
			} ) }
		</div>
	);
}


/**
 * Set component const to export sidebar control-edit ui.
 *
 * @param object props
 */
export const BlockAttributeList = () => {

	// Set store dependencies.
	const {
		selected,
	} = useSelect( ( select : Function ) => {
		return {
			selected: select( 'core/block-editor' ).getSelectedBlock(),
		};
	}, [] );

	// Deconstruct block
	const {
		clientId,
	} = selected;

	// Set spectrumSet.
	const spectrumSet = select( STORE_NAME ).getSpectrumSet( clientId ) as SpectrumSet;

	return (
		<AttributeList
			storeId={ clientId }
			spectrumSet={ spectrumSet }
		/>
	)
}