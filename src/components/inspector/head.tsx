import { STORE_NAME } from '../../store';
import { useLocalStorage } from '../../hooks';
import ToggleInspecting from './toggle-inspecting';

const {
	components: {
		Button,
	},
	data: {
		select,
		dispatch,
		useSelect,
	},
	element: {
		useEffect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @since 0.2.2
 */
const Head = () => {

	// Set state dependencies.
	const {
		inspectorPosition,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isInspecting: store.isInspecting(),
			inspectorPosition: store.getInspectorPosition(),
		}
	}, [] );

	// Set position.
	const [ position, setPosition ] = useLocalStorage( 'inspector.position', inspectorPosition );

	// Set useEffect to handle inspector position indicator via bodyclass.
	useEffect( () => {
		if( 'right' === position ) {
			document.body.classList.remove( 'is-left-inspector' );
			document.body.classList.add( 'is-right-inspector' );
			return;
		}

		if( 'left' === position ) {
			document.body.classList.remove( 'is-right-inspector' );
			document.body.classList.add( 'is-left-inspector' );
			return;
		}

	}, [ position ] );

	// Set useEffect to handle inspecting indicator via bodyclass.
	useEffect( () => {
		document.body.classList.add( 'is-inspecting' );

		return () => {
			document.body.classList.remove( 'is-inspecting' );
		}
	}, [] );


	/**
	 * Set function to fire on click close
	 *
	 * @since 0.2.2
	 */
	const onClickTitle = () => {
		if( select( STORE_NAME ).isInspecting() ) {
			dispatch( STORE_NAME ).unsetInspecting();
		} else {
			dispatch( STORE_NAME ).setInspecting();
		}
	}


	/**
	 * Set function to toggle position.
	 *
	 * @since 0.2.2
	 */
	const onClickPosition = () => {
		if( 'left' === position ) {
			setPosition( 'right' );
			dispatch( STORE_NAME ).setInspectorPosition( 'right' );
		} else {
			setPosition( 'left' );
			dispatch( STORE_NAME ).setInspectorPosition( 'left' );
		}
	}


	/**
	 * Set function to fire on click close.
	 *
	 * @since 0.2.2
	 */
	const onClickClose = () => {
		if( select( STORE_NAME ).isInspecting() ) {
			dispatch( STORE_NAME ).unsetInspecting();
		} else {
			dispatch( STORE_NAME ).setInspecting();
		}
	}

	// Render component.
	return (
		<div className="qp-viewports-inspector-head">
			<ToggleInspecting
				text={ __( 'Inspector', 'quantum-viewports' ) }
			/>
			<Button
				className="qp-viewports-inspector-position"
				icon={ 'left' === position ? 'align-pull-left' : 'align-pull-right' }
				onClick={ onClickPosition }
			/>
			<Button
				className="qp-viewports-inspector-close"
				icon="no-alt"
				onClick={ onClickClose }
			/>
		</div>
	);
}

export default Head;