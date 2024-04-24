import { STORE_NAME } from '../../store/constants';
import { svgs } from '../svgs';

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
		isEditing,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isInspecting: store.isInspecting(),
			isEditing: store.isEditing(),
		}
	}, [] );


	/**
	 * Set funtion to toggle edit.
	 *
	 * @since 0.1.0
	 */
	const onClickControl = () => {
		if( isEditing ) {
			dispatch( STORE_NAME ).unsetEditing();
		} else {
			dispatch( STORE_NAME ).setEditing();
		}
	}

	let classNamesEdit = 'qp-viewports-sidebar-control edit';
	if( isEditing ) {
		classNamesEdit = classNamesEdit + ' is-editing';
	}

	return (
		<div className={ classNamesEdit }>
			<div className="qp-viewports-sidebar-control-toggle" onClick={ onClickControl }>
				<div className="qp-viewports-sidebar-control-icon">
					<Icon icon={ svgs.edit }></Icon>
				</div>

				{ isInspecting &&
					<div className="qp-viewports-sidebar-control-label">
						{ ! isEditing && __( 'Edit viewports', 'quantum-viewports' ) }
						{ isEditing && __( 'Edit viewports: active', 'quantum-viewports' ) }
					</div>
				}
			</div>
		</div>
	);
}

export default ControlEdit;