import { STORE_NAME } from '../../store';
import { view } from '../svgs';

const {
	components: {
		ToggleControl,
	},
	data: {
		useSelect,
		useDispatch,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export toggleView ui.
 *
 * @param object props
 */
const ToggleView = () => {

	// Set dispatch.
	const dispatch = useDispatch( STORE_NAME );

	// Set states.
	const {
		isActive
	} = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
		}
	}, [] );

	// Set classNames for toggle.
	let classNamesToggle = 'qp-viewports-toggle-view';
	if ( isActive ) {
		classNamesToggle = classNamesToggle + ' active';
	}

	// Render component.
	return (
		<ToggleControl
			className={ classNamesToggle }
			label={ __( 'Viewport simulation', 'quantum-viewports' ) }
			onChange={ ! isActive ? dispatch.setLoading : dispatch.unsetActive }
			checked={ isActive }
		/>
	);
}

export default ToggleView;
