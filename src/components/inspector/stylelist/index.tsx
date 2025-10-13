import { STORE_NAME } from '@quantum-viewports/store';
import { SpectrumSet } from '@quantum-viewports/types';
import Style from './style';

const {
	components: {
		Icon,
	},
	data: {
		select,
		useSelect,
	},
	i18n: {
		__,
	}
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
		hasBlockChanges,
		hasBlockRemoves,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( storeId ),
			removes: store.getBlockRemoves( storeId ),
			iframeViewport: store.getIframeViewport(),
			hasBlockChanges: store.hasBlockChanges( storeId ),
			hasBlockRemoves: store.hasBlockRemoves( storeId ),
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

			{ ( hasBlockChanges || hasBlockRemoves ) &&
				<div className="qp-viewports-stylelist-notice">
					<Icon icon="info" />
					{ __( 'Changes and Removes will apply on save', 'quantum-viewports' ) }
				</div>
			}
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
	} = selected;

	// Set spectrumSet.
	const spectrumSet = select( STORE_NAME ).getSpectrumSet( clientId ) as SpectrumSet;

	return (
		<StyleList
			storeId={ clientId }
			spectrumSet={ spectrumSet }
		/>
	)
}