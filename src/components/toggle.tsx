import { useLongPress } from '../utils/longpress';
import { STORE_NAME } from '../store/constants';
import { svgs } from './svgs';


const {
	components: {
		Icon,
	},
	data: {
		select,
		useSelect,
		useDispatch,
	},
	element: {
		useEffect,
	}
} = window[ 'wp' ];

/**
 * Set component const to export toggle ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const Toggle = () => {

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
	let classNamesToggle = 'qp-viewports-toggle';
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
		<div className={ classNamesToggle } onClick={ ! props.isActive ? dispatch.setLoading : dispatch.unsetActive }>
			<Icon icon={ svgs.toggle }/>
		</div>
	);
}

export default Toggle;
