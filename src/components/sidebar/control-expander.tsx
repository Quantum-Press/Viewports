import { STORE_NAME } from '../../store/constants';

const {
	components: {
		Icon,
	},
	data: {
		dispatch,
		useSelect,
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
 * @since 0.1.0
 */
const ControlEdit = () => {

	// Set state dependencies.
	const {
		isInspecting,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isInspecting: store.isInspecting(),
		}
	}, [] );


	/**
	 * Set function to toggle expander.
	 *
	 * @since 0.1.0
	 */
	const onClickControl = () => {
		if( isInspecting ) {
			dispatch( STORE_NAME ).unsetInspecting();
		} else {
			dispatch( STORE_NAME ).setInspecting();
		}
	}

	return (
		<div className="qp-viewports-sidebar-control expander">
			<div className="qp-viewports-sidebar-control-toggle" onClick={ onClickControl }>
				{ ! isInspecting && <div className="qp-viewports-sidebar-control-icon">
					<Icon icon="arrow-right-alt2"></Icon>
					<Icon icon="arrow-right-alt2"></Icon>
				</div> }

				{ isInspecting && <div className="qp-viewports-sidebar-control-icon">
					<Icon icon="arrow-left-alt2"></Icon>
					<Icon icon="arrow-left-alt2"></Icon>
				</div> }

				<div className="qp-viewports-sidebar-control-label">
					{ ! isInspecting && __( 'Expand', 'quantum-viewports' ) }
					{ isInspecting && __( 'Collapse', 'quantum-viewports' ) }
				</div>
			</div>
		</div>
	);
}

export default ControlEdit;