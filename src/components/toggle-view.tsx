import { STORE_NAME } from '../store';
import { svgs } from './svgs';

const {
	components: {
		Button,
	},
	data: {
		useSelect,
		useDispatch,
	},
} = window[ 'wp' ];

/**
 * Set component const to export toggleView ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const ToggleView = () => {

	// Set dispatch.
	const dispatch = useDispatch( STORE_NAME );

	// Set states.
	const props = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			isRegistering: store.isRegistering(),
			isReady: store.isReady(),
			isActive: store.isActive(),
			isLoading: store.isLoading(),
			isSaving: store.isSaving(),
		}
	}, [] );

	// Set classNames for toggle.
	let classNamesToggle = 'qp-viewports-toggle-view';
	if ( props.isRegistering ) {
		classNamesToggle = classNamesToggle + ' registering';
	}
	if ( props.isReady ) {
		classNamesToggle = classNamesToggle + ' ready';
	}
	if ( props.isActive ) {
		classNamesToggle = classNamesToggle + ' active';
	}
	if ( props.isLoading ) {
		classNamesToggle = classNamesToggle + ' loading';
	}
	if ( props.isSaving ) {
		classNamesToggle = classNamesToggle + ' saving';
	}

	// Render component.
	return (
		<Button
			className={ classNamesToggle }
			onClick={ ! props.isActive ? dispatch.setLoading : dispatch.unsetActive }
			icon={ svgs.view }
		/>
	);
}

export default ToggleView;
