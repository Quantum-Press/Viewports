import { STORE_NAME } from '../../store';
import { viewports } from '../svgs';

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
 */
const ToggleInspector = ( { showText = true, forceShow = false } : { showText?: boolean, forceShow?: boolean } ) => {

	// Set states.
	const {
		spectrumSet,
		isInspecting,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );
		const selected = select( 'core/block-editor' ).getSelectedBlock();

		if( ! selected ) {
			return {
				spectrumSet: {},
				isInspecting: store.isInspecting(),
			}
		}

		const {
			clientId,
		} = selected;

		return {
			spectrumSet: store.getSpectrumSet( clientId ),
			isInspecting: store.isInspecting(),
		}
	}, [] );

	// Break if there is no spectrumSet registered to selected block.
	if( 0 === Object.keys( spectrumSet ).length && ! forceShow ) {
		return null;
	}

	/**
	 * Set function to fire on click inspect to trigger ui.
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
			icon={ viewports }
			label={ __( 'Inspect styles', 'quantum-viewports' ) }
			onClick={ onClickInspect }
			text={ showText ? __( 'Inspector', 'quantum-viewports' ) : '' }
		/>
	);
}

export default ToggleInspector;
