import { logo } from '@viewports/components';
import { STORE_NAME } from '@viewports/store';
import { getVersion } from '@viewports/utils';


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
				text={ __( 'Viewports - Version', 'viewports' ) + ' ' + version }
			/>
		</div>
	);
}

export default Foot;