import { STORE_NAME } from '../../store/constants';
import { getVersion } from '../../utils/editor';
import { svgs } from '../svgs';

const {
	data: {
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @since 0.2.2
 */
const Foot = () => {

	// Set state dependencies.
	const {
		isInspecting,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isInspecting: store.isInspecting(),
		}
	}, [] );

	// Setup version.
	const version = getVersion();

	// Render component.
	return (
		<div className="qp-viewports-inspector-foot">
			<div className="qp-viewports-inspector-control title">
				<div className="qp-viewports-inspector-control-icon">
					{ svgs.logo }
				</div>
				{ isInspecting && <div className="qp-viewports-inspector-control-label">
					{ __( 'Quantum Viewports - Version', 'quantum-viewports' ) + ' ' + version }
				</div> }
			</div>
		</div>
	);
}

export default Foot;