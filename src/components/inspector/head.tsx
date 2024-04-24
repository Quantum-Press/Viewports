import { STORE_NAME } from '../../store/constants';
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
 * @param object props
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

	// Set useEffect to handle inspector position indicator via bodyclass.
	useEffect( () => {
		if( 'right' === inspectorPosition ) {
			document.body.classList.remove( 'is-left-inspector' );
			document.body.classList.add( 'is-right-inspector' );
			return;
		}

		if( 'left' === inspectorPosition ) {
			document.body.classList.remove( 'is-right-inspector' );
			document.body.classList.add( 'is-left-inspector' );
			return;
		}

	}, [ inspectorPosition ] );

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
		if( 'left' === inspectorPosition ) {
			dispatch( STORE_NAME ).setInspectorPosition( 'right' );
		} else {
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
					{ 'left' === inspectorPosition && <Icon icon="align-pull-left"></Icon> }
					{ 'right' === inspectorPosition && <Icon icon="align-pull-right"></Icon> }
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