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
		isExpanded,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isExpanded: store.isExpanded(),
		}
	}, [] );


	/**
	 * Set function to toggle expander.
	 *
	 * @since 0.1.0
	 */
	const onClickControl = () => {
		if( isExpanded ) {
			dispatch( STORE_NAME ).unsetExpanded();
		} else {
			dispatch( STORE_NAME ).setExpanded();
		}
	}

	return (
		<div className="qp-viewports-sidebar-control expander">
			<div className="qp-viewports-sidebar-control-toggle" onClick={ onClickControl }>
				{ ! isExpanded && <div className="qp-viewports-sidebar-control-icon">
					<Icon icon="arrow-right-alt2"></Icon>
					<Icon icon="arrow-right-alt2"></Icon>
				</div> }

				{ isExpanded && <div className="qp-viewports-sidebar-control-icon">
					<Icon icon="arrow-left-alt2"></Icon>
					<Icon icon="arrow-left-alt2"></Icon>
				</div> }

				<div className="qp-viewports-sidebar-control-label">
					{ ! isExpanded && __( 'Expand', 'quantum-viewports' ) }
					{ isExpanded && __( 'Collapse', 'quantum-viewports' ) }
				</div>
			</div>
		</div>
	);
}

export default ControlEdit;