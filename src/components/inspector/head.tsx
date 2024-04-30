import { STORE_NAME } from '../../store/constants';
import useLocalStorage from '../../hooks/use-local-storage';
import { svgs } from '../svgs';

const {
	components: {
		Icon,
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
		isActive,
		isInspecting,
		inspectorPosition,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isInspecting: store.isInspecting(),
			inspectorPosition: store.inspectorPosition(),
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
		if( isInspecting ) {
			document.body.classList.add( 'is-inspecting' );
		} else {
			document.body.classList.remove( 'is-inspecting' );
		}

	}, [ isInspecting ] );


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
			<div className="qp-viewports-inspector-control title" onClick={ onClickTitle }>
				<div className="qp-viewports-inspector-control-icon">
					{ svgs.inspect }
				</div>
				{ isInspecting && <div className="qp-viewports-inspector-control-label">
					{ __( 'Inspector', 'quantum-viewports' ) }
				</div> }
			</div>
			{ isInspecting && <div className="qp-viewports-inspector-control position" onClick={ onClickPosition }>
				<div className="qp-viewports-inspector-control-icon">
					{ 'left' === position && <Icon icon="align-pull-left"></Icon> }
					{ 'right' === position && <Icon icon="align-pull-right"></Icon> }
				</div>
			</div> }
			{ isInspecting && <div className="qp-viewports-inspector-control close" onClick={ onClickClose }>
				<div className="qp-viewports-inspector-control-icon">
					<Icon icon="no-alt"></Icon>
				</div>
			</div> }
		</div>
	);
}

export default Head;