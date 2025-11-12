import { STORE_NAME } from '@quantum-viewports/store';
import { IndicatorPropertySet } from '@quantum-viewports/types';
import { Indicator } from '@quantum-viewports/components';

const {
	blockEditor: {
		InspectorControls,
	},
	components: {
		__experimentalToolsPanelItem: ToolsPanelItem,
	},
	data: {
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

export type IndicatorsProps = {
	clientId: string;
};


/**
 * Set component const to export inspector blocklist ui.
 *
 * @param object props
 */
export const Indicators = ( { clientId }: IndicatorsProps ) => {

	// Set datastore state dependencies.
	const {
		propertySet,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( clientId ),
			propertySet: store.getIndicatorPropertySet( clientId ) as IndicatorPropertySet,
		};
	}, [] );

	return (
		<>
			{ Object.keys( propertySet ).map( ( prop ) => {
				const {
					property,
					groupId,
					panelId,
					spectrumSet
				} = propertySet[ prop ];

				return (
					<>
						<InspectorControls group={ groupId }>
							<ToolsPanelItem
								className={ "qp-viewports-indicator-controls property-" + property }
								hasValue={ () => { return true } }
								label={ __( 'Viewports', 'quantum-viewports' ) }
								isShownByDefault={ true }
								panelId={ '' !== panelId ? panelId : clientId }
								onDeselect={ () => {} }
							>
								<Indicator
									storeId={ clientId }
									property={ property }
									spectrumSet={ spectrumSet }
								/>
							</ToolsPanelItem>
						</InspectorControls>
					</>
				);
			} ) }
		</>
	);
}
