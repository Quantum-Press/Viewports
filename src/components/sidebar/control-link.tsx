import { STORE_NAME } from '../../store/constants';
import { getVersion } from '../../utils/editor';
import { svgs } from '../svgs';

const {
	components: {
		Icon,
	},
	data: {
		dispatch,
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const ControlLink = () => {

	// Set state dependencies.
	const {
		isExpanded,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isExpanded: store.isExpanded(),
		}
	}, [] );

	// Setup version.
	const version = getVersion();

	return (
		<div className="qp-viewports-sidebar-control link">
			<div className="qp-viewports-sidebar-control-toggle">
				<div className="qp-viewports-sidebar-control-icon">
					<Icon icon={ svgs.logo }></Icon>
				</div>

				{ isExpanded &&
					<div className="qp-viewports-sidebar-control-label">
						{ __( 'Quantum Viewports - Version', 'quantum-viewports' ) + ' ' + version }
					</div>
				}
			</div>
		</div>
	);
}

export default ControlLink;