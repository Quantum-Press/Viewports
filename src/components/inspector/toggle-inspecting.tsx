import { STORE_NAME } from '../../store';
import { svgs } from '../svgs';

const {
	components: {
		Button,
	},
	data: {
		useSelect,
		select,
		dispatch,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export inspector ui.
 *
 * @param object props
 *
 * @since 0.2.1
 */
const ToggleInspecting = ( props ) => {

	// Deconstruct props.
	const {
		text,
	} = props;

	// Set states.
	const {
		isInspecting,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isInspecting: store.isInspecting(),
		}
	}, [] );

	/**
	 * Set function to fire on click inspect to trigger ui.
	 *
	 * @since 0.2.1
	 */
	const onClickInspect = () => {
		if( select( STORE_NAME ).isInspecting() ) {
			dispatch( STORE_NAME ).unsetInspecting();
		} else {
			dispatch( STORE_NAME ).setInspecting();
		}
	}

	// Set button classnames.
	let classNames = 'qp-viewports-toggle-inspecting';
	if( isInspecting ) {
		classNames = classNames + ' is-inspecting';
	}

	// Render component.
	return (
		<Button
			className={ classNames }
			icon={ svgs.inspect }
			label={ __( 'Inspect styles', 'quantum-viewports' ) }
			onClick={ onClickInspect }
			text={ text ? text : '' }
		/>
	);
}

export default ToggleInspecting;
