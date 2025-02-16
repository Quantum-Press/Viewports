import { STORE_NAME } from '../../store';
import { getVersion } from '../../utils';
import { logo } from '../svgs';

const {
	components: {
		Button,
	},
	data: {
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
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
			<Button
				className="qp-viewports-link"
				icon={ logo }
				text={ __( 'Quantum Viewports - Version', 'quantum-viewports' ) + ' ' + version }
			/>
		</div>
	);
}

export default Foot;