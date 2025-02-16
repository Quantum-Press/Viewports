import { SpectrumSet, STORE_NAME } from '../../store';
import Style from './style';

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
export const StyleList = ( { storeId, spectrumSet } : { storeId : string, spectrumSet : SpectrumSet } ) => {

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
		<div className="qp-viewports-inspector-stylelist">
			{ spectrumSet.map( spectrum => {
				return (
					<Style
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
export const BlockStyleList = () => {

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
		attributes: {
			tempId,
		}
	} = selected;

	// Set storeId.
	const storeId = tempId ? tempId : clientId as string;

	// Set spectrumSet.
	const spectrumSet = select( STORE_NAME ).getSpectrumSet( storeId ) as SpectrumSet;

	return (
		<StyleList
			storeId={ storeId }
			spectrumSet={ spectrumSet }
		/>
	)
}