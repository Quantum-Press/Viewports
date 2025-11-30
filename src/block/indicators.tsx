import { STORE_NAME } from '@quantum-viewports/store';
import { IndicatorPropertySet } from '@quantum-viewports/types';
import { IndicatorPanelItem } from '@quantum-viewports/components';

const {
	data: {
		select,
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
	useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( clientId ),
		};
	}, [] );

	const propertySet = select( STORE_NAME ).getIndicatorPropertySet( clientId ) as IndicatorPropertySet;

	return (
		<>
			{ Object.keys( propertySet ).map( ( prop ) => {
				const {
					property,
					groupId,
					panelId,
				} = propertySet[ prop ];

				const parentPanelId = '' !== panelId ? panelId : clientId;

				return (
					<IndicatorPanelItem
						storeId={ clientId }
						key={ clientId + ' ' + prop }
						property={ property }
						groupId={ groupId }
						panelId={ parentPanelId }
					/>
				);
			} ) }
		</>
	);
}
