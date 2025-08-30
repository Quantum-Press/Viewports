import { STORE_NAME } from '@viewports/store';

const {
	components: {
		ToggleControl,
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
 * Set component const to export toggle edit ui.
 */
export const ToggleEdit = () => {

	// Set state dependency.
	const {
		isActive,
		isEditing,
	} = useSelect( ( select ) => {
		return {
			isActive: select( STORE_NAME ).isActive(),
			isEditing: select( STORE_NAME ).isEditing(),
		}
	} );

	// Set dispatcher.
	const dispatcher = dispatch( STORE_NAME );

	/**
	 * Set function to fire on click.
	 */
	const onChange = () => {
		if( ! isActive ) {
			dispatcher.setEditing();
			dispatcher.setLoading();
		} else {
			if( ! isEditing ) {
				dispatcher.setEditing();
			} else {
				dispatcher.unsetEditing();
			}
		}
	}

	// Set classNames by states.
	const classNames = [ 'qp-viewports-toggle-edit' ];
	if( isEditing ) {
		classNames.push( 'is-editing' );
	}

	// Render component.
	return (
		<ToggleControl
			className={ classNames }
			label={ __( 'Edit on Viewport', 'viewports' ) }
			onChange={ onChange }
			checked={ isEditing }
		/>
	);
}
