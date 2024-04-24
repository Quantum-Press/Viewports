import { STORE_NAME } from '../../store/constants';
import { svgs } from '../svgs';

const {
	components: {
		ToolbarButton,
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
const InspectorToolbar = ( props ) => {

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
	let classNames = 'qp-viewports-inspector-toolbar';
	if( isInspecting ) {
		classNames = classNames + ' active';
	}

	// Render component.
	return (
		<ToolbarButton
			className={ classNames }
			icon={ svgs.inspect }
			label={ __( 'Inspect styles', 'quantum-viewports' ) }
			onClick={ onClickInspect }
		/>
	);
}

export default InspectorToolbar;
