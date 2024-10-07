import { STORE_NAME } from '../../store';
import { view } from '../svgs';

const {
	components: {
		Button,
		Icon,
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
 *
 * @since 0.1.0
 */
const ToggleView = ( { text, showText } ) => {

	// Set dispatch.
	const dispatch = useDispatch( STORE_NAME );

	// Set states.
	const props = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
		}
	}, [] );

	// Set classNames for toggle.
	let classNamesToggle = 'qp-viewports-toggle-view';

	if ( props.isActive ) {
		classNamesToggle = classNamesToggle + ' active';
	}

	// Render component.
	return (
		<Button
			className={ classNamesToggle }
			onClick={ ! props.isActive ? dispatch.setLoading : dispatch.unsetActive }
			label={ __( 'View mode', 'quantum-viewports' ) }
			text={ text && showText ? text : '' }
			icon={ view }
		>
		</Button>
	);
}

export default ToggleView;
