import { STORE_NAME } from '../../store';
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
 * @param object props
 *
 * @since 0.2.2
 */
const StyleList = ({ block }) => {

	// Deconstruct block
	const {
		clientId,
		attributes: {
			tempId,
		}
	} = block;

	// Set storeId.
	const storeId = tempId ? tempId : clientId;

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

	// Set spectrumSet.
	const spectrumSet = select( STORE_NAME ).getSpectrumSet( storeId );

	// Render component.
	return (
		<div className="qp-viewports-inspector-stylelist">
			{ spectrumSet.map( spectrum => {
				return (
					<Style
						clientId={ clientId }
						spectrum={ spectrum }
						viewport={ iframeViewport }
					/>
				);
			} ) }
		</div>
	);
}

export default StyleList;
